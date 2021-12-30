import AnalyticEvent from "../../plugin/AnalyticEvent";
import PluginManager from "../../plugin/PluginManager";
import Config from "../../utils/Config";
import Utils from "../../utils/Utils";
import LeaderboardView from "../Leaderboard/LeaderboardView";
import MenuPageView from "../MenuPage/MenuPageView";
import UserInfoView from "../UserInfo/UserInfoView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FooterView extends cc.Component {

    public static instance: FooterView = null;

    @property(cc.Node)
    body: cc.Node = null;

    @property(cc.Sprite)
    btnShop: cc.Sprite = null;

    @property(cc.Sprite)
    btnMission: cc.Sprite = null;

    @property(cc.Sprite)
    btnLobby: cc.Sprite = null;

    @property(cc.Sprite)
    btnWheel: cc.Sprite = null;

    @property(cc.Sprite)
    btnLeaderboard: cc.Sprite = null;

    SHOW: boolean = true;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        FooterView.instance = this;
        this.body.active = true;
     }

    start () {
        this.btnShop.node.on("click", ()=>{
            MenuPageView.instance.setPage(0, Config.PAGE_VIEW_SCROLL_TIME);
            UserInfoView.instance.hide();
            PluginManager.instance.logEvent(AnalyticEvent.shop_show_menu);
        }, this);
        this.btnMission.node.on("click", ()=>{
            MenuPageView.instance.setPage(1, Config.PAGE_VIEW_SCROLL_TIME);
            UserInfoView.instance.hide();
        }, this);
        this.btnLobby.node.on("click", ()=>{
            MenuPageView.instance.setPage(2, Config.PAGE_VIEW_SCROLL_TIME);
            UserInfoView.instance.show();
        }, this);
        this.btnWheel.node.on("click", ()=>{
            MenuPageView.instance.setPage(3, Config.PAGE_VIEW_SCROLL_TIME);
            UserInfoView.instance.hide();
            PluginManager.instance.logEvent(AnalyticEvent.lucky_spin_show_menu);
        }, this);
        this.btnLeaderboard.node.on("click", ()=>{
            MenuPageView.instance.setPage(4, Config.PAGE_VIEW_SCROLL_TIME);
            LeaderboardView.instance.setLeaderboard(0);
            UserInfoView.instance.hide();
        }, this);  
    }

    update() {
        switch (MenuPageView.instance.pageView.getCurrentPageIndex()) {
            case 0:
                this.btnShop.enabled = true;
                this.btnMission.enabled = false;
                this.btnLobby.enabled = false;
                this.btnWheel.enabled = false;
                this.btnLeaderboard.enabled = false;
                break;
            case 1:
                this.btnShop.enabled = false;
                this.btnMission.enabled = true;
                this.btnLobby.enabled = false;
                this.btnWheel.enabled = false;
                this.btnLeaderboard.enabled = false;
                break;
            case 2:
                this.btnShop.enabled = false;
                this.btnMission.enabled = false;
                this.btnLobby.enabled = true;
                this.btnWheel.enabled = false;
                this.btnLeaderboard.enabled = false;
                break;
            case 3:
                this.btnShop.enabled = false;
                this.btnMission.enabled = false;
                this.btnLobby.enabled = false;
                this.btnWheel.enabled = true;
                this.btnLeaderboard.enabled = false;
                break;
            case 4:
                this.btnShop.enabled = false;
                this.btnMission.enabled = false;
                this.btnLobby.enabled = false;
                this.btnWheel.enabled = false;
                this.btnLeaderboard.enabled = true;
                break;
        }
    }

    show(callback: Function = null) {   
        if(this.SHOW) return;  
        this.SHOW = true;   
        Utils.fadeIn(this.body, () => {
            if (callback) {
                callback();
            }
        })
    }

    hide(callback: Function = null) {
        if(!this.SHOW) return;  
        this.SHOW = false;
        Utils.fadeOut(this.body, () => {
            if (callback) {
                callback();
            }
        })
    }
}
