import {global} from './global'
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

	@property(cc.Prefab)
	blockPrefab: cc.Prefab = null

	@property(cc.SceneAsset)
	scene:cc.SceneAsset=null;

	lastBlockX: number = 0
	blockArr = []

	onLoad() {
		let phyManage = cc.director.getPhysicsManager();

		phyManage.enabled = true;
		phyManage.gravity = cc.v2(0, -3200);
		// cc.director.getPhysicsManager().debugDrawFlags =cc.PhysicsManager.DrawBits.e_shapeBit;
	}

	start() {
		this.node.on('gameStart', this.gameStart, this);
		this.node.on('gameOver', this.gameOver, this);
		this.initBlock();
	}

	update(dt) {
		if (!global.isGameStart) return;

		let changeNode=null;
		for (let it of this.blockArr) {
			it.x -= 300 * dt;	
		}
		if (this.blockArr[0].x < -cc.winSize.width) {
			this.blockArr[0].x = this.blockArr[this.blockArr.length - 1].x + 300
			changeNode=this.blockArr.shift();
			this.blockArr.push(changeNode);
		}
	}

	initBlock() {
		this.lastBlockX = 0;

		for (let i = 0; i < 6; i++) {
			let blockNode = cc.instantiate(this.blockPrefab)
			blockNode.x = this.lastBlockX
			// blockNode.y = 50
			this.node.addChild(blockNode)
			this.blockArr.push(blockNode)
			this.lastBlockX += 300+Math.random()*100;
		}
	}

	gameStart(ev: cc.Event.EventCustom) {
		global.isGameStart = true;
	}

	gameOver() {
		cc.log('game over'+this.scene.name);
		cc.director.loadScene(this.scene.name);
	}
}
