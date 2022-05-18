import { CellState } from "./CellState";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CellNode extends cc.Component {

    @property(cc.Node)
    colorNode: cc.Node = null;

    private _state: CellState = CellState.white;

    set state(s: CellState) {
        this._state = s;
        this.updateColor();
    }
    get state() {
        return this._state;
    }
    // onLoad () {}

    start() {

    }

    updateColor() {
        switch (this.state) {
            case CellState.white:
                this.colorNode.color = cc.color(255, 255, 255);
              
                break;
            case CellState.black:
                // this.colorNode.color=this.randomColor();
                this.colorNode.color=cc.Color.BLACK;
                break
        }
    }

    randomColor(){
        return cc.color(Math.random()*200,Math.random()*200,Math.random()*200)
    }

    changeState() {
        switch (this.state) {
            case CellState.white:
                this.state = CellState.black;
                this.colorNode.color = cc.color(0, 0, 0);
                break;

            case CellState.black:
                this.state = CellState.white;
                this.colorNode.color = cc.color(255, 255, 255);
                break
        }
    }

    // update (dt) {}
}
