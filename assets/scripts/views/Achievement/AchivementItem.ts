import Scene from "../../components/scene/Scene";
import SceneManager from "../../components/scene/SceneManager";
import Data from "../../data/Data";
import DataManager from "../../data/DataManager";
import Utils from "../../utils/Utils";
import AchievementItemData from "./AchivementItemData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AchievementItem extends cc.Component {

    data: AchievementItemData = null;

    @property(cc.Label)
    lbTitle: cc.Label = null;

    @property(cc.Label)
    lbChip: cc.Label = null;

    @property(cc.Label)
    lbExp: cc.Label = null;

    @property(cc.Label)
    lbProgress: cc.Label = null;

    @property(cc.ProgressBar)
    pbProgress: cc.ProgressBar = null;

    @property(cc.Button)
    btnGo: cc.Button = null;

    @property(cc.Button)
    btnClaim: cc.Button = null;

    @property(cc.Node)
    sprReady: cc.Node = null;

    @property(cc.Node)
    sprFinal: cc.Node = null;
    
    start() {
        this.schedule(this.f5, 1);
    }

    f5() {
        if (this.data) {       
            this.lbChip.string = Utils.convert2UnitMoney(this.data.chip, 3);
            this.lbExp.string = Utils.convert2UnitMoney(this.data.xp, 3);
            switch (this.data.key) {
                case Data.HAND_PLAY:
                    this.data.current = DataManager.instance.HAND_PLAY;
                    this.lbTitle.string = `Play ${Utils.convert2UnitMoney(this.data.max, 3)} Hand`;
                    break;
                case Data.HAND_WIN:
                    this.data.current = DataManager.instance.HAND_WIN;
                    this.lbTitle.string = `Win ${Utils.convert2UnitMoney(this.data.max, 3)} Hand`;
                    break;
                case Data.BET_TIMES:
                    this.data.current = DataManager.instance.BET_TIMES;
                    this.lbTitle.string = `Total Bet ${Utils.convert2UnitMoney(this.data.max, 3)} times`;
                    break;
                case Data.HIT_TIMES:
                    this.data.current = DataManager.instance.HIT_TIMES;
                    this.lbTitle.string = `Total Hit ${Utils.convert2UnitMoney(this.data.max, 3)} times`;
                    break;
                case Data.BLACKJACK_TIMES:
                    this.data.current = DataManager.instance.BLACKJACK_TIMES;
                    this.lbTitle.string = `Blackjack ${Utils.convert2UnitMoney(this.data.max, 3)} times`;
                    break;
                case Data.FIVE_CARD_WIN_TIMES:
                    this.data.current = DataManager.instance.FIVE_CARD_WIN_TIMES;
                    this.lbTitle.string = `Win ${Utils.convert2UnitMoney(this.data.max, 3)} Hand with 5 cards or more`;
                    break;
                case Data.SPLIT_TIMES:
                    this.data.current = DataManager.instance.SPLIT_TIMES;
                    this.lbTitle.string = `Total ${Utils.convert2UnitMoney(this.data.max, 3)} Split times`;
                    break;
                case Data.LOSE_STREAK:
                    this.data.current = DataManager.instance.LOSE_STREAK;
                    this.lbTitle.string = `Unlucky, You have lose streak ${Utils.convert2UnitMoney(this.data.max, 3)}`;
                    break;
                case Data.WIN_STREAK:
                    this.data.current = DataManager.instance.WIN_STREAK;
                    this.lbTitle.string = `Awesome, You are god of gamblers, win streak ${Utils.convert2UnitMoney(this.data.max, 3)}`;
                    break;
                case Data.TOTAL_CHIP_WIN:
                    this.data.current = DataManager.instance.TOTAL_CHIP_WIN;
                    this.lbTitle.string = `So great, total win amount has reached ${Utils.convert2UnitMoney(this.data.max, 3)} chips`;
                    break;
                case Data.TOTAL_CHIP_BET:
                    this.data.current = DataManager.instance.TOTAL_CHIP_BET;
                    this.lbTitle.string = `Your total bet has been reached ${Utils.convert2UnitMoney(this.data.max, 3)} chips`;
                    break;
                case Data.INSURANCE_WIN_TIMES:
                    this.data.current = DataManager.instance.INSURANCE_WIN_TIMES;
                    this.lbTitle.string = `You always know your opponent, Insurance win has reached ${Utils.convert2UnitMoney(this.data.max, 3)} times`;
                    break;
            }

            if (this.data.current < this.data.max) {
                this.btnGo.node.active = true;
                this.btnClaim.node.active = false;
                this.sprReady.active = false;
                this.lbProgress.string = `${Utils.convert2UnitMoney(this.data.current, 3)}/${Utils.convert2UnitMoney(this.data.max, 3)}`;
            } else {
                this.btnGo.node.active = false;
                this.btnClaim.node.active = true;
                this.sprReady.active = true;
                this.lbProgress.string = `${Utils.convert2UnitMoney(this.data.max, 3)}/${Utils.convert2UnitMoney(this.data.max, 3)}`;
            }

            this.pbProgress.progress = Utils.normalized(this.data.current, this.data.min, this.data.max);

            if(this.data.final){
                this.btnGo.node.active = false;
                this.btnClaim.node.active = false;
                this.sprReady.active = false;
                this.sprFinal.active = true;
            }
            if(SceneManager.instance.getCurrentScene() == Scene.SCENE_GAME){
                this.btnGo.node.active = false;
            }
        }
    }

}
