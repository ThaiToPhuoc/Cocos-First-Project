import UFXConfig from "./UFXConfig";

const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass("UFXCornerCropUBO")
export class UFXCornerCropUBO {
    @property({ type: cc.Float, slide: true, min: 0, max: 0.5 })
    radius: number = 0;
}

@ccclass
@executeInEditMode
export default class UFXCornerCrop extends cc.Component {

    @property({ serializable: true })
    _ubo: UFXCornerCropUBO = new UFXCornerCropUBO();

    _material: cc.Material = null;

    @property({ type: cc.Material, readonly: true })
    public get material() {
        if (this._material == null) {
            cc.resources.load(UFXConfig.ROUND_CORNER_CROP, cc.Material, (err, material) => {
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

    @property(UFXCornerCropUBO)
    public get ubo() {
        return this._ubo;
    }

    public set ubo(v: UFXCornerCropUBO) {
        this._ubo = v;
        this._applyUBO();
    }


    _applyUBO(): void {

        if (!this.ubo) {
            cc.warn("UBO not install");
            return;
        }
        if (this.material) {
            //Radius length of rounded corner x axis (relative to texture width) [0.0, 0.5]
            this.material.setProperty("xRadius", this.ubo.radius);
            //Radius length of rounded corner y axis (relative to texture width) [0.0, 0.5]
            this.material.setProperty("yRadius", this.ubo.radius);
            //Update material
            this.renderComponent.setMaterial(0, this.material);
        }
    }



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    // update (dt) {}
}
