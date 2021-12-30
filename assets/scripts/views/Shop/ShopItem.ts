import Utils from "../../utils/Utils";
import ShopItemData from "./ShopItemData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShopItem extends cc.Component {

    data: ShopItemData = null;

    @property(cc.Label)
    lbChip: cc.Label = null;

    @property(cc.Label)
    lbPrice: cc.Label = null;

    @property(cc.Button)
    btnBuy: cc.Button = null;

    @property(cc.Sprite)
    sprLock: cc.Sprite = null;

    f5() {
        this.lbChip.string = `$ ${Utils.numberWithCommas(this.data.chip, 3)}`;
        this.lbPrice.string = `USD ${Utils.convert2UnitMoney(this.data.price, 3)}`;
    }
}
