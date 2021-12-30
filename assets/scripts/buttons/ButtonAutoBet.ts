import DataManager from "../data/DataManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ButtonAutoBet extends cc.Component {

    @property(cc.Animation)
    anim: cc.Animation = null;

    animState: cc.AnimationState = null;

    onLoad () {
        this.node.on('click', ()=>{
            DataManager.instance.AUTO_BET = !DataManager.instance.AUTO_BET;
        }, this);
        this.animState = this.anim.getAnimationState('btn_autoBet');
    }

    update () {       
        if(DataManager.instance.AUTO_BET){
            this.anim.resume('btn_autoBet');
        } else {
            this.anim.pause('btn_autoBet');   
        }
    }
}

