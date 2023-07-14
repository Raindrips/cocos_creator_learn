const { ccclass, property } = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {

    @property(cc.SpriteAtlas)
    spAtlas: cc.SpriteAtlas = null

    // 子弹速度
    @property
    speed: number = 300;

    // 子弹攻击力，基础攻击力
    private attack: number = 4;
    // 子弹等级
    bulletLeve: number = 1;

    onLoad() {
        this.node.on('shot', this.shot, this);
    }

    //射击
    shot(weaponNode: cc.Node, level: number) {
        // 启动update函数
        let site = weaponNode.position;
        this.node.angle = weaponNode.angle;
        this.node.position = site;
        this.setBullet(level);
    }

    // 根据武器等级设置子弹等级
    setBullet(level: number) {
        this.bulletLeve = level;
        this.node.getComponent(cc.Sprite).spriteFrame = this.spAtlas.getSpriteFrame('bullet' + this.bulletLeve);
    }

    update(dt) {
        let bx = dt * this.speed * Math.sin(this.node.angle / 180 * Math.PI);
        let by = dt * this.speed * Math.cos(this.node.angle / 180 * Math.PI);
        this.node.x -= bx;
        this.node.y += by;

        let rect = this.node.parent.getBoundingBox();
        if (!rect.contains(this.node.getPosition())) {
            this.node.dispatchEvent(new cc.Event.EventCustom('despawn-bullet', true));
            cc.log('despawn-bullet');
        }
    }
    onCollisionEnter(other: cc.BoxCollider, self: cc.BoxCollider) {
        // 矩形碰撞组件顶点坐标，左上，左下，右下，右上
        let posb = self.world.points;
        // 取左上和右上坐标计算中点当做碰撞中点
        if (other.node.group == 'fish') {
            let event = new cc.Event.EventCustom('cast-net', true);
            event.setUserData(this.node.position);
            this.node.dispatchEvent(event);
            this.node.dispatchEvent(new cc.Event.EventCustom('despawn-bullet', true));
        }



    }

    getAttackValue(): number {
        return this.attack * this.bulletLeve;
    }
}
