import Weapon from "../view/Weapon";

import CoinController from '../view/CoinController';
import Net from "../view/Net";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    @property(cc.Prefab)
    bulletPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    netPrefab: cc.Prefab = null;

    @property(cc.Node)
    weaponNode: cc.Node = null;

    @property(cc.Node)
    coinController: cc.Node = null;

    //子弹对象池
    bulletPool: cc.NodePool;
    netsPool: cc.NodePool;
    
    oneBullet: cc.Node;
    oneFish: cc.Node;
    oneNet: cc.Node;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.bulletPool = new cc.NodePool();
        //网格池
        this.netsPool = new cc.NodePool();


    }

    start() {
        // 添加触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);

        this.node.on('despawn-bullet', this.despawnBullet, this);
        this.node.on('despawn-net', this.despawnNet, this);
        this.node.on('cast-net', this.castNet, this);
    }
    // update (dt) {}

    onTouchStart(event: cc.Event.EventTouch) {
        let self = this;
        // 触点是世界坐标，需要转换为和炮台一致的坐标系下
        let touchPos = cc.v3(this.node.convertToNodeSpaceAR(event.getLocation()));
        cc.log(touchPos.x + ' ' + touchPos.y);
        // 炮台坐标
        let weaponPos = this.weaponNode.position;
        // 炮台到触点的方向向量
        let dir = cc.v3(touchPos).sub(weaponPos);
        // 计算夹角，这个夹角是带方向的
        let angle = Math.atan2(dir.y, dir.x);
        //将弧度转换为欧拉角
        let degree = angle / Math.PI * 180;
        // 设置炮台角度
        this.weaponNode.angle = degree - 90;
        let bulletLevel = self.weaponNode.getComponent(Weapon).curLevel;

        this.shot(bulletLevel);
    }

    //发射炮弹
    shot(level: number) {
        if (this.bulletPool.size() > 0) {
            this.oneBullet = this.bulletPool.get(this);
        } else {
            this.oneBullet = cc.instantiate(this.bulletPrefab);
        }
        this.node.addChild(this.oneBullet);
        //this.oneBullet.emit('shot', this.weaponNode, level)
        // 剩余金币
        if (this.coinController == null) {
            return;
        }
        let coinController=this.coinController.getComponent(CoinController);
        let left = coinController.reduceCoin(level);
        if (left) {
            this.oneBullet.emit('shot', this.weaponNode, level)
        }
        else if (coinController.currentValue == 0) {
            //this.gameOver();
        }

    }


    castNet(event: cc.Event.EventCustom) {
        if (this.netsPool.size() > 0) {
            this.oneNet = this.netsPool.get(this);
        } else {
            this.oneNet = cc.instantiate(this.netPrefab);
        }
        let bullet=event.target;
        let bulletLevel:number = bullet.getComponent('Bullet').bulletLeve;
        this.oneNet.getComponent(Net).init(event.getUserData(), bulletLevel);
        this.node.addChild(this.oneNet);
    }

    despawnBullet(event: cc.Event.EventCustom) {
        this.bulletPool.put(event.target);
        event.stopPropagation();
    }

    despawnNet(event: cc.Event.EventCustom) {
        this.netsPool.put(event.target);
        event.stopPropagation();
    }
}
