import UFXShake from "../components/effects/UFXShake";
import AchievementView from "../views/Achievement/AchievementView";
import DailyQuestView from "../views/DailyQuest/DailyQuestView";
import MissionView from "../views/Mission/MissionView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MissonButton extends cc.Component {

    public static instance: MissonButton = null;

    @property(cc.Button)
    btn: cc.Button = null;

    @property(cc.Node)
    notify: cc.Node = null;

    @property(UFXShake)
    shake: UFXShake = null;

    onLoad() {
        MissonButton.instance = this;
        if(this.btn) {
            this.btn.node.on("click", ()=>{
                MissionView.instance.show();
            });
        }
        
        this.schedule(this.check, 1);
    }

    start() {
        this.notify.active = false;
    }

    check() {
        if(DailyQuestView.instance.available || AchievementView.instance.available){
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
