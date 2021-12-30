import Data from "../../data/Data";
import DataManager from "../../data/DataManager";
import Utils from "../../utils/Utils";
import ProfileItemData from "./ProfileItemData";
const { ccclass, property } = cc._decorator;

@ccclass
export default class ProfileItem extends cc.Component {

    data: ProfileItemData = null;

    @property(cc.Label)
    lbKey: cc.Label = null;
    @property(cc.Label)
    lbValue: cc.Label = null;

    refresh() {
        switch (this.data.key) {
            case Data.HAND_PLAY:
                this.lbKey.string = `TOTAL HAND PLAYED`;
                this.lbValue.string = Utils.convert2UnitMoney(DataManager.instance.HAND_PLAY);
                break;
            case Data.HAND_WIN:
                this.lbKey.string = `TOTAL HAND WIN`;
                this.lbValue.string = Utils.convert2UnitMoney(DataManager.instance.HAND_WIN);
                break;
            case Data.TOTAL_CHIP_BET:
                this.lbKey.string = `TOTAL CHIP BET`;
                this.lbValue.string = Utils.convert2UnitMoney(DataManager.instance.TOTAL_CHIP_BET);
                break;
            case Data.TOTAL_CHIP_WIN:
                this.lbKey.string = `TOTAL CHIP WIN`;
                this.lbValue.string = Utils.convert2UnitMoney(DataManager.instance.TOTAL_CHIP_WIN);
                break;
            case Data.WIN_RATE:
                this.lbKey.string = `WIN RATE`;
                this.lbValue.string = `${DataManager.instance.WIN_RATE.toFixed(2)}%`;
                break;
            case Data.HIGHEST_WIN_HIT:
                this.lbKey.string = `HIGEST HIT - WIN`;
                this.lbValue.string = `${DataManager.instance.HIGHEST_WIN_HIT}`;
                break;
            case Data.BLACKJACK_TIMES:
                this.lbKey.string = `BLACKJACK:`;
                this.lbValue.string = Utils.convert2UnitMoney(DataManager.instance.BLACKJACK_TIMES);
                break;
        }
    }
}
