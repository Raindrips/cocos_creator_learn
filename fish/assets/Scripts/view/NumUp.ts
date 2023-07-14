import CoinController from './CoinController'
const { ccclass, property } = cc._decorator;

@ccclass
export default class NumUp extends cc.Component {


    @property(cc.Animation)
    anim: cc.Animation = null;

    @property(cc.SpriteAtlas)
    numAtlas: cc.SpriteAtlas = null;

    @property(cc.Sprite)
    tensPlace: cc.Sprite = null;

    @property(cc.Sprite)
    onesPlace: cc.Sprite = null;


    init(pos: cc.Vec3, num: number) {
        let str = num.toString();
        let nums = str.split('');
        if (nums.length == 1) {
            this.onesPlace.node.active = false;
            this.tensPlace.spriteFrame = this.numAtlas.getSpriteFrame('goldnum_' + nums[0]);
        } else {
            this.onesPlace.node.active = true;
            this.tensPlace.spriteFrame = this.numAtlas.getSpriteFrame('goldnum_' + nums[0]);
            this.onesPlace.spriteFrame = this.numAtlas.getSpriteFrame('goldnum_' + nums[1]);
        }
        this.node.position = pos;
        this.anim.play('coin_up');
        this.node.on(cc.Animation.EventType.FINISHED, this.despawn, this);
    }

    despawn() {
        this.node.dispatchEvent(new cc.Event.EventCustom('despawn-coinup', true));
    }
}
