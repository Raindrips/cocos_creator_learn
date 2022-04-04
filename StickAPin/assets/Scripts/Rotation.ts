
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    dir: number = 1;               //方向
    speed: number = 300;           //速度

    onLoad() {
        this.node.on('disable', this.disable, this)
        this.node.on('setSpeed', this.setSpeed, this)
    }

    setSpeed(speed: number, dir: number) {
        this.speed = speed;
        this.dir = dir;
    }
    disable() {
        this.enabled = false;
    }

    update(dt) {
        this.node.angle += this.dir * this.speed * dt;
    }
}
