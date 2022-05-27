import Path from "./Path";

const { ccclass, property } = cc._decorator;

enum RobotFace {
	Left,
	Right,
}

@ccclass
export default class Robot extends cc.Component {
	@property(cc.SpriteFrame)
	spfLeft: cc.SpriteFrame = null;

	@property(cc.SpriteFrame)
	spfRight: cc.SpriteFrame = null;

	@property(cc.Label)
	txtPoints: cc.Label = null;

	private prevNode: cc.Node = null; // 上一次站着的节点
	private currentNode: cc.Node = null; // 当前站着的节点
	private nextNode: cc.Node = null; // 下一个节点
	private offset: cc.Vec3 = cc.v3(11, 120); // 机器人与障碍物中心间隔
	private mRobotFace: number = -1; // -1朝左，1朝右
	private jumpCallback: any = null;
	private _failed: Function = null;
	private _isJumping: boolean = false;
	private point: number = 0;

	// onLoad () {}

	start() {
		this.node.zIndex = 20000;
		this.txtPoints.string = `${this.point}`;
	}

	// update (dt) {}
	/**
	 * @description: 向左转
	 */
	turnLeft() {
		this.mRobotFace = RobotFace.Left;
		this.node.getComponent(cc.Sprite).spriteFrame = this.spfLeft;
	}

	/**
     * @description: 向右转

     */
	turnRight() {
		this.mRobotFace = RobotFace.Right;
		this.node.getComponent(cc.Sprite).spriteFrame = this.spfRight;
	}

	/**
	 * @description: 设置下一个节点
	 * @param {type}
	 * @return:
	 */
	setNext(node: cc.Node) {
		this.nextNode = node;
	}

	/**
	 * @description: 设置当前节点
	 * @param {type}
	 * @return:
	 */
	setCurrent(node: cc.Node) {
		this.currentNode = node;
		this.node.position = this.currentNode.position.add(this.offset);
	}

	getCurrent() {
		return this.currentNode;
	}

	setAddCallback(callback: any) {
		this.jumpCallback = callback;
	}

	setFailedCallback(callback: any) {
		this._failed = callback;
	}

	/**
	 * @description: 跳
	 * @param {type}
	 * @return:
	 */
	jump() {
		if (this.nextNode == null) {
			return;
		}
		this._isJumping = true;
		let curPos = this.node.position;
		let nextPos = this.nextNode.position;
		nextPos = nextPos.add(this.offset);

		// 是否能跳上去
		if (
			(this.mRobotFace == RobotFace.Left && nextPos.x < curPos.x) ||
			(this.mRobotFace == RobotFace.Right && nextPos.x > curPos.x)
		) {
			this.jumpNext(nextPos);
		}
		else {
		    //调整跳跃距离
            let targetPos = curPos;
            if (nextPos.x > curPos.x) {
                targetPos.x -= 130;
            } else {
                targetPos.x += 130;
            }
            targetPos.y += 65;
            
            this.jumpFail(targetPos);
		}
	}
	
	//跳到下一个路径上
	private jumpNext(nextPos:cc.Vec3){
        cc.tween(this.node)
        .then(cc.jumpTo(0.2, cc.v2(nextPos), 30, 1))
        .call(() => {
            //下一个节点赋值
            this.prevNode = this.currentNode;
            this.currentNode = this.nextNode;
            this.nextNode = this.currentNode.getComponent(Path).next.node;
            this._isJumping = false;

            //
            if (this.prevNode != null) {
                let box = this.prevNode.getComponent(Path);
                box.down(-this.getDownY(this.prevNode));
                this.prevNode = null;
            }
            //跳跃结束事件
            if (this.jumpCallback != null) {
                this.jumpCallback();
            }
            this.point++;
            this.txtPoints.string = `${this.point}`;
        })
        .start();
	}
	
	/**
     * 跳跃失败
     * @param targetPos 跳跃的目标坐标 
     */
	private jumpFail(targetPos:cc.Vec3){
    
        cc.tween(this.node)
            .then(cc.jumpTo(0.2, cc.v2(targetPos), 30, 1))
            .by(0.5, { y: -this.getDownY(this.node) })
                    .call(() => {
                        if (this._failed != null) {
                            this._failed();
                        }
                    })
            .start();
	}

    //底部y坐标
	getDownY(target: cc.Node) {
		let pos: cc.Vec3 = target.parent.convertToWorldSpaceAR(target.position);
		let y = pos.y + target.height;
		return y;
	}
    
    /**
        是否正在跳跃
    */
	public get isJumping() {
		return this._isJumping;
	}
}
