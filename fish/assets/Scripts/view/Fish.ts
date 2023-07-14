import { FishState, FishType } from '../model/FishType';
import Game from './Game';
import Bullet from './Bullet';
// import Fluxay from './FluxayFrag';
const { ccclass, property } = cc._decorator;



@ccclass
export default class Fish extends cc.Component {

    @property(cc.SpriteAtlas)
    spAtlas: cc.SpriteAtlas = null;

    @property(cc.JsonAsset)
    jsonData: cc.JsonAsset = null;

    anim: cc.Animation = null;

    // Health point 血量 默认10
    hp: number = 10;
    // gold 打死掉落金币数量
    gold: number = 2;

    // fish state 鱼的生命状态，默认都是活的
    fishState: FishState = FishState.alive;

    // 保存上一次坐标,用于更新角度
    lastPosition: cc.Vec3;

    allFishType: FishType[];
    fishType: FishType;

    //暂存game实例
    game: Game;

    //鱼移动的贝塞尔曲线
    bezier1: cc.Vec2[] = [cc.v2(50, -100), cc.v2(300, -400), cc.v2(1800, -650)];
    bezier2: cc.Vec2[] = [cc.v2(100, -200), cc.v2(400, -300), cc.v2(1800, -600)];
    bezier3: cc.Vec2[] = [cc.v2(150, -300), cc.v2(600, -400), cc.v2(1800, -500)];
    bezier4: cc.Vec2[] = [cc.v2(50, 50), cc.v2(400, 100), cc.v2(1800, 200)];
    bezier5: cc.Vec2[] = [cc.v2(80, 200), cc.v2(300, 500), cc.v2(1800, 650)];
    bezier6: cc.Vec2[] = [cc.v2(100, 100), cc.v2(350, 400), cc.v2(1800, 500)];
    bezier7: cc.Vec2[] = [cc.v2(100, 2), cc.v2(350, -2), cc.v2(1800, 0)];
    bezierArray: cc.Vec2[][]

    onLoad() {
        this.bezierArray = [];
        this.bezierArray.push(this.bezier1);
        this.bezierArray.push(this.bezier2);
        this.bezierArray.push(this.bezier3);
        this.bezierArray.push(this.bezier4);
        this.bezierArray.push(this.bezier5);
        this.bezierArray.push(this.bezier6);
        this.bezierArray.push(this.bezier7);

        this.anim = this.node.getComponent(cc.Animation);
        this.allFishType = this.jsonData.json;
    }

    start() {

    }

    onEnable() {
        this.spawnFish();
        cc.log('fish-start ' + this.node.uuid)
        this.node.getComponent(cc.BoxCollider).enabled=true;
    }

    spawnFish() {
        let fishStr = this.allFishType.length;
        let randomFish = Math.floor(Math.random() * fishStr);
        this.fishType = this.allFishType[randomFish];
        let sprite = this.node.getComponent(cc.Sprite)
        sprite.spriteFrame = this.spAtlas.getSpriteFrame(this.fishType.name + '_run_0');
        // 取出鱼的血量
        this.hp = this.fishType.hp;
        // 掉落金币
        this.gold = this.fishType.gold;
        this.fishState = FishState.alive;
        this.anim.play(this.fishType.name + '_run');

        let pos = cc.v3(-Math.random() * 100 - 200, (Math.random() - 0.5) * 2 * 300 + 350);
        let canvas = cc.Canvas.instance;
        this.node.position = canvas.node.convertToNodeSpaceAR(pos);
        let index = Math.floor(Math.random() * this.bezierArray.length);
        let bezier = this.bezierArray[index];
        // 贝塞尔曲线第一个控制点，用来计算初始角度
        let firstp = bezier[0];
        let k = Math.atan((firstp.y) / (firstp.x));
        this.node.angle = -k * 180 / 3.14;

        this.lastPosition = this.node.position;
        this.changeCollider();
        this.swimming(bezier);

    }

    // 重新设置碰撞区域
    changeCollider() {
        let collider = this.node.getComponent(cc.BoxCollider);
        collider.size = this.node.getContentSize();
    }

    // 小鱼游泳，贝塞尔曲线实现
    swimming(trace: cc.Vec2[]) {
        let windowSize = cc.winSize;
        let speed = Math.random() * 10 + 10;
        // var bezier = [cc.v2(100, -200), cc.v2(400, -500), cc.v2(1500, -600)];
        //let bezerby = cc.bezierBy(speed, trace);
        // this.node.runAction(bezerby);

        cc.tween(this.node)
            .bezierBy(speed, trace[0], trace[1], trace[2])
            //.call(this.despawnFish)
            .start();
    }

    update(dt) {
        this.updateDegree();
    }

    updateDegree() {
        let currentPos = this.node.position;
        // 如果位移不超过1，不改变角度
        if (this.lastPosition.sub(currentPos).mag() < 1) {
            return;
        }
        // 移动的方向向量
        let dir = currentPos.sub(this.lastPosition);

        let radin = Math.atan2(dir.y, dir.x);
        this.node.angle = cc.misc.radiansToDegrees(radin);
        this.lastPosition = currentPos;
    }

    beAttack() {
        if (this.isDie()) {
            // 停止贝塞尔曲线动作
            this.node.stopAllActions();
            //播放死亡动画
            let animState = this.anim.play(this.fishType.name + '_die');
            // 被打死的动画播放完成之后回调 // 死亡动画播放完回收鱼
            this.anim.on(cc.Animation.EventType.FINISHED, this.despawnFish, this);

            // 播放金币动画
            let fp = this.node.parent.convertToWorldSpaceAR(this.node.position);
            //生成金币
            //this.game.gainCoins(fp, this.gold);

        }
    }

    despawnFish() {
        cc.log('fish die');
        let event=new cc.Event.EventCustom('despawn-fish', true);
        event.setUserData(this.gold);
        this.node.dispatchEvent(event);
        this.node.getComponent(cc.BoxCollider).enabled=true;
    }

    // 碰撞检测，鱼被打死的逻辑
    isDie(): boolean {
        if (this.fishState == FishState.dead) {
            return true;
        }
        return false;
    }

    onCollisionEnter(other: cc.BoxCollider, self: cc.BoxCollider) {
        if (this.isDie()) {
            return;
        }
        if (other.node.group == 'bullet') {
            let bullet = other.node.getComponent(Bullet);
            this.hp -= bullet.getAttackValue();
            if (this.hp <= 0) {
                this.fishState = FishState.dead;
                this.beAttack();
            }

        }

    }

}
