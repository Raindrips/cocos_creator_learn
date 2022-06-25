
const {ccclass, property} = cc._decorator;

@ccclass
export default class Home extends cc.Component {

    @property(cc.SceneAsset)
    scene: cc.SceneAsset = null;

 
    onLoad () {
        cc.director.preloadScene(this.scene.name);
    }

    start () {

    }

    // update (dt) {}

    onClick(event, data){
        switch(data){
            case 'start':{
                cc.director.loadScene(this.scene.name);
                break;
            }
        }
    }
}
