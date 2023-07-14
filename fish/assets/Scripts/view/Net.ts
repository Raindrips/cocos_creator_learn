const { ccclass, property } = cc._decorator;

@ccclass
export default class Net extends cc.Component {

    @property(cc.Animation)
    anim: cc.Animation = null;

    curLevel: number = 1;

    start() {
        //this.init();
    }

    init(position: cc.Vec3, level: number) {
        this.curLevel = level;
        this.node.position = position;
        this.anim.play('net_' + this.curLevel);
        this.node.on(cc.Animation.EventType.FINISHED, this.despawnNet);
    }

    despawnNet() {
        cc.log('despawn-net');
        this.node.dispatchEvent(new cc.Event.EventCustom('despawn-net', true));
        
    }

}
