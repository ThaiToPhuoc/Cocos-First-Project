import Color from "../../utils/Color";
import Utils from "../../utils/Utils";
const { ccclass, property } = cc._decorator;

@ccclass
export default class DailyRewardItem extends cc.Component {

    day: number = 0;
    chip: number = 0;
    state: string = "";
    
    isClaim: boolean = false;

    @property(cc.Label)
    lbDay: cc.Label = null;

    @property(cc.Label)
    lbChip: cc.Label = null;

    @property(cc.Node)
    fxIsToday: cc.Node = null;

    @property(cc.Node)
    iconChip: cc.Node = null;

    @property(cc.Node)
    check: cc.Node = null;

    

    f5() {       
        switch (this.state) {
            case DailyRewardItemState.WAIT:
                this.lbDay.string = "DAY " + this.day +"   ";
                this.fxIsToday.active = false;
                this.check.active = false;
                this.lbChip.string =  "$" + Utils.numberWithCommas(this.chip, 3);
                this.lbDay.node.color = Color.White;
                this.lbChip.node.color = Color.White;
                break;
            case DailyRewardItemState.NOW:
                this.lbDay.string = "DAY " + this.day +"   ";
                if(this.isClaim){
                    this.fxIsToday.active = false;
                    this.check.active = true;
                } else {
                    this.fxIsToday.active = true;
                    this.check.active = false;
                }
                this.lbChip.string = "$" + Utils.numberWithCommas(this.chip, 3);
                this.lbDay.node.color = Color.Yellow;
                this.lbChip.node.color = Color.Yellow;
                break;
            case DailyRewardItemState.DONE:
                this.lbDay.string = "DAY " + this.day+"   ";
                this.fxIsToday.active = false;
                if(this.isClaim){
                    this.check.active = true;
                } else {
                    this.check.active = false;
                }
                this.lbChip.string = "$"+ Utils.numberWithCommas(this.chip, 3);
                this.lbDay.node.color = Color.DimGray;
                this.lbChip.node.color = Color.DimGray;
                break;
        }
    }
}

export class DailyRewardItemState {
    public static readonly WAIT: string = "WAIT";
    public static readonly NOW: string = "NOW";
    public static readonly DONE: string = "DONE";
}
