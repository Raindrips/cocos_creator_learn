
const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

	@property(cc.Prefab)
	block: cc.Prefab = null;

	@property(cc.Label)
	socreLabel:cc.Label=null

	@property(cc.Node)
	piano:cc.Node=null

	score:number=0;

	onLoad () {
		this.node.on('touch',this.touchBlock,this);
	}

	start() {
		for (let i = 0; i < 200; i++) {
			this.addNormalLine(i);
		}
	}

	// update (dt) {}

	addNormalLine(index: number) {
		let r = Math.random() * 4 | 0;		
		for (let i = 0; i < 4; i++) {
			let block = cc.instantiate(this.block);
			this.node.addChild(block);
		
			//设置白块 or 黑块
			let color = (r == i ? cc.Color.BLACK : cc.Color.WHITE);
			cc.log(r+' '+i+' '+color);
			block.color = color;

			// 方块坐标
			let vs = cc.winSize;
			block.position = cc.v3(i * (vs.width / 4), index * (vs.height / 5));
			
		}
	}

	touchBlock(node:cc.Node){
		if(node.color.equals(cc.Color.BLACK)){
			this.moveDown();
			this.addScore();
			this.piano.emit('playNext');
		}
		else if(node.color.equals( cc.Color.WHITE)){
			node.emit('error');
			cc.game.emit('stop-touch');
			this.node.off('touch',this.touchBlock,this);
			this.scheduleOnce(this.restart,1);
		}
		
	}

	moveDown(){
		cc.tween(this.node)
		.by(0.1,{position:cc.v3(0,-cc.winSize.height/5)})
		.start();
	}

	addScore(){
		this.score++;
		this.socreLabel.string=this.score.toString();
	
	}

	restart(){
		cc.director.loadScene(cc.director.getScene().name);
	}
}
