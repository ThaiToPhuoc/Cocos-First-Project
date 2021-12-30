import UFXShake from "../components/effects/UFXShake";
import AnalyticEvent from "../plugin/AnalyticEvent";
import PluginManager, { RewardAds } from "../plugin/PluginManager";
import Utils from "../utils/Utils";
import RewardView from "../views/Reward/RewardView";
import UserInfoView from "../views/UserInfo/UserInfoView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FreeChipsAdsButton extends cc.Component {

    public static instance: FreeChipsAdsButton = null;

    @property(cc.Button)
    btn: cc.Button = null;

    @property(cc.Node)
    notify: cc.Node = null;

    @property(UFXShake)
    shake: UFXShake = null;

    onLoad() {
        FreeChipsAdsButton.instance = this;
        this.btn.node.on("click", () => {
            PluginManager.instance.showRewardAds(RewardAds.FREE_CHIP, this.adsCallback);
        });
        this.schedule(this.check, 1);
    }

    start() {
        
    }

    adsCallback() {
        let reward = Utils.randomRangeInt(10000, 100000);
        RewardView.instance.show(reward);
        UserInfoView.instance.addBalance(Number(reward));
        PluginManager.instance.logEvent(AnalyticEvent.free_chip_claim_ads,{ "reward": reward });
    }

    check() {
        if(PluginManager.instance.checkRewardAds(RewardAds.FREE_CHIP)){
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
