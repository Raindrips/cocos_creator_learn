import { picNode } from './GirdData';
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

	@property(cc.Texture2D)
	t2d: cc.Texture2D = null;

	@property(cc.Prefab)
	blockPrefab: cc.Prefab = null;

	@property(cc.Sprite)
	sp: cc.Sprite = null

	@property
	level: number = 4;

	onLoad() {
		this.sp.spriteFrame=new cc.SpriteFrame(this.t2d);
		picNode.length = this.level;

		cc.log(picNode);
		for (let i = 0; i < this.level; i++) {
			picNode[i] = [];
			picNode[i].length = this.level;
			for (let j = 0; j < this.level; j++) {
				let block = cc.instantiate(this.blockPrefab)
				this.node.addChild(block);
				block.position = cc.v3(j * block.width, -i * block.width);
				block.getComponent('block').init(this.t2d, cc.v2(j, i));
				picNode[i][j] = block;
			}
		}
		this.randPic();
	}

	start() {

	}

	update(dt) { }

	randPic() {
		for (let i = 0; i < this.level; i++) {
			for (let j = 0; j < this.level; j++) {
				let block = picNode[i][j];
				let index = {
					i: Math.random() * this.level | 0,
					j: Math.random() * this.level | 0,
				}

				let eBlock = picNode[index.i][index.j];
				let tmp = block.position;
				block.position = eBlock.position;
				eBlock.position = tmp;

				picNode[i][j] = eBlock;
				picNode[index.i][index.j] = block;
			}
		}
	}
}
