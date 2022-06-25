import Path from "./Path";
import BoxManager from "./PathManager";
import Robot from "./Robot";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Node)
    nodeBg: cc.Node = null;

    @property(cc.Node)
    nodeRobot: cc.Node = null;

    @property(cc.Node)
    nodeEnd: cc.Node = null;

    @property(cc.Label)
    txtPoints: cc.Label = null;

    // 是否正在移动
    private mIsPlaying: boolean = false;
    private mPoints: number = 0;
    
    private downCount=0;

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.mPoints = 0;
    }
    
     /**
     * @description: 点击屏幕
     * @param {type} 
     * @return: 
     */
    onTouchStart(event:cc.Event.EventTouch){
        event.stopPropagation();
        if(!this.mIsPlaying||
            this.nodeRobot.getComponent(Robot).isJumping){
            return;
        }
        this.mIsPlaying = true;
        this.bgDown();
       
        //左右跳跃
        let location = event.getLocation();
        if(location.x < cc.winSize.width / 2){
            this.robotJumpLeft();
        }else{
            this.robotJumpRight();
        }  
    }

    start () {
        this.reloadBox();
        this.nodeRobot.on('jump-ended',this.onAddPoints,this);
        this.nodeRobot.on('jump-failed',this.onGameEnd,this);
        this.mIsPlaying = true;
    }

    onAddPoints(){
        this.mPoints++;
    }

    onGameEnd(){
        this.mIsPlaying  = false;

        this.txtPoints.string = `得分：${this.mPoints}`;
        this.nodeEnd.active = true;
    }

    reloadBox(){
        let boxMgr = this.getComponent(BoxManager);
        boxMgr.reload(20);

        let robot = this.nodeRobot.getComponent(Robot);
        if(robot.getCurrent() == null){
            let standBox = boxMgr.getStartBox();
            let nextBox = standBox.getComponent(Path).next;

            robot.setCurrent(standBox);
            robot.setNext(nextBox.node);
            
            //this.nodeRobot.position=standBox.position;

            if(nextBox.node.x > standBox.x){
                robot.turnRight();
            }else{
                robot.turnLeft();
            }
        }else{
            robot.setCurrent(robot.getCurrent());
        }
    }

    robotJumpLeft(){
        let robot = this.nodeRobot.getComponent(Robot);
        robot.turnLeft();
        robot.jump();
        
        let boxMgr = this.getComponent(BoxManager);
        boxMgr.spawnPath();
    }

    robotJumpRight(){
        let robot = this.nodeRobot.getComponent(Robot);
        robot.turnRight();
        robot.jump();
        
        let boxMgr = this.getComponent(BoxManager);
        boxMgr.spawnPath();
    }

    // update (dt) {}

    /**
     * @description: 背景下移
     * @param {type} 
     * @return: 
     */
    bgDown(){
        let maxY = -cc.winSize.height / 2 - 2 * cc.winSize.height;
        let interval = this.node.getComponent(BoxManager).getIntervalY();
        
        this.downCount++;
        // 超出了，刷屏
        // if(this.nodeBg.y - interval <= maxY){
        if(this.downCount>=45){
            //this.nodeBg.y += 2 * cc.winSize.height;
            //this.reloadBox();
            cc.game.emit('background-reset');
            this.downCount=0;
        }

        // 下移   
        cc.tween(this.nodeBg)
        .by(0.2,{y:-interval})
        .start()
    }

    onClick(){
        this.nodeEnd.active = false;
        cc.director.loadScene('game');
        cc.log(cc.director.getScene().name);
        
    }
}
