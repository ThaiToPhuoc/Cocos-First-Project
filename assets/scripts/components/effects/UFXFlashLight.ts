import UFXConfig from "./UFXConfig";
import UFXManager from "./UFXManager";

const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass("UFXFlashLightUBO")
export class UFXFlashLightUBO {
    @property(cc.Color)
    lightColor: cc.Color = cc.Color.YELLOW;
    @property(cc.Vec2)
    lightCenterPoint: cc.Vec2 = cc.v2(0.5, 0.5);
    @property(cc.Integer)
    lightAngle: number = 45;
    @property(cc.Float)
    lightWidth: number = 0.5;
    @property(cc.Boolean)
    enableGradient: boolean = true;
    @property(cc.Boolean)
    cropAlpha: boolean = true;
    @property(cc.Boolean)
    enableFog: boolean = false;
}

@ccclass
@executeInEditMode
export default class UFXFlashLight extends cc.Component {
    @property({ serializable: true })
    _ubo: UFXFlashLightUBO = new UFXFlashLightUBO();

    @property(cc.Boolean)
    public enableTimer: boolean = true;

    @property({ type: cc.Float, slide: true, min: 0, max: 10 })
    public delay: number = 1.0;

    @property({ type: cc.Float, slide: true, min: 0, max: 3 })
    public duration: number = 1;

    @property(UFXFlashLightUBO)
    public get ubo() {
        return this._ubo;
    }

    public set ubo(v: UFXFlashLightUBO) {
        this._ubo = v;
        this._applyUBO();
    }

    private _material: cc.Material = null;
    @property({ type: cc.Material, readonly: true })
    public get material() {
        if (this._material == null) {
            cc.resources.load(UFXConfig.FLASH_LIGHT, cc.Material, (err, material) => {
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

    _tween: cc.Tween = null;

    _applyUBO(): void {

        if (!this.ubo) {
            cc.warn("UBO not install");
            return;
        }

        if (this.material) {
            this.material.setProperty("lightColor", this.ubo.lightColor);
            this.material.setProperty("lightCenterPoint", this.ubo.lightCenterPoint);
            this.material.setProperty("lightAngle", this.ubo.lightAngle);
            this.material.setProperty("lightWidth", this.ubo.lightWidth);
            this.material.setProperty("enableGradient", this.ubo.enableGradient);
            this.material.setProperty("cropAlpha", this.ubo.cropAlpha);
            this.material.setProperty("enableFog", this.ubo.enableFog);
            if (this.renderComponent)
                this.renderComponent.setMaterial(0, this.material);
        }
    }

    _applyTimer(): void {
        if (this.enableTimer) {
            let tween = { x: -1 };
            this._tween = cc.tween(tween).delay(this.delay).repeatForever(cc.tween().to(this.duration, { x: 1 }, {
                progress: (start, end, current, ratio) => {
                    let value = start + (end - start) * ratio;
                    this.ubo.lightCenterPoint = cc.v2(value, value);
                    this._applyUBO();
                    return value;
                }
            }).call(() => {
                tween.x = -1;
                this.ubo.lightCenterPoint = cc.v2(tween.x, tween.x);
                this._applyUBO();
            }).delay(2)).start();
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