const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    onLoad() {
        this.node.on('setText', this.setText, this);
        this.node.on('setEnable', this.setEnable, this);
    }

    setText(text: string) {
        this.label.string = text;
    }

    setEnable(active:boolean) {
        //通过名称获取子节点
        let pin = this.node.getChildByName('pin');
        pin.active=active;
    }

    //碰撞组件事件函数
    onCollisionEnter(other:cc.Collider,self:cc.Collider){
        if(self.node.group=='ball'){
            cc.log('小球碰撞,游戏失败');
            self.node.parent.parent.emit('game-over');
        }
      
    }

    // update (dt) {}
}
