import Utils from "../../utils/Utils";
import LuckySpinItemData from "./LuckySpinItemData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LuckySpinItem extends cc.Component {

    @property(cc.Label)
    lbChip: cc.Label = null;
    color: number = -1;
    data: LuckySpinItemData = null;

    start() {
        this.schedule(this.f5, 1);
    }

    f5(){
        if(this.data){
            this.lbChip.string = Utils.convert2UnitMoney(this.data.chip, 3);
        } else {
            this.lbChip.string = "";
        }
    }

}
