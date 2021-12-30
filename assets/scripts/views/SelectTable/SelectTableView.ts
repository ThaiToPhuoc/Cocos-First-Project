import Config from "../../utils/Config";
import Utils from "../../utils/Utils";
import DailyRewardView from "../DailyReward/DailyRewardView";
import SelectTableItem from "./SelectTableItem";
import SelectTableItemData from "./SelectTableItemData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SelectTableView extends cc.Component {

    public static instance: SelectTableView = null;

    isShow: boolean = true;

    @property(cc.Prefab)
    selectTableItemPrefab: cc.Prefab = null;

    tables: SelectTableItem[] = [];

    @property(cc.Node)
    body: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    onLoad() {
        SelectTableView.instance = this;
        this.createTables();
    }

    start() {

    }

    createTables() {
        for (let i = 0; i < Config.ROOM_MIN_BET.length; i++) {
            let data = new SelectTableItemData(i, Config.ROOM_MIN_BET[i], Config.ROOM_MAX_BET[i],
                Config.ROOM_WIN_XP[i], Config.ROOM_LOSE_XP[i], Config.ROOM_DECK[i], Config.TABLE_NAME[i], Config.TABLE_IMAGE[i]);    
            let table = cc.instantiate(this.selectTableItemPrefab).getComponent(SelectTableItem);
            table.node.parent = this.content;
            table.data = data;
            this.tables.push(table);
        }
    }


    public get currentTable(): SelectTableItem {
        return this.tables.find((p) => p.data.isPlay);
    }


    show(callback: Function = null) {
        this.isShow = true;
        this.tables.forEach((p) => {
            p.data.isPlay = false;
        })
        Utils.fadeIn(this.body, () => {
            if (callback) {
                callback();
            }
        })
    }

    hide(callback: Function = null) {
        this.isShow = false;
        Utils.fadeOut(this.body, () => {
            if (callback) {
                callback();
            }
        })
    }

    update() {
        
    }

}
