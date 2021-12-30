import Utils from "../../utils/Utils";
import UserInfoView from "../../views/UserInfo/UserInfoView";
import InboxDetailDialog from "./InboxDetail/InboxDetailDialog";
import InboxDialog from "./InboxDialog";
import InboxItemData from "./InboxItemData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class InboxItem extends cc.Component {

    data: InboxItemData = null;

    @property(cc.Label)
    lbTitle: cc.Label = null;
    @property(cc.Label)
    lbChip: cc.Label = null;
    @property(cc.Button)
    btnDetail: cc.Button = null;
    @property(cc.Button)
    btnClaim: cc.Button = null;
    @property(cc.Button)
    btnDelete: cc.Button = null;
    @property(cc.SpriteFrame)
    claimBtnEnableFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    deleteBtnEnableFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    disableBtnFrame: cc.SpriteFrame = null;

    start() {
        this.btnClaim.node.on("click", () => {
            this.collect();
        }, this);
        this.btnDelete.node.on("click", () => {
            InboxDialog.instance.delete(this.data.id);
        }, this);
        this.btnDetail.node.on("click", () => {
            InboxDetailDialog.instance.show(this.data);
        }, this);
    }

    collect(){
        this.data.isClaim = true;
        UserInfoView.instance.addBalance(this.data.chip, null, this.lbChip.node);
        InboxDialog.instance.saveData();
    }

    refresh() {
        this.lbTitle.string = this.data.title;
        this.lbChip.string = Utils.convert2UnitMoney(this.data.chip);
        if (this.data.isClaim) {
            this.btnClaim.interactable = false;
            this.btnClaim.getComponent(cc.Sprite).spriteFrame = this.disableBtnFrame;
        } else {
            this.btnClaim.interactable = true;
            this.btnClaim.getComponent(cc.Sprite).spriteFrame = this.claimBtnEnableFrame;
        }
    }  
}
