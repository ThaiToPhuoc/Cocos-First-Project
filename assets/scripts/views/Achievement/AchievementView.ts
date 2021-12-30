import Config from "../../utils/Config";
import MenuPageView from "../MenuPage/MenuPageView";
import RewardView from "../Reward/RewardView";
import UserInfoView from "../UserInfo/UserInfoView";
import AchievementItem from "./AchivementItem";
import AchievementItemData from "./AchivementItemData";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("View/AchievementView")
export default class AchievementView extends cc.Component {

    public static instance: AchievementView = null;

    items: AchievementItem[] = [];

    @property(cc.Node)
    body: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    onLoad() {
        AchievementView.instance = this;
        this.items = this.content.getComponentsInChildren(AchievementItem);
        this.items.forEach(p => {
            p.btnClaim.node.on("click", () => {
                p.data.min = p.data.max;
                UserInfoView.instance.addEXP(p.data.xp);
                let reward = p.data.chip;
                RewardView.instance.show(reward);
                UserInfoView.instance.addBalance(reward);
                p.data.stage++;
                cc.sys.localStorage.setItem(`Achievement-${p.data.key}`, p.data.stage);
            });

            p.btnGo.node.on("click", () => {
                MenuPageView.instance.setPage(2, 0);
                UserInfoView.instance.show();
            });
        });
        this.loadData();
    }

    start() {
        //this.hide();
        this.schedule(this.check, 1);
    }

    loadData() {
        for (let i = 0; i < Config.ACHIEVEMENT_KEY.length; i++) {
            let itemData = new AchievementItemData(Config.ACHIEVEMENT_KEY[i], Config.ACHIEVEMENT_CHIP[i], Config.ACHIEVEMENT_EXP[i], Config.ACHIEVEMENT_PROGRESS[i]);
            this.items[i].data = itemData;
            if (cc.sys.localStorage.getItem(`Achievement-${this.items[i].data.key}`)) {
                this.items[i].data.stage = Number(cc.sys.localStorage.getItem(`Achievement-${this.items[i].data.key}`));
            } else {
                cc.sys.localStorage.setItem(`Achievement-${this.items[i].data.key}`, this.items[i].data.stage);
            }
        }
    }

    show(callback: Function = null) {
        this.body.opacity = 255;
        this.items.forEach(p => {
            p.btnClaim.interactable = true;
            p.btnGo.interactable = true;
        });
        if (callback) callback();
    }

    hide(callback: Function = null) {
        this.body.opacity = 0;
        this.items.forEach(p => {
            p.btnClaim.interactable = false;
            p.btnGo.interactable = false;
        });
        if (callback) callback();
    }

    available: boolean = false;

    check() {
        this.available = false;
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            if (item.node.active && item.sprReady.active) {
                this.available = true;  
                break;           
            }
        } 
    }
}
