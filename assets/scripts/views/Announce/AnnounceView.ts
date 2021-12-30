import BlockInputManager from "../../components/blockInput/BlockInputManager";
import { Sound } from "../../components/sound/Sound";
import SoundManager from "../../components/sound/SoundManager";
import Color from "../../utils/Color";
import Utils from "../../utils/Utils";

const { ccclass, property } = cc._decorator;

export enum StatusType {
    InsuranceWin,
    InsuranceLose,
    Blackjack,
    Push,
    Bust,
    Win,
    Lose
}

@ccclass
export default class AnnounceView extends cc.Component {

    public static instance: AnnounceView = null;

    @property(cc.Node)
    body: cc.Node = null;

    @property(cc.Label)
    lbStatus: cc.Label = null;

    @property(cc.ParticleSystem)
    particleStatus: cc.ParticleSystem = null;

    onLoad() {
        AnnounceView.instance = this;
    }

    start() {
        this.body.active = false;
    }

    show(status: StatusType, callback: Function = null, delay: number = 0, duration: number = 0) {
        BlockInputManager.instance.blockInput(true);
        switch (status) {
            case StatusType.Blackjack:
                SoundManager.playEFSound(Sound.SFX_WIN);
                this.lbStatus.string = "Blackjack";
                this.lbStatus.node.color = Color.Green;
                //this.particleStatus.resetSystem();
                break;
            case StatusType.Bust:
                this.lbStatus.string = "Bust";
                this.lbStatus.node.color = Color.Red;
                break;
            case StatusType.InsuranceLose:
                this.lbStatus.string = "Insurance Lose";
                this.lbStatus.node.color = Color.Red;
                break;
            case StatusType.InsuranceWin:
                SoundManager.playEFSound(Sound.SFX_WIN);
                this.lbStatus.string = "Insurance Win";
                this.lbStatus.node.color = Color.Green;
                //this.particleStatus.resetSystem();
                break;
            case StatusType.Lose:
                this.lbStatus.string = "Lose";
                this.lbStatus.node.color = Color.Red;
                break;
            case StatusType.Push:
                this.lbStatus.string = "Push";
                this.lbStatus.node.color = Color.Yellow;
                break;
            case StatusType.Win:
                SoundManager.playEFSound(Sound.SFX_WIN);
                this.lbStatus.string = "Win";
                this.lbStatus.node.color = Color.Green;
                //this.particleStatus.resetSystem();
                break;

        }
        Utils.fadeIn(this.body, () => {
            if (callback) {
                callback();
            }
        }, delay, duration);
    }

    hide(callback: Function = null, delay: number = 0, duration: number = 0) {
        Utils.fadeOut(this.body, () => {
            BlockInputManager.instance.blockInput(false);
            if (callback) {
                callback();
            }
        }, delay, duration);
    }
}
