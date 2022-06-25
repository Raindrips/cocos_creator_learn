import PathManager from "./PathPoolManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Path extends cc.Component {
    @property(cc.Label)
    txtNum: cc.Label = null;

    private _prevBox: Path = null;           // 下一个节点
    private _nextBox: Path = null;           // 上一个节点
    private _offset: number = 0;                // 偏移范围[-4,4]  

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    set offset(offset: number){
        this._offset = offset;
    }

    get offset(){
        return this._offset;
    }

    set prev(prev: Path){
        this._prevBox = prev;
        if(this._prevBox){
            this._prevBox.next=this;   
        }
        
    }

    get prev(){
        return this._prevBox;
    }
 
    set next(next: Path){
        this._nextBox = next;
        if(this._nextBox){
            this._nextBox._prevBox=this;
        }
    }

    get next(){
        return this._nextBox;
    }

    //当前数字
    setNum(num: number){
        this.txtNum.string = `${num}`;
    }

    //背景下降
    down(y: number){
        cc.tween(this.node)
        .by(0.4,{y:y})
        .call(()=>{
            PathManager.putBox(this.node);
        })
        .start();
    }
}
