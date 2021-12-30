import Scene from "../../components/scene/Scene";
import SceneManager from "../../components/scene/SceneManager";
import DataManager from "../../data/DataManager";
import AnalyticEvent from "../../plugin/AnalyticEvent";
import PluginManager from "../../plugin/PluginManager";
import Utils from "../../utils/Utils";
import SelectTableItemData from "./SelectTableItemData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SelectTableItem extends cc.Component {

    data: SelectTableItemData = null;

    @property(cc.Label)
    lbTableName: cc.Label = null;

    @property(cc.Label)
    lbMinBalance: cc.Label = null;

    @property(cc.Label)
    lbBet: cc.Label = null;

    @property(cc.Button)
    btnPlay: cc.Button = null;

    @property(cc.Sprite)
    sprLock: cc.Sprite = null;

    @property(cc.Sprite)
    sprPreview: cc.Sprite = null;

    imagePath: string = "atlas/table";

    start() {
        let self = this;
        this.lbTableName.string = this.data.name;
        this.lbBet.string = `$${Utils.convert2UnitMoney(this.data.minBet, 3)}-$${Utils.convert2UnitMoney(this.data.maxBet, 3)}`;
        this.lbMinBalance.string = `$${Utils.convert2UnitMoney(this.data.minBalance, 3)}`;
        this.btnPlay.node.on("click", ()=>{
            if(!this.data.isLock){
                DataManager.instance.TABLE_NAME = this.lbTableName.string;   
                DataManager.instance.MIN_BET = this.data.minBet;    
                DataManager.instance.MAX_BET = this.data.maxBet;    
                DataManager.instance.MIN_BALANCE = this.data.minBalance;   
                DataManager.instance.EXP_WIN = this.data.winEXP;  
                DataManager.instance.EXP_LOSE_DRAW = this.data.loseDrawEXP;  
                PluginManager.instance.logEvent(AnalyticEvent.table_enter,{ "name": this.lbTableName.string });
                SceneManager.loadSceneAsync(Scene.SCENE_GAME, true, false);
            }
        }, this);
        cc.resources.load(`atlas/table/${this.data.imageName}`, cc.SpriteFrame, function (err: Error, spriteFrame: cc.SpriteFrame) {
            if(err) {
                console.log(err.message);
                return;
            }
            self.sprPreview.spriteFrame = spriteFrame;
        });
        this.schedule(this.f5, 1);
    }

    f5(){
        if(this.data){
            if (DataManager.instance.BALANCE < this.data.minBalance) {
                this.data.isLock = true;
                this.btnPlay.interactable = false;
            } else {
                this.data.isLock = false;
                this.btnPlay.interactable = true;
            }
            if (this.data.isLock) {
                this.sprLock.node.active = true;
            } else {
                this.sprLock.node.active = false;
            }
        }
    }

}
