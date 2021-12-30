import Utils from "../../../utils/Utils";
import UserInfoView from "../../../views/UserInfo/UserInfoView";
import InboxDialog from "../InboxDialog";
import InboxItemData from "../InboxItemData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class InboxDetailDialog extends cc.Component {

    public static instance: InboxDetailDialog = null;

    @property(cc.Button)
    btnClose: cc.Button = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Button)
    btnClaim: cc.Button = null;
    @property(cc.Button)
    btnDelete: cc.Button = null;

    @property(cc.Label)
    lbChip: cc.Label = null;

    @property(cc.Label)
    lbMessage: cc.Label = null;

    @property(cc.SpriteFrame)
    claimBtnEnableFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    btnDisableFrame: cc.SpriteFrame = null;

    data: InboxItemData = null;
    onLoad() {
        InboxDetailDialog.instance = this;
    }

    start() {
        this.btnClose.node.on("click", () => {
            this.hide();
        }, this);

        this.btnClaim.node.on("click", () => {
            InboxDialog.instance.items[this.data.id].data.isClaim = true;
            UserInfoView.instance.addBalance(this.data.chip, null, this.lbChip.node);
            InboxDialog.instance.saveData();
        }, this);

        this.btnDelete.node.on("click", () => {
            InboxDialog.instance.delete(this.data.id);
            this.hide();
        }, this);
    }

    show(data: InboxItemData = null, callback: Function = null) {
        this.data = data;
        this.lbChip.string = Utils.convert2UnitMoney(data.chip, 3);
        this.lbMessage.string = data.message;
        if (this.data.isClaim) {
            this.btnClaim.interactable = false;
            this.btnClaim.getComponent(cc.Sprite).spriteFrame = this.btnDisableFrame;
        } else {
            this.btnClaim.interactable = true;
            this.btnClaim.getComponent(cc.Sprite).spriteFrame = this.claimBtnEnableFrame;
        }
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
