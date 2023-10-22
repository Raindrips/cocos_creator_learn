const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    spriteFrame: cc.SpriteFrame = null;

    maxId: number = 5;
    id: number = 0;

    onLoad() {
        cc.log('load'+this.node);
        this.setId(Math.random()*this.maxId | 1)
    }

    start() {
        cc.log('start'+this.node);
        this.node.on(cc.Node.EventType.TOUCH_START, this.next,this)
    }

    // update (dt) {}

    touchStart(e: cc.Event.EventTouch) {
        this.next();
    }

    //切换为下一个物体
    next() {
		this.setId(this.id+1);
    }
    
    //修改图片
    setId(id:number){
		id%= this.maxId
		let sp = this.node.getComponent(cc.Sprite)
        sp.spriteFrame = this.atlas.getSpriteFrame(id.toString())
        this.id =id;
    }

    getRandomId(){

    }

}
