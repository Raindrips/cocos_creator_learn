
const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

	@property(cc.Label)
	levelLabel: cc.Label = null;

	@property(cc.Label)
	timeLabel: cc.Label = null;

	@property(cc.Prefab)
	ballPrefab: cc.Prefab = null;

	@property(cc.Node)
	startNode: cc.Node = null;

	@property(cc.Node)
	gameoverNode: cc.Node = null;

	@property
	level: number = 1;

	@property
	resetTime:number=6;
	
	countDown: number = 0;

	_ballNodeArr: cc.Node[] = null;
	_isgameOver:boolean=false;

	onLoad() {
		this._ballNodeArr = [];
		this._ballNodeArr.length = this.level;
	}

	start() {
		this.initMap()
	}

	initMap() {
		this.countDown=this.resetTime;
		this.node.removeAllChildren();
		for (let i = 0; i < this.level * 4; i++) {
			let ballNode = cc.instantiate(this.ballPrefab)
			this.node.addChild(ballNode)
		}
	}

	timeUpdate(dt){
		this.countDown-=dt;
		this.countDown=this.countDown<0?0:this.countDown;
		if(this.timeLabel){
			this.timeLabel.string=this.countDown.toFixed(2)
		}
	}

	update(dt) {
		this.timeUpdate(dt);
		this.levelLabel.string = this.level.toString();
		if (this.isWin()) {
			this.nextLevel();
		}
		this.checkGameover();
	}

	nextLevel(){
		this.level = this.level + 1;
			if (this.level > 4) {
				this.level = 4;
			}
			this.initMap();
	}

	resetLevel(){
		this.level =1;
		this.initMap();
		this._isgameOver=false;
	}

	isWin(): boolean {
		let children = this.node.children;
		let id1 = children[0].getComponent('ball').id;
		for (let i = 1; i < children.length - 1; i++) {
			let id2 = children[i + 1].getComponent('ball').id;
			if (id1 != id2) {
				return false;
			}
		}
		return true;
	}

	checkGameover(){
		if(this._isgameOver){
			return;
		}
		if(this.countDown<=0){
			this.gameover();
			this._isgameOver=true;
		}
	}

	gameover(){
		if(this.gameoverNode){
			this.gameoverNode.active=true;
		}
		this.scheduleOnce(()=>{
			this.resetLevel();
			this.gameoverNode.active=false;
		},2)
	}

	isRowSame(index):boolean{
		let children = this.node.children;
		let start=index*this.level
		let id1 = children[start].getComponent('ball').id;
		for (let i = 1; i < start+4; i++) {
			let id2 = children[i + 1].getComponent('ball').id;
			if (id1 != id2) {
				return false;
			}
		}
	}
}
