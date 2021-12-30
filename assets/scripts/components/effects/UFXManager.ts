const { ccclass, property, executionOrder } = cc._decorator;

@ccclass
@executionOrder(-1)
export default class UFXManager extends cc.Component {
    public static instance: UFXManager;

    @property({ serializable: true })
    _useUFX: boolean = true;

    @property(cc.Boolean)
    public get useUFX() {
        return this._useUFX;
    }

    public set useUFX(v: boolean) {
        this._useUFX = v;
        cc.dynamicAtlasManager.enabled = !v;
    }

    onLoad() {
        if (!!UFXManager.instance) return;
        UFXManager.instance = this;
    }

    start() {
        cc.dynamicAtlasManager.enabled = !this._useUFX;
        cc.game.addPersistRootNode(this.node);
    }
}