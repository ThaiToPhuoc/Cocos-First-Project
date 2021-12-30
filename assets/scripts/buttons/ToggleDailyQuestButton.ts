import UFXShake from "../components/effects/UFXShake";
import AchievementView from "../views/Achievement/AchievementView";
import DailyQuestView from "../views/DailyQuest/DailyQuestView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ToggleDailyQuestButton extends cc.Component {

    public static instance: ToggleDailyQuestButton = null;

    @property(cc.Button)
    btn: cc.Button = null;

    @property(cc.Node)
    notify: cc.Node = null;

    @property(UFXShake)
    shake: UFXShake = null;

    onLoad() {
        ToggleDailyQuestButton.instance = this;
        this.schedule(this.check, 1);
    }

    start() {
        this.notify.active = false;
    }

    check() {
        if(DailyQuestView.instance.available){
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
