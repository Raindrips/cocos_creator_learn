import CellNode from "./model/CellNode";
import { CellState } from "./model/CellState";

const { ccclass, property } = cc._decorator;

enum LifeState {
	alive,
	death,
	Unchanged,
}

@ccclass
export default class Main extends cc.Component {

	@property(cc.Prefab)
	cellPrefab: cc.Prefab = null

	@property(cc.Node)
	cellLayer: cc.Node = null

	private isPause: boolean = true;

	private speed = 0.25;

	private maxSize: number;
	private maxWCount: number;
	private maxHCount: number;

	private cellNodeGroup: cc.Node[][] = []


	onLoad() {
		this.maxSize = this.cellPrefab.data.getContentSize().width;
		this.maxWCount = this.cellLayer.width / this.maxSize;
		this.maxHCount = this.cellLayer.height / this.maxSize;
		for (let i = 0; i < this.maxHCount; i++) {
			this.cellNodeGroup[i] = [];
			for (let j = 0; j < this.maxWCount; j++) {
				let cellNode = cc.instantiate(this.cellPrefab);
				cellNode.position = cc.v3(j * this.maxSize, i * this.maxSize);
				cellNode.parent = this.node;
				this.cellNodeGroup[i][j] = cellNode;
			}
		}
	}

	start() {
		this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
	}

	onTouchStart(e: cc.Event.EventTouch) {
		let location = e.getLocation();
		let pos = this.cellLayer.convertToNodeSpaceAR(cc.v3(location));
		let y = (pos.y / this.maxSize) | 0;
		let x = (pos.x / this.maxSize) | 0;

		let cellNode = this.cellNodeGroup[y][x];
		let cellComp: CellNode = cellNode.getComponent(CellNode);
		cellComp.changeState();
	}


	//  
	update(dt) {
		if (this.isPause) {
			return;
		}
		this.next(dt, this.speed);
	}

	timer: number = 0;
	next(dt, frame) {
		this.timer += dt;
		if (this.timer >= this.speed) {
			this.lifeChange();
			this.timer = 0;
		}
	}
	lifeChange() {
		let nowStateMap: CellState[][] = [];
		let nextState: LifeState[][] = [];
		for (let y = 0; y < this.maxHCount; y++) {
			nowStateMap[y] = [];
			nextState[y] = [];
			for (let x = 0; x < this.maxWCount; x++) {
				let cellState = this.cellNodeGroup[y][x].getComponent(CellNode).state;
				nowStateMap[y][x] = cellState;
				nextState[y][x] = LifeState.Unchanged;
			}
		}

		for (let y = 0; y < this.maxHCount; y++) {
			for (let x = 0; x < this.maxWCount; x++) {
				nextState[y][x] = this.cellLifeCheck(nowStateMap, cc.v2(x, y));
			}
		}

		for (let y = 0; y < this.maxHCount; y++) {
			for (let x = 0; x < this.maxWCount; x++) {
				let cellNode = this.cellNodeGroup[y][x].getComponent(CellNode);
				switch (nextState[y][x]) {
					case LifeState.alive:
						cellNode.state = CellState.black;
						break;
					case LifeState.death:
						cellNode.state = CellState.white;
						break;
				}
			}
		}
	}

	cellLifeCheck(stateMap: CellState[][], index: cc.Vec2) {
		//周围8个方向的格子
		let gird = [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1],

			[-1, 1],
			[1, -1],
			[1, 1],
			[-1, -1],
		]

		let totalLife = 0;

		for (let g of gird) {
			let x = g[1] + index.x
			let y = g[0] + index.y
			if(this.inAear(y,this.maxHCount)||this.inAear(x,this.maxWCount)){
				continue;
			}
			x = this.clamp(x, 0, this.maxWCount - 1)
			y = this.clamp(y, 0, this.maxHCount - 1)
			let cellState = stateMap[y][x];
			if (cellState == CellState.black) {
				totalLife++;
			}


		}

		if (totalLife == 3) {
			return LifeState.alive;
		}
		else if (totalLife == 2) {
			return LifeState.Unchanged;
		}
		return LifeState.death;
	}

	clamp(v: number, less: number, higt: number) {
		if (v < less) {
			return less;
		}
		if (v > higt) {
			return higt;
		}
		return v;
	}
	inAear(v:number,m:number){
		return v<0||v>=m;
	}
	
	pauseClick() {
		this.isPause = !this.isPause;
	}

	resetCell() {
		for (let y = 0; y < this.maxHCount; y++) {
			for (let x = 0; x < this.maxWCount; x++) {
				let cellNode = this.cellNodeGroup[y][x].getComponent(CellNode);
				cellNode.state = CellState.white;
			}
		}
	}

	motifySpeed(s: cc.Slider, e: cc.Event.EventCustom) {
		this.speed = s.progress
	}
}
