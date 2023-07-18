const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

	@property(cc.Node)
	targetNode: cc.Node = null;

	@property(cc.Node)
	kinfeNode: cc.Node = null;

	@property(cc.Prefab)
	kinfePrefab: cc.Prefab = null;

	canThrow: boolean = true;

	nowKinfeNode = null
	kinfeNodeArr: Array<cc.Node> = [];
	onLoad() {
		this.spawnKinfe();
	}

	start() {
		this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
	}

	update(dt) {
		this.targetNode.angle += 200 * dt;

		for (let it of this.kinfeNodeArr) {
			it.angle += 200 * dt;

			let rad = Math.PI * (it.angle - 90) / 180;
			let r = this.targetNode.width / 2;

			it.x = this.targetNode.x + r * Math.cos(rad);
			it.y = this.targetNode.y + r * Math.sin(rad);

		}
	}

	onDestroy() {
		this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
	}

	onTouchStart(e: cc.Event.EventTouch) {
		this.throwKinfe();
	}

	spawnKinfe() {
		this.nowKinfeNode = cc.instantiate(this.kinfePrefab);

		this.kinfeNode.addChild(this.nowKinfeNode)
	}

	throwKinfe() {
		if (!this.canThrow) {
			return;
		}
		this.canThrow = false;
		let aim = this.targetNode.position;
		aim.y = this.targetNode.width / 2; 
		cc.tween(this.nowKinfeNode)
			.to(0.3, { position: aim })
			.call(() => {
				this.canThrow = true;
				this.kinfeNodeArr.push(this.nowKinfeNode);
				this.spawnKinfe();

			}).start();

	}

	isHite(): boolean {

		return true;
	}
}
