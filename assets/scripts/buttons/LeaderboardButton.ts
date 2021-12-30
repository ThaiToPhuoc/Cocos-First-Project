import LeaderboardView from "../views/Leaderboard/LeaderboardView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LeaderboardButton extends cc.Component {

    public static instance: LeaderboardButton = null;

    @property(cc.Button)
    btn: cc.Button = null;

    onLoad() {
        LeaderboardButton.instance = this;
        this.btn.node.on("click", ()=>{
            LeaderboardView.instance.show();
        });
    }
}
