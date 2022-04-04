import { GameState } from "./utils/GameState";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    setState(state: GameState) {
        switch (state) {
            case GameState.StartGame:
                cc.tween(this.node)
                    .to(0.5, { color: cc.color(210, 210, 200) })
                    .start();
                break;
            case GameState.GameOver:
                cc.tween(this.node)
                    .to(0.5, { color: cc.color(217, 107, 107) })
                    .start();
                break;
            case GameState.NextLevel:
                cc.tween(this.node)
                    .to(0.5, { color: cc.color(58, 169, 78) })
                    .start();
                break;
        }
    }
    onLoad() {
        this.node.on('setState',this.setState,this);
    }

    // start () {

    // }

    // update (dt) {}
}
