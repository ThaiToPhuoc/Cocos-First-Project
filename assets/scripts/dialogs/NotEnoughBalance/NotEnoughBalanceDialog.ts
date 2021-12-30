import Scene from "../../components/scene/Scene";
import DataManager from "../../data/DataManager";
import AnalyticEvent from "../../plugin/AnalyticEvent";
import PluginManager from "../../plugin/PluginManager";
import Utils from "../../utils/Utils";
import ShopView from "../../views/Shop/ShopView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NotEnoughBalanceDialog extends cc.Component {

    public static instance: NotEnoughBalanceDialog = null;

    @property(cc.Node)
    body: cc.Node = null;

    @property(cc.Button)
    btnClose: cc.Button = null;

    @property(cc.Button)
    btnGetChip: cc.Button = null;

    @property(cc.Label)
    lbContent: cc.Label = null;

    onLoad() {
        NotEnoughBalanceDialog.instance = this;
        this.btnClose.node.on("click", () => {
            this.hide();
        }, this);

        this.btnGetChip.node.on("click", () => {
            ShopView.instance.show();
            PluginManager.instance.logEvent(AnalyticEvent.shop_show_not_enough_balance);
        }, this);

        this.body.active = false;
    }

    show(minBalance: number, callback: Function = null) {    
        switch (cc.director.getScene().name) {
            case Scene.SCENE_MENU:
                this.lbContent.string = `You need $${Utils.convert2UnitMoney(minBalance - DataManager.instance.BALANCE, 3)} more chips to access this table.`;
                break;
            case Scene.SCENE_GAME:
                this.lbContent.string = `You need at least $${Utils.convert2UnitMoney(minBalance - DataManager.instance.BALANCE, 3)} more chips to play in this table.`;
                break;
        }
        Utils.fadeIn(this.body, () => {
            if (callback) {
                callback();
            }
        })
    }

    hide(callback: Function = null) {
        Utils.fadeOut(this.body, () => {
            if (callback) {
                callback();
            }
        })
    }
}
