const { ccclass, property } = cc._decorator;

@ccclass
export default class Chip extends cc.Component {

    value: number = 0;

    @property(cc.Label)
    lbValue: cc.Label = null;

    @property(cc.Sprite)
    sprBackground: cc.Sprite = null;

}
