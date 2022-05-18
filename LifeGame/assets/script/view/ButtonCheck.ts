
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = '开始';

    @property
    text2: string = '结束';

    check:boolean=true;

    change(){
        if(this.check){
            this.label.string=this.text2;
            
        }
        else{
            this.label.string=this.text;
        }
        this.check=!this.check;
        
    }

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
