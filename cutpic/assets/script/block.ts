import {picNode} from './GirdData';
const { ccclass, property } = cc._decorator;

@ccclass
export default class Block extends cc.Component {

    start() {
        this.node.on('touchstart', this.onTouchStart, this);
        this.node.on('touchmove', this.onTouchMove, this);
        this.node.on('touchend', this.onTouchEnd, this);
    }

    onDestroy() {
 		this.node.off('touchstart', this.onTouchStart, this);
		this.node.off('touchmove', this.onTouchMove, this);
		this.node.off('touchend', this.onTouchEnd, this);
    }

    init(t2d: cc.Texture2D, pos: cc.Vec3) {
		let sp = this.node.getComponent(cc.Sprite);

		let wid = this.node.width;
		let picWid = t2d.width/picNode.length;

		let frame = new cc.SpriteFrame(t2d, cc.rect(pos.x * picWid, pos.y * picWid, picWid, picWid));
		sp.spriteFrame = frame;
		this.node.width=wid;
    }

    startPos: cc.Vec3 = cc.v3();
    onTouchStart(e: cc.Event.EventTouch) {
        this.node.opacity = 128;
        this.startPos = this.node.position;
        this.node.zIndex = 1;
    }

    onTouchMove(e: cc.Event.EventTouch) {
		let detal=e.getDelta();
		this.node.x+=detal.x;
		this.node.y+=detal.y;
    }

    onTouchEnd(e: cc.Event.EventTouch) {
        this.node.opacity = 255;
        this.node.zIndex = 0;
		let width = this.node.width;
        let height = this.node.height;
		let {i,j}=this.pos2Index(this.node.position);

		
        let tempNode = picNode[i][j];
        if (tempNode!=null&&this.inAear(i,j)) {

			let index=this.pos2Index(this.startPos);
			
			//交换坐标位置
            this.node.position = cc.v3(j *width, -i * height);
			tempNode.position=this.startPos;

			cc.log(i+' '+j+'<=>'+index.i+' '+index.j);

			picNode[index.i][index.j]=tempNode;
			picNode[i][j]=this.node;
		}
		else{
			this.node.position=this.startPos;
			cc.log('start');
		}
	}
	
	pos2Index(v3:cc.Vec3){
		let width = this.node.width;
        let height = this.node.height;
        let i = Math.abs((v3.y / width)|0);
		let j = Math.abs((v3.x / height)|0);

		return {i,j}
	}
	index2Pos(i:number,j:number){
		
	}
	inAear(i,j):boolean{
		return !(i<0|| j<0);
	}
}