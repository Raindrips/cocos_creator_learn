import {global} from './global'
const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    gamenode: cc.Node = null;

    @property(cc.Label)
	scoreLabel:cc.Label=null;
    
    initVal: number = 0;
    
    score:number=0;
    

    onLoad() {
        let rigid = this.node.addComponent(cc.RigidBody);
        this.initVal = 0;
        cc.log(this.initVal);
    }

    start() {
        this.gamenode.on(cc.Node.EventType.TOUCH_START, this.dropBall, this);
    }

    update (dt) {
        //this.node.x+=100*dt;
        if(this.node.y<-cc.winSize.height/2){
            this.node.parent.emit('gameOver');
        }
    }

    dropBall() {
        this.node.parent.emit('gameStart');
        let rigid = this.node.getComponent(cc.RigidBody);

        rigid.linearVelocity = cc.v2(0, -1200);
    }

    // concat
    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        let rigid = selfCollider.node.getComponent(cc.RigidBody);
        if (this.initVal == 0) {
            this.initVal = rigid.linearVelocity.y
        }
        else {
            rigid.linearVelocity = cc.v2(0, this.initVal);
        }
        this.score++;
        this.scoreLabel.string=this.score.toString();
    }
}
