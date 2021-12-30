import AchievementView from "../Achievement/AchievementView";
import DailyQuestView from "../DailyQuest/DailyQuestView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MissionView extends cc.Component {

    public static instance: MissionView = null;

    @property(cc.Node)
    body: cc.Node = null;

    @property(cc.ToggleContainer)
    toggleContainer: cc.ToggleContainer = null;

    @property(cc.Button)
    btnClose: cc.Button = null;

    onLoad() {
        MissionView.instance = this;
        if(this.btnClose) {
            this.btnClose.node.on("click", ()=>{
                MissionView.instance.hide();
            });
        }
        
    }

    start() {     
        this.hide();
        this.toggleCheck();    
    }

    toggleCheck(){
        if(this.toggleContainer.toggleItems[0].isChecked){
            DailyQuestView.instance.show();
            AchievementView.instance.hide();
        }
        if(this.toggleContainer.toggleItems[1].isChecked){
            DailyQuestView.instance.hide();
            AchievementView.instance.show();
        }
    }

    show(callback: Function = null) {     
        this.node.setPosition(0,0);
    }

    hide(callback: Function = null) {
        this.node.setPosition(9999,0);
    }
}
