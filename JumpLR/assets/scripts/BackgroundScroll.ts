const {ccclass, property} = cc._decorator;

@ccclass
export default class BackgroundScroll extends cc.Component {

    @property(cc.Node)
    target1:cc.Node=null;
    @property(cc.Node)
    target2:cc.Node=null;

    protected onLoad(): void {
        if(!this.target1||!this.target2){
            cc.error('BackgroundScroll child count less 2');
            return;
        }
        cc.game.on('background-reset',this.reset,this);
    }
    
    reset(){
        if(!this.target1||!this.target2){
            return;
        }
        if(this.target1.y>this.target2.y){
            this.target2.y=this.target1.y+this.target1.height;
        }
        else if(this.target2.y>this.target1.y){
            this.target1.y=this.target2.y+this.target2.height;
        }
    }

    // update (dt) {}
}
