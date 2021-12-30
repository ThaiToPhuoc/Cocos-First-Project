import Dialog from "../../components/dialog/Dialog";
import DialogManager from "../../components/dialog/DialogManager";
import Utils from "../../utils/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class QuitGameDialog extends cc.Component {

    @property(cc.Button)
    btnClose: cc.Button = null;

    @property(cc.Button)
    btnYes: cc.Button = null;

    @property(cc.Button)
    btnNo: cc.Button = null;

    @property(cc.Label)
    lbTitle: cc.Label = null;

    @property(cc.Label)
    lbMessage: cc.Label = null;

    onLoad() {
        this.btnClose.node.on("click", () => {
            DialogManager.hideDialog(Dialog.QUIT_GAME);
        }, this);

        this.btnNo.node.on("click", () => {
            DialogManager.hideDialog(Dialog.QUIT_GAME);
        }, this);
    }

    show(param: QuitGameDialogParam = null, callback: Function = null, btnOKCallback: Function = null) {    
        this.lbTitle.string = param.title;
        this.lbMessage.string = param.message;
        this.btnYes.node.on("click", () => {
            if (btnOKCallback) {
                btnOKCallback();
            }
        });
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
export class QuitGameDialogParam {
    title: string;
    message: string;    
}
