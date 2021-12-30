import Utils from "../../utils/Utils";
import LeaderboardItemData from "./LeaderboardItemData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LeaderboardItem extends cc.Component {

    data: LeaderboardItemData = null;

    @property(cc.Label)
    lbRankPos: cc.Label = null;

    @property(cc.Label)
    lbName: cc.Label = null;

    @property(cc.Label)
    lbAmount: cc.Label = null;

    @property(cc.Sprite)
    sprHightLight: cc.Sprite = null;

    // onLoad () {}

    start () {
        
    }

    update (dt) {
        if(this.data){
            this.lbRankPos.string = `${this.data.display_rank}`;
            this.lbName.string = this.data.name;
            this.lbAmount.string = `${Utils.numberWithCommas(this.data.score, 3)}`;
        }
    }
}
