const { ccclass, property } = cc._decorator;

@ccclass
export default class MoveController extends cc.Component {

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.keyDown, this);
    }

    start() {
    }

    keyDown(e: cc.Event.EventKeyboard) {
        switch (e.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.node.emit('move', -1);
                break;

            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.node.emit('move', 1);
                break;

            case cc.macro.KEY.w:
            case cc.macro.KEY.up:
                this.node.emit('rotate', 1);
                break;

            case cc.macro.KEY.s:
            case cc.macro.KEY.down:
                this.node.emit('drop', 1);
                break;
        }
    }
}
