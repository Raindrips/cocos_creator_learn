
import Net from './Net';

import Weapon from './Weapon';
const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Node)
    gameOverNode: cc.Node = null;

    @property({
        type: cc.AudioClip
    })
    bgm: cc.AudioClip = null;



    onLoad() {

        //this.coinController.getComponent(CoinController).init();

        // 设置zorder，控制显示层级
        // 背景在最下层，最上层是炮台
        // 中间层是鱼
        //cc.find('Canvas/gameBg').zIndex = -1;
        //cc.find('Canvas/bottomBar').zIndex = 1;
        this.gameOverNode.zIndex = 2;
        this.gameOverNode.active = false;

    }

    start() {
        //播放音乐
        cc.audioEngine.playMusic(this.bgm, true);
    }

    //发射炮弹
    // shot(level: number) {
    //     if (this.bulletPool.size() > 0) {
    //         this.oneBullet = this.bulletPool.get(this);
    //     } else {
    //         this.oneBullet = cc.instantiate(this.bulletPrefab);
    //     }
    //     // 剩余金币
    //     let left = this.coinController.getComponent(CoinController).reduceCoin(level);
    //     if (left) {
    //         this.oneBullet.getComponent(Bullet).shot(this, level);
    //     } else {
    //         if (this.coinController.getComponent(CoinController).currentValue == 0) {
    //             this.gameOver();
    //         }
    //     }

    // }


    //获取金币
    gainCoins(coinPos: cc.Vec3, value: number) {
        //this.coinController.getComponent(CoinController).gainCoins(coinPos, value);
    }  

    gameOver() {
        this.gameOverNode.active = true;
        this.unscheduleAllCallbacks();
    }

    gameRestart() {
        cc.game.restart();
        //cc.director.loadScene('main'); 
    }
}
