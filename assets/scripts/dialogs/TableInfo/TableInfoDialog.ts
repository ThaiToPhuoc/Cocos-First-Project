import DataManager from "../../data/DataManager";
import Dialog from "../../components/dialog/Dialog";
import DialogManager from "../../components/dialog/DialogManager";
import Utils from "../../utils/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TableInfoDialog extends cc.Component {

    @property(cc.Button)
    btnClose: cc.Button = null;

    @property(cc.Label)
    lbTitle: cc.Label = null;
    @property(cc.Label)
    lbMinBet: cc.Label = null;
    @property(cc.Label)
    lbMaxBet: cc.Label = null;
    @property(cc.Label)
    lbMinBalance: cc.Label = null;

    onLoad() {
        this.btnClose.node.on("click", () => {
            DialogManager.hideDialog(Dialog.TABLE_INFO);
        }, this);
    }

    show(param: any = null, callback: Function = null) {    
        this.lbTitle.string = DataManager.instance.TABLE_NAME;
        this.lbMinBet.string = `Min bet: $${Utils.convert2UnitMoney(DataManager.instance.MIN_BET, 3)}`;
        this.lbMaxBet.string = `Max bet: $${Utils.convert2UnitMoney(DataManager.instance.MAX_BET, 3)}`;
        this.lbMinBalance.string = `Min balance: $${Utils.convert2UnitMoney(DataManager.instance.MIN_BALANCE, 3)}`;
        Utils.fadeIn(this.node, () => {
            if (callback) {
                callback();
            }
        })
    }

    hide(callback: Function = null) {
        Utils.fadeOut(this.node, () => {
            if (callback) {
                callback();
            }
        })
    }
}
