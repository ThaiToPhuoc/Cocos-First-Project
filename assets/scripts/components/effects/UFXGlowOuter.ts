import UFXConfig from "./UFXConfig";

const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass("UFXGlowOuterUBO")
export class UFXGlowOuterUBO {
    @property(cc.Color)
    glowColor: cc.Color = cc.Color.YELLOW;
    @property({ type: cc.Float, slide: true, min: 0, max: 1 })
    glowColorSize: number = 0.15;
    @property({ type: cc.Float, slide: true, min: 0, max: 1 })
    glowThreshold: number = 1;
}

@ccclass
@executeInEditMode
export default class UFXGlowOuter extends cc.Component {

    @property({ serializable: true })
    _ubo: UFXGlowOuterUBO = new UFXGlowOuterUBO();
    _tween: cc.Tween = null;

    _material: cc.Material = null;

    @property({ type: cc.Material, readonly: true })
    public get material() {
        if (this._material == null) {
            cc.resources.load(UFXConfig.GLOW_OUTER, cc.Material, (err, material) => {
                let _material = material as cc.Material;
                this._material = cc.MaterialVariant.create(_material, this.renderComponent);
                this._applyUBO();
            });
        }
        return this._material;
    }

    @property({ type: cc.RenderComponent, readonly: true })
    public get renderComponent(): cc.RenderComponent {
        return this.getComponent(cc.RenderComponent);
    }

    @property(cc.Boolean)
    public enableTimer: boolean = true;

    @property({ type: cc.Float, slide: true, min: 0, max: 10 })
    public delay: number = 1.0;

    @property({ type: cc.Float, slide: true, min: 0, max: 3 })
    public duration: number = 0.5;


    @property(UFXGlowOuterUBO)
    public get ubo() {
        return this._ubo;
    }

    public set ubo(v: UFXGlowOuterUBO) {
        this._ubo = v;
        this._applyUBO();
    }

    _applyUBO(): void {

        if (!this.ubo) {
            cc.warn("UBO not install");
            return;
        }

        if (this.material) {
            this.material.setProperty("glowColor", this.ubo.glowColor);
            this.material.setProperty("glowColorSize", this.ubo.glowColorSize);
            this.material.setProperty("glowThreshold", this.ubo.glowThreshold);
            if (this.renderComponent)
                this.renderComponent.setMaterial(0, this.material);
        }
    }

    _applyTimer(): void {
        if (this.enableTimer) {
            let tween = { x: 0 };
            this._tween = cc.tween(tween).delay(this.delay).repeatForever(cc.tween().to(this.duration, { x: 0.2 }, {
                progress: (start, end, current, ratio) => {
                    let value = start + (end - start) * ratio;
                    this.ubo.glowColorSize = value;
                    this._applyUBO();
                    return value;
                }
            }).
                to(this.duration, { x: 0 }, {
                    progress: (start, end, current, ratio) => {
                        let value = start + (end - start) * ratio;
                        this.ubo.glowColorSize = value;
                        this._applyUBO();
                        return value;
                    }
                })).start();
        }
    }

    start() {
        this._applyUBO();
        if (!CC_EDITOR) {
            this._applyTimer();
        }
    }

    onDestroy() {
        if (this._tween) {
            this._tween.stop();
            this._tween = null;
        }
    }

}
