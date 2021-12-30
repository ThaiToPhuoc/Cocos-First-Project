import AnalyticEvent from "../plugin/AnalyticEvent";
import PluginManager from "../plugin/PluginManager";
import Utils from "../utils/Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ButtonTipLevel extends cc.Component {

    @property(cc.Node)
    tip: cc.Node = null;

    show: boolean = false;

    onLoad () {
        this.tip.active = false;
        this.node.on('click', ()=>{
            if(!this.show){              
                Utils.fadeIn(this.tip);
                PluginManager.instance.logEvent(AnalyticEvent.toggle_level_show);
            } else {
                Utils.fadeOut(this.tip);
            }
            this.show = !this.show;
        }, this);
    }
}

