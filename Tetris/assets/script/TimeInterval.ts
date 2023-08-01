const {ccclass, property} = cc._decorator;

@ccclass
export default class TimeInterval extends cc.Component {

    @property
    public frameTime:number=1;

    @property
    public isStart:boolean=false;

    @property(cc.Component.EventHandler)
    eventCall: cc.Component.EventHandler =null;
    
    _delay:number=0;

    

    update (dt) {
        if (!this.isStart) {
			return;
		}
		if (this._delay > this.frameTime) {
			this._delay -= this.frameTime;
            if(this.eventCall){   
                this.eventCall.emit([]);
            }        
           
		}
		this._delay += dt;
    }
}
