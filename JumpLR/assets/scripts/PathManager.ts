import Path from "./Path";
import PathManager from "./PathPoolManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoxManager extends cc.Component {
	// 障碍物父节点
	@property(cc.Node)
	nodeParent: cc.Node = null;

	// 障碍物预制
	@property(cc.Prefab)
	prefabBox: cc.Prefab = null;


	private intervalX: number = 0; // X间距
	private intervalY: number = 0; // Y间距
	private startY: number = 0; // 起始位置

	private _maxOffset: number = 3; // 最大偏移量
	private currentOffset: number = 0; // 当前偏移量
	private mMaxZIndex: number = 10000; // 最大层级
	private currZIndex: number = 0; // 当前层级

	private startBox: cc.Node = null; // 障碍物链头
	private lastBox: cc.Node = null; // 路径结尾

	private pathGroup: cc.Node[] = []; // 保存所有路径

	onLoad() {
		this.startY=200;
		this.intervalX = this.prefabBox.data.width * 0.5;
		this.intervalY = this.prefabBox.data.height * 0.5;
	}

	start() {
		this.node.on("spawn-path", this.spawnPath, this);
	}

	/**
	 * @description: 生成一个障碍物
	 */
	getBox() {
		let box = PathManager.getBox();
		if (box == null) {
			box = cc.instantiate(this.prefabBox);
		}
		return box;
	}

	/**
	 * @description: 回收一个障碍物
	 */
	putBox(box: cc.Node) {
		if (box != null) {
			PathManager.putBox(box);
		}
	}

	/**
	 * @description: 获取随机值 -1 或 1
	 * @param {type}
	 * @return:
	 */
	public getRandom() {
		let ran = Math.random(); //[0,1)
		return ran < 0.5 ? -1 : 1;
	}

	public getIntervalX() {
		return this.intervalX;
	}

	public getIntervalY() {
		return this.intervalY;
	}

	/**
	 * @returns 获取链头
	 */
	public getStartBox() {
		return this.startBox;
	}

	public getLastBox() {
		return this.lastBox;
	}

	/**
	 * 生成障碍物
	 */
	public reload(count:number) {
		this.currZIndex = this.mMaxZIndex;
		for (let i = 0; i < count; i++) {
			this.spawnPath();
		}
	}

	public spawnPath() {
		//计算y坐标
		let y = this.startY + this.intervalY;
		if (this.lastBox) {
			y = this.lastBox.position.y + this.intervalY;
		}

		let box = this.getBox();
		// 链头
		if (this.startBox == null) {
			this.startBox = box;
		}
		// 链尾
		this.lastBox = box;

		const random = this.getRandom();
		// 第一个居中 最左或最右就反向
		const temp = this.currentOffset + random;
		if (temp > this._maxOffset || temp < -this._maxOffset) {
			this.currentOffset -= random;
		} else {
			this.currentOffset += random;
		}
		box.x = this.currentOffset * this.intervalX;
		box.y = y;
		box.zIndex = this.currZIndex;
		box.parent = this.nodeParent;
		let boxComp = box.getComponent(Path);
		boxComp.setNum(this.currZIndex);

		//链表赋值
		if (this.pathGroup.length > 0) {
			let last = this.pathGroup[this.pathGroup.length - 1];
			console.log(last);
			last.getComponent(Path).next = boxComp;
		}

		this.pathGroup.push(box);
		this.currZIndex--;
	}
	// update (dt) {}
}
