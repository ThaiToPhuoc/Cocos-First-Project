import DataManager from "../../data/DataManager";
import AnalyticEvent from "../../plugin/AnalyticEvent";
import PluginManager, { RewardAds } from "../../plugin/PluginManager";
import Config from "../../utils/Config";
import Utils from "../../utils/Utils";
import RewardView from "../Reward/RewardView";
import UserInfoView from "../UserInfo/UserInfoView";
import DailyRewardItem, { DailyRewardItemState } from "./DailyRewardItem";


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("View/DailyRewardView")
export default class DailyRewardView extends cc.Component {

    public static instance: DailyRewardView = null;

    @property(cc.Node)
    ndBody: cc.Node = null;

    @property(cc.Button)
    btnClose: cc.Button = null;

    @property(cc.Button)
    btnClaim: cc.Button = null;

    @property(cc.Button)
    btnAds: cc.Button = null;

    @property(cc.Label)
    lbCoolDownTime: cc.Label = null;

    startTime: number = 0;
    endTime: number = 0;
    coolDownTime: number = 0.1;

    @property([DailyRewardItem])
    items: DailyRewardItem[] = [];

    onLoad() {
        DailyRewardView.instance = this;    
    }

    start() {
        this.loadItems();
        if (DataManager.instance.DAILLY_REWARD_CLAIM_TIME != 0 && DataManager.instance.DAILLY_REWARD_TODAY_CLAIM) {
            if (Date.now() - DataManager.instance.DAILLY_REWARD_CLAIM_TIME > Utils.hoursToMiliseconds(24)) {
                if (DataManager.instance.DAILLY_REWARD_DAY < 7) {
                    DataManager.instance.DAILLY_REWARD_DAY++;
                } else {
                    DataManager.instance.DAILLY_REWARD_DAY = 1;
                    this.items.forEach((item) => {
                        item.isClaim = false;
                        cc.sys.localStorage.setItem(`DailyReward-DAY${item.day}`, item.isClaim);
                    });
                }
                Utils.setActive(this.btnClaim);
                Utils.setActive(this.btnAds);
                DataManager.instance.DAILLY_REWARD_TODAY_CLAIM = false;
                DataManager.instance.DAILLY_REWARD_SESSION_SHOW = false;
                DataManager.instance.DAILLY_REWARD_CLAIM_TIME = 0;
            }
        }
        this.checkStateItems();
        this.btnClose.node.on("click", () => {
            this.hide();
        }, this);
        this.btnClaim.node.on("click", () => {
            this.items.forEach((item) => {
                if (item.state == DailyRewardItemState.NOW && !item.isClaim) {
                    Utils.setDeactive(this.btnClaim);
                    Utils.setDeactive(this.btnAds);
                    item.isClaim = true;
                    DataManager.instance.DAILLY_REWARD_TODAY_CLAIM = true;
                    DataManager.instance.DAILLY_REWARD_CLAIM_TIME = Date.now();
                    cc.sys.localStorage.setItem(`DailyReward-DAY${item.day}`, item.isClaim);
                    let reward = item.chip;
                    RewardView.instance.show(reward);
                    UserInfoView.instance.addBalance(reward);
                    this.checkStateItems();
                    PluginManager.instance.logEvent(AnalyticEvent.daily_check_in_claim_normal,{"reward": reward });
                }
            });
        });

        if (DataManager.instance.DAILLY_REWARD_TODAY_CLAIM) return;
        if (!DataManager.instance.DAILLY_REWARD_SESSION_SHOW) {
            DataManager.instance.DAILLY_REWARD_SESSION_SHOW = true;
            this.show();
            PluginManager.instance.logEvent(AnalyticEvent.daily_check_in_show_auto);
        }
        let today = this.items.find(item => item.state == DailyRewardItemState.NOW && !item.isClaim);
        this.btnAds.node.on('click', () => {
            PluginManager.instance.showRewardAds(RewardAds.DAILY_REWARD, ()=>{
                if(today) {
                    Utils.setDeactive(this.btnClaim);
                    Utils.setDeactive(this.btnAds);
                    today.isClaim = true;
                    let reward = today.chip * 10;
                    RewardView.instance.show(reward);
                    UserInfoView.instance.addBalance(reward);
                    PluginManager.instance.logEvent(AnalyticEvent.daily_check_in_claim_ads,{ "base": today.chip, "reward": reward });
                } else {
                    console.log("today null");
                }
            });
        })
    }

    
    public get CHECK() : boolean {
        let today = this.items.find(item => item.state == DailyRewardItemState.NOW && !item.isClaim);
        if(today) {
            return true;
        }
        return false;
    }

    checkStateItems() {
        this.items.forEach((item) => {
            if (item.day < DataManager.instance.DAILLY_REWARD_DAY) {
                item.state = DailyRewardItemState.DONE;
            }
            if (item.day == DataManager.instance.DAILLY_REWARD_DAY) {
                item.state = DailyRewardItemState.NOW;
                if (item.isClaim) {
                    Utils.setDeactive(this.btnClaim);
                    Utils.setDeactive(this.btnAds);
                } else {
                    Utils.setActive(this.btnClaim);
                    Utils.setActive(this.btnAds);
                }
            }
            if (item.day > DataManager.instance.DAILLY_REWARD_DAY) {
                item.state = DailyRewardItemState.WAIT;
            }
            item.f5();
        });
    }

    loadItems() {
        this.items.forEach((item, index) => {
            item.day = index + 1;
            item.chip = Config.DAILY_REWARD_CHIP[index];
            if (cc.sys.localStorage.getItem(`DailyReward-DAY${item.day}`)) {
                if (String(cc.sys.localStorage.getItem(`DailyReward-DAY${item.day}`)) == "true") {
                    item.isClaim = true;
                } else {
                    item.isClaim = false;
                }
            } else {
                cc.sys.localStorage.setItem(`DailyReward-DAY${item.day}`, "false");
            }
        });
    }

    show(callback: Function = null) {
        if (DataManager.instance.DAILLY_REWARD_TODAY_CLAIM) {
            if (callback) {
                callback();
                return;
            }
        }
        Utils.fadeIn(this.ndBody, () => {
            if (callback) {
                callback();
            }
        })
    }

    hide(callback: Function = null) {
        Utils.fadeOut(this.ndBody, () => {
            if (callback) {
                callback();
            }
        })
    }

}
