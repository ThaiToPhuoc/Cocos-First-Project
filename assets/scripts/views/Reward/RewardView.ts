import UFXBouncing from "../../components/effects/UFXBouncing";
import { Sound } from "../../components/sound/Sound";
import SoundManager from "../../components/sound/SoundManager";
import DataManager from "../../data/DataManager";
import Utils from "../../utils/Utils";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("View/RewardView")
export default class RewardView extends cc.Component {

    public static instance: RewardView = null;

    @property(cc.Node)
    ndBody: cc.Node = null;

    @property(cc.Label)
    lbReward: cc.Label = null;

    @property(cc.Button)
    btnOverlay: cc.Button = null;

    @property(cc.ParticleSystem)
    pReward: cc.ParticleSystem = null;

    @property(UFXBouncing)
    ufxReward: UFXBouncing = null;

    @property(cc.Label)
    lbContinue: cc.Label = null;

    hideCallback: Function = null;

    onLoad() {
        RewardView.instance = this;
        this.btnOverlay.node.on("click", ()=>{
            this.hide();
        });
        this.ndBody.active = false;
    }

    show(reward: number, callback: Function = null, hideCallback: Function = null) {   
        SoundManager.playEFSound(Sound.get_reward);
        this.lbReward.string = `+$${Utils.numberWithCommas(reward)}`;     
        if(DataManager.instance.AUTO_BET) {
            this.lbContinue.node.active = false;
        } else {
            this.lbContinue.node.active = true;
        }
        Utils.fadeIn(this.ndBody, () => {
            this.pReward.resetSystem();
            this.ufxReward.run();
            if (callback) {
                callback();
            }
            if (hideCallback) {
                this.hideCallback = hideCallback;
            }
        })
    }

    hide(callback: Function = null, delay: number = 0) {
        Utils.fadeOut(this.ndBody, () => {
            if (callback) {
                callback();
            } else {
                if(this.hideCallback) {
                    this.hideCallback();
                }
            }
        }, delay);
    }
}
