import Path from "./Path";
import NodeManager from "./NodePoolManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoxManager extends cc.Component {
	// 障碍物父节点
	@property(cc.Node)
	nodeParent: cc.Node = null;

	// 障碍物预制
	@property(cc.Prefab)
	prefabBox: cc.Prefab = null;

	private mMaxY: number = 0; // 最大Y坐标
	private memMinY: number = 0; // 需要保留的最小Y值
	private intervalX: number = 0; // X间距
	private intervalY: number = 0; // Y间距
	private startY: number = 200; // 起始位置

	private mMaxOffset: number = 3; // 最大偏移量
	private currentOffset: number = 0; // 当前偏移量
	private mMaxZIndex: number = 10000; // 最大层级
	private currZIndex: number = 0; // 当前层级

	private startBox: cc.Node = null; // 障碍物链头
	private lastBox: cc.Node = null; // 路径结尾
	private isNew: boolean = true;

	private newBox: cc.Node[] = []; // 所有的障碍物
	private memBox: cc.Node[] = []; // 需要保存的障碍物

	private pathGroup: cc.Node[] = []; // 保存所有路径

	onLoad() {
		this.mMaxY = 3 * cc.winSize.height + this.prefabBox.data.height / 2;
		this.memMinY = 2 * cc.winSize.height - this.prefabBox.data.height / 2;
		this.intervalX = this.prefabBox.data.width * 0.5;
		this.intervalY = this.prefabBox.data.height * 0.5;
	}

	start() {
		//this.reloadAll();
		
		this.node.on('spawn-path',this.spawnPath,this);
	}

	/**
	 * @description: 生成一个障碍物
	 */
	getBox() {
		let box = NodeManager.getBox();
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
			NodeManager.putBox(box);
		}
	}

	//回收全部
	clearAll() {
		if (this.memBox != null) {
			for (let i = 0; i < this.memBox.length; i++) {
				this.putBox(this.memBox[i]);
			}
			this.memBox = [];
		}

		if (this.newBox != null) {
			for (let i = 0; i < this.newBox.length; i++) {
				this.putBox(this.newBox[i]);
			}
			this.newBox = [];
		}
	}

	/**
	 * @description: 重新加载所有障碍物
	 */
	reloadAll() {
		for (let i = 0; i < this.newBox.length; i++) {
			this.putBox(this.newBox[i]);
		}
		this.newBox = [];

		this.currZIndex = this.mMaxZIndex;
		if (this.memBox.length <= 0) {
			this.isNew = true;
			this.currentOffset = 0;
			this.reloadNew(this.startY);
		} else {
			// this.isNew = false;
			// let i = 0;
			// while(i < this.memBox.length){
			//     this.memBox[i].y -= (2 * cc.winSize.height);
			//     this.memBox[i].zIndex = this.currZIndex;
			//     this.memBox[i].getComponent(Box).setNum(this.currZIndex);
			//     this.currZIndex--;
			//     this.newBox.push(this.memBox[i]);
			//     i++;
			// }
			// let last = this.memBox[this.memBox.length - 1];
			// this.memBox = [];
			// this.currentOffset = last.getComponent(Box).offset;
			// cc.log('CurrOffset', this.currentOffset);
			// this.reloadNew(last.y);
		}
	}

	/**
	 * @description: 重新加载新的障碍物（不包含换屏的）
	 */
	reloadNew(startY: number) {
		let y = startY + this.intervalY;
		while (y < this.mMaxY) {
			let box = this.getBox();

			// 障碍物链
			if (this.startBox == null) {
				this.startBox = box;
			}

			let random = this.getRandom();
			// 第一个居中
			if (!this.isNew) {
				//最左或最右就反向
				if (
					this.currentOffset + random > this.mMaxOffset ||
					this.currentOffset + random < -this.mMaxOffset
				) {
					this.currentOffset -= random;
				} else {
					this.currentOffset += random;
				}
			}
			this.isNew = false;

			//修改节点属性
			box.x = this.currentOffset * this.intervalX;
			box.y = y;
			box.zIndex = this.currZIndex;
			let boxComp = box.getComponent(Path);
			boxComp.setNum(this.currZIndex);
			this.currZIndex--;
			box.parent = this.nodeParent;

			// 循环添加新节点
			if (y >= this.memMinY) {
				if (this.memBox.length > 0) {
					let last = this.memBox[this.memBox.length - 1];
					last.getComponent(Path).next = boxComp;
				} else {
					this.newBox[this.newBox.length - 1].getComponent(Path).next = boxComp;
				}
				this.memBox.push(box);
			} else {
				if (this.newBox.length > 0) {
					this.newBox[this.newBox.length - 1].getComponent(Path).next = boxComp;
				} else {
					boxComp.prev = null;
				}
				this.newBox.push(box);
			}
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
	public reload() {
		this.currZIndex = this.mMaxZIndex;
		for (let i = 0; i < 20; i++) {
            this.spawnPath();
		}
	}

	public spawnPath() {
	    //计算y坐标
        let y = this.startY + this.intervalY;
	    if(this.lastBox){
            y=this.lastBox.position.y+ this.intervalY;
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
		if (temp > this.mMaxOffset || temp < -this.mMaxOffset) {
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
