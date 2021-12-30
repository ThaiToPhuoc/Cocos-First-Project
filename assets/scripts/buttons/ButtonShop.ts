import AnalyticEvent from "../plugin/AnalyticEvent";
import PluginManager from "../plugin/PluginManager";
import ShopView from "../views/Shop/ShopView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ButtonShop extends cc.Component {
    onLoad () {
        this.node.on('click', ()=>{
            ShopView.instance.show();
            PluginManager.instance.logEvent(AnalyticEvent.shop_show_btn);
        }, this);
    }
}

