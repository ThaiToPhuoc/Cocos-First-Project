import UFXConfig from "./UFXConfig";

const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass("UFXPointLightUBO")
export class UFXPointLightUBO {
    @property(cc.Color)
    centerColor: cc.Color = cc.Color.YELLOW;
    @property(cc.Vec2)
    centerPoint: cc.Vec2 = cc.v2(0.5, 0.5);
    @property(cc.Integer)
    radius: number = 0.1;
    @property(cc.Boolean)
    cropAlpha: boolean = true;
    @property(cc.Boolean)
    enableFog: boolean = false;
}

@ccclass
@executeInEditMode
export default class UFXPointLight extends cc.Component {
    @property({ serializable: true })
    _ubo: UFXPointLightUBO = new UFXPointLightUBO();

    _tween: cc.Tween = null;

    _material: cc.Material = null;

    @property({ type: cc.Material, readonly: true })
    public get material() {
        if (this._material == null) {
            cc.resources.load(UFXConfig.POINT_LIGHT, cc.Material, (err, material) => {
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

    @property(UFXPointLightUBO)
    public get ubo() {
        return this._ubo;
    }

    public set ubo(v: UFXPointLightUBO) {
        this._ubo = v;
        this._applyUBO();
    }

    _applyUBO(): void {

        if (!this.ubo) {
            cc.warn("UBO not install");
            return;
        }

        if (this.material) {
            this.material.setProperty("centerColor", this.ubo.centerColor);
            this.material.setProperty("centerPoint", this.ubo.centerPoint);
            this.material.setProperty("radius", this.ubo.radius);
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
                    this.ubo.centerPoint = cc.v2(value, value);
                    this._applyUBO();
                    return value;
                }
            }).to(this.duration, { x: -1 }, {
                progress: (start, end, current, ratio) => {
                    let value = start + (end - start) * ratio;
                    this.ubo.centerPoint = cc.v2(value, value);
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