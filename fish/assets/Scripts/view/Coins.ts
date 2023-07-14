import CoinController from './CoinController'
const { ccclass, property } = cc._decorator;

@ccclass
export default class Coins extends cc.Component {
    @property(cc.Animation)
    anim: cc.Animation = null;

    init() {
        this.anim.play('gold_down');
    }

    onEnable() {
        this.init();
    }

    goDown(pos: cc.Vec3, toPos?: cc.Vec3) {
        this.node.position = pos;
        cc.tween(this.node)
            .parallel(
                cc.tween(this.node)
                    .to(0.8, { position: toPos }),
                cc.tween(this.node)
                    .to(0.8, { scale: 0.5 })
                    .call(() => { this.despawnCoin })
            )
            .start()
    }

    despawnCoin() {
        this.node.dispatchEvent(new cc.Event.EventCustom('despawn-coin', true));
    }

}
