
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;


    set Text(val: string) {
        this.label.string = val;
    }

    onLoad() {
        this.init();
    }

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this)
        this.node.on('error', this.error, this);
        cc.game.on('stop-touch', this.stopTouch, this);
    }

    init() {
        let s = cc.winSize;
        this.node.width = s.width / 4 - 1;
        this.node.height = s.height / 5 - 2;

        this.node.color = cc.Color.WHITE;
        let forge = this.node.getChildByName('forge');
        forge.width = s.width / 4 - 1;
        forge.height = s.height / 5 - 2;
        forge.color = cc.Color.BLACK;
    }

    // update (dt) {}

    touchStart(event: cc.Event.EventTouch) {

        this.node.parent.emit('touch', this.node);
        cc.tween(this.node)
            .to(0.25, { color: cc.Color.WHITE })
            .start();
    }
    

    error() {
        let tint = cc.tween(this.node)
            .to(0.1, { color: cc.Color.RED })
            .to(0.1, { color: cc.Color.WHITE })
            .to(0.1, { color: cc.Color.RED })

        cc.tween(this.node)
            .repeat(3, tint.clone())
            .start();
    }

    stopTouch(){
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this)
    }
}
