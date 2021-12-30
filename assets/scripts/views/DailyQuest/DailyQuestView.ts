import Data from "../../data/Data";
import DataManager from "../../data/DataManager";
import Config from "../../utils/Config";
import Utils from "../../utils/Utils";
import MenuPageView from "../MenuPage/MenuPageView";
import RewardView from "../Reward/RewardView";
import UserInfoView from "../UserInfo/UserInfoView";
import DailyQuestItem from "./DailyQuestItem";
import DailyQuestItemData from "./DailyQuestItemData";
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("View/DailyQuestView")
export default class DailyQuestView extends cc.Component {

    public static instance: DailyQuestView = null;

    @property(cc.Node)
    body: cc.Node = null;

    @property(DailyQuestItem)
    mainItem: DailyQuestItem = null;

    items: DailyQuestItem[] = [];

    @property(cc.Node)
    content: cc.Node = null;

    startTime: number = 0;
    endTime: number = 0;
    coolDownTime: number = 0.1;
    coolDownTimeCheck: number = 0;
    isCoolDown: boolean = false;

    onLoad() {
        DailyQuestView.instance = this;
        this.items = this.content.getComponentsInChildren(DailyQuestItem);

        this.items.forEach(p => {
            p.btnCollect.node.on("click", () => {
                if (p.data.isClaim) return;
                p.data.isClaim = true;
                cc.sys.localStorage.setItem(`${p.data.id}`, "true");
                UserInfoView.instance.addEXP(p.data.EXP);
                let reward = p.data.chip;
                RewardView.instance.show(reward);
                UserInfoView.instance.addBalance(reward);
                DataManager.instance.Q_MAIN++;
                DailyQuestView.instance.refreshItems();
            });
            p.btnGo.node.on("click", () => {
                MenuPageView.instance.setPage(2, 0);
                UserInfoView.instance.show();
            });
        });
        if (DataManager.instance.Q_MAIN_CLAIM_TIME == 0) {
            DataManager.instance.Q_MAIN_CLAIM_TIME = Date.now();
        }

        this.mainItem.btnCollect.node.on("click", () => {
            if (this.mainItem.data.isClaim) return;
            if (this.mainItem.data.current < this.mainItem.data.max) {
                this.mainItem.btnCollect.getComponent(cc.Animation).play("chest_shake", 0);
            } else {
                this.mainItem.btnCollect.interactable = false;
                this.mainItem.btnCollect.getComponent(cc.Animation).play("chest_open", 0);
                this.mainItem.data.isClaim = true;
                cc.sys.localStorage.setItem(`${this.mainItem.data.id}`, "true");
                DataManager.instance.Q_MAIN_CLAIM_TIME = Date.now();
                UserInfoView.instance.addEXP(this.mainItem.data.EXP);
                let reward = this.mainItem.data.chip;
                RewardView.instance.show(reward);
                UserInfoView.instance.addBalance(reward);
            }
        });
        this.loadItemData();
    }

    start() {
        this.schedule(this.check, 1);
    }

    loadItemData() {
        for (let i = 0; i < Config.QUEST.length; i++) {
            let data = new DailyQuestItemData(i, Config.QUEST[i], 0, 0, Config.QUEST_NUMBER[i], Config.QUEST_CHIP[i], Config.QUEST_EXP[i], false);
            this.items[i].data = data;
            if (cc.sys.localStorage.getItem(`${this.items[i].data.id}`)) {
                if (String(cc.sys.localStorage.getItem(`${this.items[i].data.id}`)) == "true") {
                    this.items[i].data.isClaim = true;
                } else {
                    this.items[i].data.isClaim = false;
                }
            } else {
                cc.sys.localStorage.setItem(`${this.items[i].data.id}`, "false");
            }
        }

        let mainData = new DailyQuestItemData(-1, Data.Q_MAIN, 0, 0, 5, 10000, 100, false);
        this.mainItem.data = mainData;
        if (cc.sys.localStorage.getItem(`${this.mainItem.data.id}`)) {
            if (String(cc.sys.localStorage.getItem(`${this.mainItem.data.id}`)) == "true") {
                this.mainItem.data.isClaim = true;
            } else {
                this.mainItem.data.isClaim = false;
            }
        } else {
            cc.sys.localStorage.setItem(`${this.mainItem.data.id}`, "false");
        }

        if (DataManager.instance.Q_MAIN_CLAIM_TIME != 0) {
            if (Date.now() - DataManager.instance.Q_MAIN_CLAIM_TIME > Utils.hoursToMiliseconds(24)) {
                DataManager.instance.Q_MAIN_CLAIM_TIME = 0;
                this.items.forEach(p => {
                    p.data.isClaim = false;
                    cc.sys.localStorage.setItem(`${p.data.id}`, "false");
                });
                DataManager.instance.Q_HIT_TIMES = 0;
                DataManager.instance.Q_MAIN = 0;
                DataManager.instance.Q_PLAYED_TIMES = 0;
                DataManager.instance.Q_SPLIT_TIMES = 0;
                DataManager.instance.Q_WIN_STREAKS = 0;
                DataManager.instance.Q_WIN_TIMES = 0;
                cc.sys.localStorage.setItem(Data.Q_MAIN, 0);
                cc.sys.localStorage.setItem(Data.Q_PLAYED_TIMES, 0);
                cc.sys.localStorage.setItem(Data.Q_WIN_TIMES, 0);
                cc.sys.localStorage.setItem(Data.Q_HIT_TIMES, 0);
                cc.sys.localStorage.setItem(Data.Q_WIN_STREAKS, 0);
                cc.sys.localStorage.setItem(Data.Q_SPLIT_TIMES, 0);
                cc.sys.localStorage.setItem(Data.Q_MAIN_CLAIM_TIME, 0);
                DataManager.instance.saveDataLocal();
                DataManager.instance.loadDataLocal();
                this.mainItem.data.isClaim = false;
                cc.sys.localStorage.setItem(`${this.mainItem.data.id}`, "false");
            }
        }
        this.refreshItems();
    }

    refreshItems() {
        this.items.forEach(p => p.node.active = false);
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            if (!item.data.isClaim) {
                item.node.active = true;
                DataManager.instance.Q_CURRENT = item.data.key;
                break;
            }
        }
        if (this.mainItem.data.isClaim) {
            this.mainItem.btnCollect.getComponent(cc.Animation).play("chest_open", 1);
        }
    }

    show(callback: Function = null) {
        this.body.opacity = 255;
        this.items.forEach(p => {
            p.btnCollect.interactable = true;
            p.btnGo.interactable = true;
        });
        if (callback) callback();
    }

    hide(callback: Function = null) {
        this.body.opacity = 0;
        this.items.forEach(p => {
            p.btnCollect.interactable = false;
            p.btnGo.interactable = false;
        });
        if (callback) callback();
    }

    available: boolean = false;

    check() {
        this.available = false;
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            if (item.node.active && item.sprReadyCollect.active) {
                this.available = true;  
                break;           
            }
        } 
    }
    
}
