import CoinController from "../view/CoinController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    fishPrefab: cc.Prefab = null;

    @property(cc.Node)
    coinController:cc.Node=null

    //鱼对象池
    fishPool: cc.NodePool = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.fishPool = new cc.NodePool();
        let initCount = 20;
        for (let i = 0; i < initCount; ++i) {
            let fish = cc.instantiate(this.fishPrefab);
            this.fishPool.put(fish);

        }
    }

    start() {
        this.schedule(this.creatFish, 2);

        this.node.on('despawn-fish', this.despawnFish, this);
    }

    // update (dt) {}

    creatFish() {
        //一次创建3条鱼
        let fishCount = 3;
        for (let i = 0; i < fishCount; ++i) {
            let fish: cc.Node = null;
            if (this.fishPool.size() > 0) {
                fish = this.fishPool.get();
            } else {
                fish = cc.instantiate(this.fishPrefab);
            }
            this.node.addChild(fish);
        }
    }

    despawnFish(event: cc.Event.EventCustom) {
        let node: cc.Node = event.target;
        let coin= this.coinController.getComponent(CoinController)
        coin.gainCoins(node.position,event.getUserData());
        this.fishPool.put(event.target);
        event.stopPropagation();
    }
}
