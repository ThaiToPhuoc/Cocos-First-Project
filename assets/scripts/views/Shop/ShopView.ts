import Scene from "../../components/scene/Scene";
import DataManager from "../../data/DataManager";
import PluginManager from "../../plugin/PluginManager";
import Config from "../../utils/Config";
import Utils from "../../utils/Utils";
import ShopItem from "./ShopItem";
import ShopItemData from "./ShopItemData";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("View/ShopView")
export default class ShopView extends cc.Component {

    public static instance: ShopView = null;

    @property(cc.Node)
    body: cc.Node = null;

    @property(cc.Button)
    btnClose: cc.Button = null;

    @property(cc.Widget)
    widget: cc.Widget = null;

    @property(ShopItem)
    recommendOffer: ShopItem = null;

    @property(ShopItem)
    dailyOffer: ShopItem = null;

    items: ShopItem[] = [];

    @property(cc.Node)
    content: cc.Node = null;

    /* @property(cc.Mask)
    mask: cc.Mask = null; */

    onLoad() {
        switch (cc.director.getScene().name) {
            case Scene.SCENE_MENU:
                this.widget.enabled = false;
                this.btnClose.node.active = false;
                break;
            case Scene.SCENE_GAME:
                this.widget.enabled = true;
                this.btnClose.node.active = true;
                break;
        }
        ShopView.instance = this;
        this.checkOffer();
        this.items = this.content.getComponentsInChildren(ShopItem);
        //this.mask.enabled = true;

        this.btnClose.node.on('click', ()=>{
            this.hide();
        })

        this.loadData();

        this.items.forEach(p => {
            p.btnBuy.node.on("click", () => {
                if (cc.sys.isMobile && cc.sys.isNative) {
                    if(cc.sys.os == cc.sys.OS_ANDROID) {
                        PluginManager.instance.onPurchase(p.data.item);
                    }
                }
            })
        })

        this.recommendOffer.btnBuy.node.on("click", () => {
            if (cc.sys.isMobile && cc.sys.isNative) {
                if(cc.sys.os == cc.sys.OS_ANDROID) {
                    PluginManager.instance.onPurchase(this.recommendOffer.data.item);
                }
            }           
        });

        this.dailyOffer.btnBuy.node.on("click", () => {
            if (cc.sys.isMobile && cc.sys.isNative) {
                if(cc.sys.os == cc.sys.OS_ANDROID) {
                    PluginManager.instance.onPurchase(this.dailyOffer.data.item);
                }
            }         
        })

        if (DataManager.instance.DAILY_OFFER_BUY) {
            if (Date.now() - DataManager.instance.DAILY_OFFER_BUY_TIME > Utils.hoursToMiliseconds(24)) {
                this.dailyOffer.node.active = true;
                this.dailyOffer.btnBuy.interactable = true;
                this.dailyOffer.sprLock.node.active = false;
            }
        }
    }

    checkOffer() {
        if (!DataManager.instance.RECOMMEND_OFFER_BUY) {
            this.recommendOffer.node.active = true;
            this.dailyOffer.node.active = false;
        } else {
            this.recommendOffer.node.active = false;
            if (!DataManager.instance.DAILY_OFFER_BUY) {
                this.dailyOffer.node.active = true;
                this.dailyOffer.btnBuy.interactable = true;
                this.dailyOffer.sprLock.node.active = false;
            } else {
                this.dailyOffer.btnBuy.interactable = false;
                this.dailyOffer.sprLock.node.active = true;
            }
        }
    }

    loadData() {
        for (let i = 0; i < Config.SHOP_ITEM_COUNT; i++) {
            let itemData = new ShopItemData(Config.SHOP_CHIP[i], Config.SHOP_PRICE[i], Config.SHOP_PACKAGE_NAME[i]);
            let item = this.items[i];
            item.data = itemData;
            item.f5();
        }
        this.recommendOffer.data = new ShopItemData(1000000, 1, "offer01");
        this.recommendOffer.f5();
        this.dailyOffer.data = new ShopItemData(500000, 1, "daily01");
        this.dailyOffer.f5();
    }

    show(callback: Function = null) {
        Utils.fadeIn(this.body, () => {
            if (callback) {
                callback();
            }
        })
    }

    hide(callback: Function = null) {
        Utils.fadeOut(this.body, () => {
            if (callback) {
                callback();
            }
        })
    }

}
