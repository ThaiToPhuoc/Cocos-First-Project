import Dialog from "../components/dialog/Dialog";
import DialogManager from "../components/dialog/DialogManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ButtonTableInfo extends cc.Component {
    onLoad () {
        this.node.on('click', ()=>{
            DialogManager.showDialog(Dialog.TABLE_INFO);
        }, this);
    }
}

