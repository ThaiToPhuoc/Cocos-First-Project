import UFXShake from "../components/effects/UFXShake";
import AnalyticEvent from "../plugin/AnalyticEvent";
import PluginManager from "../plugin/PluginManager";
import DailyRewardView from "../views/DailyReward/DailyRewardView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DailyRewardButton extends cc.Component {

    public static instance: DailyRewardButton = null;

    @property(cc.Button)
    btn: cc.Button = null;

    @property(cc.Node)
    notify: cc.Node = null;

    @property(UFXShake)
    shake: UFXShake = null;

    onLoad() {
        DailyRewardButton.instance = this;
        this.btn.node.on("click", ()=>{
            DailyRewardView.instance.show();
            PluginManager.instance.logEvent(AnalyticEvent.daily_check_in_show_btn);
        });
        this.schedule(this.check, 1);
    }

    start() {
        
    }

    check() {
        if(DailyRewardView.instance.CHECK){
            if(this.notify) {
                this.notify.active = true;
            }
            if(this.shake) {
                this.shake.run();
            }
        } else {
            if(this.notify) {
                this.notify.active = false;
            }
            if(this.shake) {
                this.shake.stop();
            }
        }
    }
}
