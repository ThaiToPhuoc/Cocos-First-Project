import LuckyWheelData from "./Luckywheeldata";
import Utils from "./utils/Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LuckyWheelItem extends cc.Component {

    @property(cc.Label)
    chipLabel: cc.Label = null;
    color: number = -1;
    data: LuckyWheelData = null;

    start () {
        this.schedule(this.f5,1);
    }

    f5() {
        if(this.data){
            this.chipLabel.string = Utils.convert2UnitMoney(this.data.chip,3);
        } else {
            this.chipLabel.string = "";
        }
    }
}
