const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

   @property(cc.Node)
   follow:cc.Node=null;

   update(){
       this.node.x=this.follow.x;
   }
}
