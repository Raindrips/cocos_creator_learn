
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    onLoad () {
        let concat=cc.director.getCollisionManager();
        concat.enabled=true;
        concat.enabledDebugDraw=true;
    }

}
