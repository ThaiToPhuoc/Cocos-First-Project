const { ccclass, property, executeInEditMode, disallowMultiple } = cc._decorator;

export enum UFXState {
    Once,
    Loop
}

@ccclass
@executeInEditMode
@disallowMultiple
export default class UFXShake extends cc.Component {
    @property({ type: cc.Enum(UFXState) })
    public state: UFXState = UFXState.Once;

    @property(cc.Boolean)
    public playOnAwake: boolean = true;

    @property({ type: cc.Float, min: 0.1, max: 10, slide: true })
    public delay: number = 3;

    @property({ type: cc.Float, min: 0.1, max: 10, slide: true })
    public zoomDuration: number = 0.2;

    @property({ type: cc.Float, min: 0.1, max: 10, slide: true })
    public zoomTo: number = 1.1;

    @property({ type: cc.Float, min: 0.1, max: 10, slide: true })
    public shakeDuration: number = 0.2;

    @property({ type: cc.Integer })
    public shakeAngle: number = 15;

    @property({ type: cc.Integer, min: 1 })
    public shakeCount: number = 4;

    private _scaleDefault : number = 1;

    private _tween: cc.Tween = null;

    private playing: boolean = false;

    onLoad() {
        this._scaleDefault = this.node.scale;
        switch (this.state) {
            case UFXState.Once:
                this._tween = cc.tween(this.node)
                    .to(this.zoomDuration, { scale: this.zoomTo })
                    .repeat(this.shakeCount,
                        cc.tween()
                            .to(this.shakeDuration, { angle: -this.shakeAngle })
                            .to(this.shakeDuration, { angle: this.shakeAngle }))
                    .to(this.shakeDuration, { angle: 0 })
                    .to(this.zoomDuration, { scale: this._scaleDefault });
                break;
            case UFXState.Loop:
                this._tween = cc.tween(this.node)
                    .repeatForever(cc.tween()
                        .to(this.zoomDuration, { scale: this.zoomTo })
                        .repeat(this.shakeCount,
                            cc.tween()
                                .to(this.shakeDuration, { angle: -this.shakeAngle })
                                .to(this.shakeDuration, { angle: this.shakeAngle }))
                        .to(this.shakeDuration, { angle: 0 })
                        .to(this.zoomDuration, { scale: this._scaleDefault })
                        .delay(this.delay));
                break;
        }
        if (this._tween && this.playOnAwake) this._tween.start();
    }
    
    onDestroy() {
        if (this._tween) {
            this._tween.stop();
        }
    }

    run() {
        if (this._tween && !this.playing) {
            this._tween.start();
            this.playing = true;
        }
    }

    stop() {
        if (this._tween) {
            this._tween.stop();
            this.node.scale = this._scaleDefault;
            this.node.angle = 0;
            this.playing = false;
        }
    }


}