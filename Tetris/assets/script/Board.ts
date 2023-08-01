import { BlockType, Data } from "./BlockType";
import TimeInterval from "./TimeInterval";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  @property(cc.Node)
  nextNode: cc.Node = null;

  @property(cc.Prefab)
  blockPrefab: cc.Prefab = null;

  @property(cc.JsonAsset)
  jsonData: cc.JsonAsset = null;

  @property
  public frameTime: number = 1;
  @property
  public colsNum: number = 0;
  @property
  public rowsNum: number = 0;

  // private isStart: boolean = false; //
  private gridWidth: number = 0; //格子宽度

  private pieceMap: cc.Node[][]; //棋盘地图
  private nextMap: cc.Node[][]; //下一个方块的地图

  private pieceData: number[][]; //地图数据
  private playerDate: number[][]; //玩家控制的方块数据
  private playerPos: cc.Vec2; //玩家方块坐标

  private nextBlock: BlockType;

  public onLoad() {
    this.node.on("move", this.playerMove, this);
    this.node.on("rotate", this.playerRotate, this);
    this.node.on("drop", this.playerDrop, this);
    this.node.on("reset", this.resetGame, this);
  }

  start() {
    this.init();
  }

  private init() {
    this.initData();
    this.initView();
    this.initPlayer();
    this.playerReset();
    // this.isStart = true;
    let timeinterval = this.node.getComponent(TimeInterval);
    timeinterval.isStart = true;
  }

  _delay: number = 0;
  update(dt: number) {
    // if (!this.isStart) {
    //   return;
    // }
    // if (this._delay > this.frameTime) {
    //   this._delay -= this.frameTime;
    //   this.playerDrop();
    // }
    // this._delay += dt;
    this.drawView();
  }

  private initData() {
    let w: number = this.colsNum,
      h: number = this.rowsNum;
    const matrix = [];
    while (h--) {
      matrix.push(new Array(w).fill(0));
    }
    this.pieceData = matrix;
  }

  private initView() {
    this.gridWidth = this.node.width / this.colsNum;
    this.pieceMap = [];
    for (let y = 0; y < this.rowsNum; y++) {
      this.pieceMap[y] = [];
      for (let x = 0; x < this.colsNum; x++) {
        const node = this.createNode(x, y);
        this.pieceMap[y][x] = node;
        this.node.addChild(node);
      }
    }
    this.nextMap = [];
    for (let y = 0; y < 4; y++) {
      this.nextMap[y] = [];
      for (let x = 0; x < 4; x++) {
        const node = this.createNode(x, y);
        this.nextMap[y][x] = node;
        this.nextNode.addChild(node);
      }
    }
  }

  private createNode(x: number, y: number) {
    let pieceNode = cc.instantiate(this.blockPrefab);
    pieceNode.width = this.gridWidth;
    pieceNode.height = this.gridWidth;
    pieceNode.x = x * this.gridWidth;
    pieceNode.y = y * this.gridWidth;
    return pieceNode;
  }

  private initPlayer() {
    this.playerPos = cc.v2(0, 0);
    this.playerDate = [];
    this.nextBlock = this.randomBlock();
  }

  private drawView() {
    // if(this.pieceMap.length==0||
    // 	this.nextMap.length==0||
    // 	this.pieceData.length==0){
    // 	return;
    // }
    this.clear();
    this.drawMatrix(this.pieceData);
    this.drawMatrix(this.playerDate, this.playerPos);
    this.drawNext();
  }

  private drawMatrix(matrix: number[][], v2: cc.Vec2 = cc.v2()) {
    // for(let row of matrix){
    // 	for(let value of row){

    // 	}
    // }
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
				let vy = y + v2.y;
				let vx = x + v2.x;
        if (value !== 0) {       
          if (
            vy < 0 ||
            vx < 0 ||
            vy >= this.pieceMap.length ||
            vx >= this.pieceMap[0].length
          ) {						
            //continue
						console.log(`y=${y} x=${x} lenx=${matrix.length} leny=${matrix[0].length} `)
          } else {
						this.setColor(this.pieceMap[vy][vx], value);
						this.pieceMap[vy][vx].active = true;
          }
					
        }
      });
    });
  }

  private drawNext() {
    let next = this.createBlock(this.nextBlock);
    next.forEach((row, y) => {
      row.forEach((value, x) => {
        this.setColor(this.nextMap[y][x], value);
        this.nextMap[y][x].active = true;
      });
    });
  }

  private setColor(node: cc.Node, index: number) {
    let colorString = this.jsonData.json[index.toString()];
    let color = cc.Color.fromHEX(node.color, colorString);
    node.color = color;
  }

  private clear() {
    for (let y = 0; y < this.rowsNum; y++) {
      for (let x = 0; x < this.colsNum; x++) {
        this.pieceMap[y][x].active = false;
      }
    }

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        this.nextMap[y][x].active = false;
      }
    }
  }

  //重新生成方块
  private playerReset() {
    //游戏结束
    // if (this.collide()) {
    //   // this.isStart = false;
    // 	let timeinterval = this.node.getComponent(TimeInterval);
    // 	timeinterval.isStart=false;
    //   return;
    // }
    this.playerDate = this.createBlock(this.nextBlock);
    this.playerPos.y = this.rowsNum - this.playerDate.length;
    this.playerPos.x =
      ((this.pieceData[0].length / 2) | 0) -
      ((this.playerDate[0].length / 2) | 0);
    this.nextBlock = this.randomBlock();
  }

  private randomBlock() {
    let r = (Math.random() * 7) | 0;
    return r as BlockType;
  }

  private resetGame() {
    this.initData();
    this.playerReset();
    this.clear();
    // this.isStart = true;
    let timeinterval = this.node.getComponent(TimeInterval);
    timeinterval.isStart = true;
  }

  private createBlock(type: BlockType): number[][] {
    return Data.get(type);
  }

  //撞到方块
  private collide(): boolean {
    const p = this.playerDate;
    const o = this.playerPos;
    for (let y = 0; y < p.length; y++) {
      for (let x = 0; x < p[y].length; x++) {
        if (
          p[y][x] !== 0 &&
          (this.pieceData[y + o.y] && this.pieceData[y + o.y][x + o.x]) !== 0
        ) {
          return true;
        }
      }
    }
    return false;
  }

  //合并玩家操作的数据和地图的数据
  private merge() {
    this.playerDate.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.pieceData[y + this.playerPos.y][x + this.playerPos.x] = value;
        }
      });
    });
  }

  private rotate(matrix: number[][], dir: number) {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < y; x++) {
        [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        54;
      }
    }
    if (dir > 0) {
      matrix.forEach((row) => row.reverse());
    } else {
      matrix.reverse();
    }
  }

  //将玩家的数组进行交换
  private arenaSweep() {
    let rowCount = 1;
    outer: for (let y = 0; y < this.pieceData.length - 1; y++) {
      for (let x = 0; x < this.pieceData[y].length; x++) {
        if (this.pieceData[y][x] === 0) {
          continue outer;
        }
      }
      const row = this.pieceData.splice(y, 1)[0].fill(0);
      this.pieceData.push(row);
      y--;
      rowCount *= 2;
    }
  }

  public playerDrop() {
    this.playerPos.y--;

    if (this.collide()) {
      console.log("collide");
      this.playerPos.y++;
      this.merge();
      this.playerReset();
      this.arenaSweep();
    }
  }

  public playerRotate(dir: number) {
    const pos = this.playerPos.x;
    let offset = 1;
    this.rotate(this.playerDate, -dir);
    while (this.collide()) {
      this.playerPos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > this.playerDate.length) {
        this.rotate(this.playerDate, dir);
        this.playerPos.x = pos;
        return;
      }
    }
  }

  public playerMove(offset: number) {
    this.playerPos.x += offset;
    if (this.collide()) {
      this.playerPos.x -= offset;
    }
  }
}
