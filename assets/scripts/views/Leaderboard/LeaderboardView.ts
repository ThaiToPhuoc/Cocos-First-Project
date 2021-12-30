import PluginManager from "../../plugin/PluginManager";
import Utils from "../../utils/Utils";
import Leaderboard from "./Leaderboard";
import LeaderboardItem from "./LeaderboardItem";
import LeaderboardItemData from "./LeaderboardItemData";

export interface LeaderboardInfo {
    display_rank: string;
    display_score: string;
    rank: number;  // long
    score: number;  // long,
    holder_display_name: string;
    hires_imageuri: string;  // content:// protocol
    lowres_imageuri: string;
    tag: string;
    timestamp_millis: number;
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class LeaderboardView extends cc.Component {

    public static instance: LeaderboardView = null;

    items: LeaderboardItem[] = [];

    @property(cc.Node)
    body: cc.Node = null;


    @property(LeaderboardItem)
    top1: LeaderboardItem[] = [];
    @property(cc.Prefab)
    itemPrefabs: cc.Prefab[] = [];

    @property(cc.Node)
    content: cc.Node = null;

    ldbData: string[] = ['[]','[]','[]','[]'];

    @property(cc.Button)
    btnClose: cc.Button = null;
    
    
    onLoad() {
        LeaderboardView.instance = this;
        
    }

    start() {
        if(this.btnClose) {
            this.btnClose.node.on("click", ()=>{
                LeaderboardView.instance.hide();
            });
        }
        for (let i = 0; i < this.top1.length; i++) {
            this.top1[i].node.on("click", () => {
                this.setLeaderboard(i);
            });
        }
        //this.requestLeaderBoard();
        //this.schedule(this.requestLeaderBoard, 5);
    }

    requestLeaderBoard() {
       if(PluginManager.instance.SDKBOX_CHECK){
        if (sdkbox.PluginSdkboxPlay.isSignedIn()) {
            sdkbox.PluginSdkboxPlay.getPlayerCenteredScores(Leaderboard.BLACKJACK, -1, -1, 4);
            sdkbox.PluginSdkboxPlay.getPlayerCenteredScores(Leaderboard.RANKING, -1, -1, 4);
            sdkbox.PluginSdkboxPlay.getPlayerCenteredScores(Leaderboard.LEVEL, -1, -1, 4);
            sdkbox.PluginSdkboxPlay.getPlayerCenteredScores(Leaderboard.BANKROLL, -1, -1, 4);
        }
       }
    }

    clearLeaderboard() {
        for (let i = 0; i < this.top1.length; i++) {
            let itemData = new LeaderboardItemData("1st", "", 0);
            this.top1.forEach(p=>{
                p.data = itemData;
            })
        }
        this.content.destroyAllChildren();
        this.items.length = 0;
    }

    setLeaderboard(index: number) {
        this.clearLeaderboard();
        let prefab: cc.Prefab;

        //set all top1 data
        for (let i = 0; i < this.top1.length; i++) {
            if (i == index) {
                this.top1[i].node.setScale(1.5);
                this.top1[i].sprHightLight.node.active = true;
                prefab = this.itemPrefabs[i];
            } else {
                this.top1[i].node.setScale(1);
                this.top1[i].sprHightLight.node.active = false;
            }
            let top1Data = JSON.parse(this.ldbData[i])[0] as LeaderboardInfo;
            let top1ItemData;
            if (top1Data) {
                top1ItemData = new LeaderboardItemData(top1Data.display_rank, top1Data.holder_display_name, top1Data.score);
            } else {
                top1ItemData = new LeaderboardItemData("1st", "", 0);;
            }
            let top1Item = this.top1[i];
            top1Item.data = top1ItemData;
        }

        //set current ldb data
        let currentData = JSON.parse(this.ldbData[index]);
        for (let i = 1; i < currentData.length; i++) {
            let data = currentData[i] as LeaderboardInfo;
            let itemData = new LeaderboardItemData(data.display_rank, data.holder_display_name, data.score);
            let item: LeaderboardItem = null;
            item = cc.instantiate(prefab).getComponent(LeaderboardItem);
            item.node.parent = this.content;
            item.data = itemData;
            this.items.push(item);
        }
    }

    show(callback: Function = null) {     
        this.setLeaderboard(0);
        this.node.setPosition(0,0);
    }

    hide(callback: Function = null) {
        this.node.setPosition(9999,0);
    }
}

