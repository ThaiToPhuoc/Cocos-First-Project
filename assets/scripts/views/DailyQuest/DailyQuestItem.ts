import Scene from "../../components/scene/Scene";
import SceneManager from "../../components/scene/SceneManager";
import Data from "../../data/Data";
import DataManager from "../../data/DataManager";
import Utils from "../../utils/Utils";
import DailyQuestItemData from "./DailyQuestItemData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DailyQuestItem extends cc.Component {

    data: DailyQuestItemData = null;

    @property(cc.Label)
    lbTitle: cc.Label = null;

    @property(cc.Label)
    lbChip: cc.Label = null;

    @property(cc.Label)
    lbExp: cc.Label = null;

    @property(cc.Label)
    lbProgress: cc.Label = null;

    @property(cc.ProgressBar)
    pbProgress: cc.ProgressBar = null;

    @property(cc.Button)
    btnGo: cc.Button = null;

    @property(cc.Button)
    btnCollect: cc.Button = null;

    @property(cc.Node)
    sprReadyCollect: cc.Node = null;

    @property()
    isMain: boolean = false;

    isReady: boolean = false;

    start() {
        this.schedule(this.f5, 1);
    }

    f5() {
        if (this.data) {
            switch (this.data.key) {
                case Data.Q_MAIN:
                    this.data.current = DataManager.instance.Q_MAIN;
                    break;
                case Data.Q_PLAYED_TIMES:
                    this.data.current = DataManager.instance.Q_PLAYED_TIMES;
                    break;
                case Data.Q_WIN_TIMES:
                    this.data.current = DataManager.instance.Q_WIN_TIMES;
                    break;
                case Data.Q_HIT_TIMES:
                    this.data.current = DataManager.instance.Q_HIT_TIMES;
                    break;
                case Data.Q_WIN_STREAKS:
                    this.data.current = DataManager.instance.Q_WIN_STREAKS;
                    break;
                case Data.Q_SPLIT_TIMES:
                    this.data.current = DataManager.instance.Q_SPLIT_TIMES;
                    break;
            }
            this.lbChip.string = Utils.convert2UnitMoney(this.data.chip, 3);
            this.lbExp.string = Utils.convert2UnitMoney(this.data.EXP, 3);
            this.lbTitle.string = this.data.title;
            (this.data.current > this.data.max) ? (this.data.current = this.data.max) : this.data.current;
            if (this.data.current < this.data.max) {
                if(!this.isMain){
                    this.btnGo.node.active = true;
                    this.btnCollect.node.active = false;
                    this.sprReadyCollect.active = false;
                }
            } else {
                if(!this.isMain){
                    this.btnGo.node.active = false;
                    this.btnCollect.node.active = true;
                    this.sprReadyCollect.active = true;
                } 
            }
            this.lbProgress.string = `${this.data.current}/${this.data.max}`;
            this.pbProgress.progress = Utils.normalized(this.data.current, this.data.min, this.data.max);
            if(SceneManager.instance.getCurrentScene() == Scene.SCENE_GAME){
                this.btnGo.node.active = false;
            } 
        }
    }
}

