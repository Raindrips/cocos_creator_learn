import LevelData from "./data/LevelData";
import LevelManager from "./manager/LevelManager";
import { GameState } from "./utils/GameState";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  @property(cc.Prefab)
  smallBallPrefab: cc.Prefab = null;

  @property(cc.Node)
  background: cc.Node = null;

  @property(cc.JsonAsset)
  jsonAsset: cc.JsonAsset = null;

  @property(cc.Label)
  levelLabel: cc.Label = null;

  @property(cc.Node)
  pinPanel: cc.Node = null;

  @property({
    displayName: "大球",
    type: cc.Node,
  })
  bigBall: cc.Node = null;

  //待发射的小球
  smallBallList: cc.Node[];
  currentLevel: number; //当前的关卡
  isGameStart: boolean = false; //游戏是否开始

  levelManager: LevelManager = null;
  data:LevelData=null;

  onLoad() {
    this.initLevelDate();
  }

  start() {
    this.stareGame();
  }

  // update (dt) {}

  initLevelDate() {
    this.smallBallList = [];
    this.levelManager = new LevelManager(this.jsonAsset.json);
    //当前的关卡
    this.currentLevel = this.levelManager.userData;
    this.node.on("game-over", this.gameOver, this);

    this.data = this.levelManager.getLevelData();
    if (!this.data) {
        this.data=this.getDefaultDate();
    }
  }

  //开始游戏
  stareGame() {
    this.background.emit("setState", GameState.StartGame);
    this.loadLevel();
    this.loadBigBall();
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.isGameStart = true;
  }

  //加载关卡
  loadLevel() {
    this.pinPanel.destroyAllChildren();
    this.levelManager.loadLevel(this.currentLevel);

    
      this.levelLabel.string = "第 " + this.currentLevel + " 关";
      
      this.smallBallList.length = 0;
      for (let i = 0; i < this.data.small; i++) {
        let ball = cc.instantiate(this.smallBallPrefab);
        ball.parent = this.pinPanel;
        ball.emit("setText", this.data.small - i);
        ball.emit("setEnable", false);
        this.smallBallList.push(ball);
      }
  }

  //打球初始化默认的球的数量
  loadBigBall() {
    this.bigBall.destroyAllChildren();
   
    this.bigBall.emit("setSpeed", this.data.speed, this.data.dir);
    let count = this.data.big;
    let degree = 360 / count;
    for (let i = 0; i < count; i++) {
      let ball = cc.instantiate(this.smallBallPrefab);
      this.ballLink(ball, i * degree);
    }
  }

  onTouchStart(event: cc.Event.EventTouch) {
    //游戏还没有开始
    if (!this.isGameStart) {
      return;
    }
    //
    if (this.smallBallList.length < 0) {
      return;
    }
    this.emitPin();
  }

  //发射针
  emitPin() {
    let bullet = this.smallBallList.shift();
    bullet.emit("setEnable", true);
    let worldPos = bullet.parent.convertToWorldSpaceAR(bullet.position);
    bullet.parent = this.bigBall.parent;
    bullet.position = this.bigBall.parent.convertToNodeSpaceAR(worldPos);
    let des = cc.v3(0, this.bigBall.y);
    cc.tween(bullet)
      .to(0.05, { position: des })
      .call(() => {
        bullet.parent = this.bigBall;
        let angle = (this.bigBall.angle % 360) + 180;
        this.ballLink(bullet, angle);
        this.checkPass();
      })
      .start();
  }

  //针的连接
  ballLink(ball: cc.Node, angle: number) {
    ball.parent = this.bigBall;
    //角度转弧度
    let radian = cc.misc.degreesToRadians(angle);
    ball.x = radian * Math.sin(radian);
    ball.y = radian * Math.cos(radian);
    ball.angle = 180 - angle;
    ball.group = "ball";
  }

  //是否到达下一关
  checkPass() {
    if (this.isGameStart && this.smallBallList.length == 0) {
      this.isGameStart = false;
      this.background.emit("setState", GameState.NextLevel);
      //关闭触摸事件
      this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);

      this.scheduleOnce(() => {
        this.currentLevel++;
        this.stareGame();
      }, 2);
    }
  }

  gameOver() {
    if (!this.isGameStart) {
      return;
    }
    this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.background.emit("setState", GameState.GameOver);
    this.scheduleOnce(() => {
      this.currentLevel = 1;
      this.stareGame();
    }, 2);
  }

  //保底,部分浏览器会无法读取json
  getDefaultDate():LevelData{
    let levelData:LevelData={
        level:1,
        big:5,
        small:10,
        speed:200,
        dir:1
    }
    return levelData;
  }
}
