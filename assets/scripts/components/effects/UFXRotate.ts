import { UFXState } from "./UFXShake";

const { ccclass, property, executeInEditMode, disallowMultiple } = cc._decorator;

@ccclass
@executeInEditMode
@disallowMultiple
export default class UFXRotate extends cc.Component {
    @property({ type: cc.Enum(UFXState) })
    public state: UFXState = UFXState.Once;

    @property(cc.Boolean)
    public playOnAwake: boolean = true;

    @property({ tooltip: "reverse angle" })
    public reverse: boolean = false;

    @property({ type: cc.Float, min: 0.1, max: 3, slide: true })
    public delay: number = 0.5;

    @property({ type: cc.Float, min: 0.1, max: 3, slide: true })
    public rotateDuration: number = 0.2;

    @property({ type: cc.Integer, min: 1 })
    public rotateCount: number = 4;

    private _tween: cc.Tween = null;

    onLoad() {
        switch (this.state) {
            case UFXState.Once:
                if (this.reverse) {
                    this._tween = cc.tween(this.node)
                        .repeat(this.rotateCount,
                            cc.tween()
                            .to(this.rotateDuration, { angle: 360 })
                            .to(this.rotateDuration, { angle: -360 }))
                        .to(this.rotateDuration, { angle: 0 });
                }
                else {
                    this._tween = cc.tween(this.node)
                        .repeat(this.rotateCount, cc.tween()
                            .to(this.rotateDuration, { angle: -360 }).call(() => { this.node.angle = 0 }))
                        .delay(this.delay);
                }
                break;
            case UFXState.Loop:
                if (this.reverse) {
                    this._tween = cc.tween(this.node)
                        .repeatForever(cc.tween()
                            .repeat(this.rotateCount,
                                cc.tween()
                                    .to(this.rotateDuration, { angle: 360 })
                                    .to(this.rotateDuration, { angle: -360 }))
                            .delay(this.delay));
                }
                else {
                    this._tween = cc.tween(this.node)
                        .repeatForever(cc.tween()
                            .to(this.rotateDuration, { angle: -360 }).call(() => { this.node.angle = 0 }))
                        .delay(this.delay);
                }

                break;
        }
        if (this._tween && this.playOnAwake) this._tween.start();
    }

    start() {

    }

    onDestroy() {
        if (this._tween) {
            this._tween.stop();
        }
    }

    run() {
        if (this._tween) {
            this._tween.start();
        }
    }

    stop() {
        if (this._tween) {
            this._tween.stop();
        }
    }


}