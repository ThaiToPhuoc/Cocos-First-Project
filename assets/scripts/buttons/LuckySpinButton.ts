import LuckySpinView from "../views/LuckySpin/LuckySpinView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LuckySpinButton extends cc.Component {

    public static instance: LuckySpinButton = null;

    @property(cc.Button)
    btn: cc.Button = null;

    onLoad() {
        LuckySpinButton.instance = this;
        this.btn.node.on("click", ()=>{
            LuckySpinView.instance.show();
        });
    }
}
