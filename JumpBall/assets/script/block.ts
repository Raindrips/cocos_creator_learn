const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

	onLoad() {
		let width=Math.random()*120+80;
		this.node.width=width;
		let box = this.node.getComponent(cc.PhysicsBoxCollider);
		box.size=cc.size(width,this.node.height)
	}

	start() {

	}

	// update(dt) {}

}