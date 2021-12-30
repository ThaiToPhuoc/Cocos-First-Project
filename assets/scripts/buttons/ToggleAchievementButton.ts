import UFXShake from "../components/effects/UFXShake";
import AchievementView from "../views/Achievement/AchievementView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ToggleAchievementButton extends cc.Component {

    public static instance: ToggleAchievementButton = null;

    @property(cc.Button)
    btn: cc.Button = null;

    @property(cc.Node)
    notify: cc.Node = null;

    @property(UFXShake)
    shake: UFXShake = null;

    onLoad() {
        ToggleAchievementButton.instance = this;
        this.schedule(this.check, 1);
    }

    start() {
        this.notify.active = false;
    }

    check() {
        if(AchievementView.instance.available){
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
