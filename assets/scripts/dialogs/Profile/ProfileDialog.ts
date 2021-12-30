import Dialog from "../../components/dialog/Dialog";
import DialogManager from "../../components/dialog/DialogManager";
import DataManager from "../../data/DataManager";
import AnalyticEvent from "../../plugin/AnalyticEvent";
import PluginManager from "../../plugin/PluginManager";
import Config from "../../utils/Config";
import Utils from "../../utils/Utils";
import UserInfoView from "../../views/UserInfo/UserInfoView";
import ProfileItem from "./ProfileItem";
import ProfileItemData from "./ProfileItemData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ProfileDialog extends cc.Component {

    @property(cc.Button)
    btnClose: cc.Button = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Label)
    lbName: cc.Label = null;
    @property(cc.Sprite)
    sprAvatar: cc.Sprite = null;
    @property(cc.Label)
    lbBalance: cc.Label = null;
    @property(cc.Label)
    lbLevel: cc.Label = null;
    @property(cc.ProgressBar)
    pbLevel: cc.ProgressBar = null;

    //rank
    @property(cc.Label)
    lbRankName: cc.Label = null;
    @property(cc.Sprite)
    sprRankIcon: cc.Sprite = null;
    @property(cc.SpriteAtlas)
    atlasRankIcon: cc.SpriteAtlas = null;


    onLoad() {
        this.loadData();
        this.btnClose.node.on("click", () => {
            DialogManager.hideDialog(Dialog.PROFILE_DIALOG);
        }, this);
    }

    start(){
       
    }

    loadData() {
        for (let i = 0; i < Config.STATS_KEYS.length; i++) {
            let itemData = new ProfileItemData(Config.STATS_KEYS[i]);
            let item = cc.instantiate(this.itemPrefab).getComponent(ProfileItem);
            item.node.parent = this.content;
            item.data = itemData;
            item.refresh();
        }
    }

    show(param: any = null, callback: Function = null) {   
        this.lbName.string = DataManager.instance.DISPLAY_NAME;
        this.lbBalance.string = UserInfoView.instance.lbBalance.string;
        this.lbLevel.string = UserInfoView.instance.lbLevel.string;
        this.pbLevel.progress = UserInfoView.instance.pbPopupLevel.progress; 
        Utils.fadeIn(this.node, () => {
            PluginManager.instance.logEvent(AnalyticEvent.profile_show);
            if (callback) {
                callback();
            }
        })
    }

    hide(callback: Function = null) {
        Utils.fadeOut(this.node, () => {
            if (callback) {
                callback();
            }
        })
    }

    f5Rank() {
        for (let i = 0; i < Config.RANK_NAME.length; i++) {
            if (DataManager.instance.RANK_POINT < Config.RANK_POINT[i]) {
                this.lbRankName.string = Config.RANK_NAME[i];
                this.sprRankIcon.spriteFrame = this.atlasRankIcon.getSpriteFrame(`${i}`);
                break;
            }
        }
    }

    update() {
        this.f5Rank();
    }
}
