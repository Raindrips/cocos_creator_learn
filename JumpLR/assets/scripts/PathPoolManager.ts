const { ccclass, property } = cc._decorator;

//节点池
@ccclass
export default class PathManager {
	private static boxNodePool: cc.NodePool = null;
	

	public static putBox(box: cc.Node) {
		if (this.boxNodePool == null) {
			this.boxNodePool = new cc.NodePool();
		}
		if (box) {
			box.stopAllActions();
			this.boxNodePool.put(box);
		}
	}

	public static getBox() {
		if (this.boxNodePool != null && this.boxNodePool.size() > 0) {
			let box = this.boxNodePool.get();
			return box;
		}
		return null;
	}
}
