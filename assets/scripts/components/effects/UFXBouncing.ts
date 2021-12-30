import { UFXState } from "./UFXShake";

const { ccclass, property, executeInEditMode, disallowMultiple } = cc._decorator;

export enum Direction {
    Up,
    Down,
    Left,
    Right,
}

@ccclass
@executeInEditMode
@disallowMultiple
export default class UFXBouncing extends cc.Component {
    @property({ type: cc.Enum(UFXState) })
    public state: UFXState = UFXState.Once;

    @property(cc.Boolean)
    public playOnAwake: boolean = true;

    @property({ type: cc.Float, min: 0.1, max: 3, slide: true })
    public delay: number = 0.5;

    @property({ type: cc.Float, min: 0.1, max: 3, slide: true })
    public zoomDuration: number = 0.2;

    @property({ type: cc.Float, min: 0.1, max: 3, slide: false, step: 0.01 })
    public zoomTo: number = 1.1;

    @property({ type: cc.Float, min: 0.1, max: 3, slide: true })
    public bouncingDuration: number = 0.2;

    @property({ type: cc.Integer })
    public bouncingRangeX: number = 20;

    @property({ type: cc.Integer })
    public bouncingRangeY: number = 20;

    @property({ type: cc.Integer, min: 1 })
    public bouncingCount: number = 4;


    @property({ type: cc.Enum(Direction) })
    public directionV: Direction = Direction.Down;

    @property({ type: cc.Enum(Direction) })
    public directionH: Direction = Direction.Left;

    private _tween: cc.Tween = null;
    private _running: boolean = false;

    private _startPos: cc.Vec3 = cc.Vec3.ZERO;

    onLoad() {

        this._startPos = this.node.position;

        let dirY = this.directionV == Direction.Down ? 1 : -1;
        let dirX = this.directionH == Direction.Left ? 1 : -1;

        switch (this.state) {
            case UFXState.Once:
                this._tween = cc.tween(this.node)
                    .to(this.zoomDuration, { scale: this.zoomTo })
                    .repeat(this.bouncingCount,
                        cc.tween()
                            .by(this.bouncingDuration, { x: -dirX * this.bouncingRangeX, y: -dirY * this.bouncingRangeY })
                            .by(this.bouncingDuration, { x: dirX * this.bouncingRangeX, y: dirY * this.bouncingRangeY }))
                    .to(this.zoomDuration, { scale: 1 });
                break;
            case UFXState.Loop:
                this._tween = cc.tween(this.node)
                    .repeatForever(cc.tween()
                        .to(this.zoomDuration, { scale: this.zoomTo })
                        .repeat(this.bouncingCount,
                            cc.tween()
                                .by(this.bouncingDuration, { x: -dirX * this.bouncingRangeX, y: -dirY * this.bouncingRangeY })
                                .by(this.bouncingDuration, { x: dirX * this.bouncingRangeX, y: dirY * this.bouncingRangeY }))
                        .to(this.zoomDuration, { scale: 1 })
                        .delay(this.delay));
                break;
        }
        if (this.playOnAwake) this.run();
    }

    start() {

    }

    onDestroy() {
        this.stop();
    }

    onLostFocusInEditor() {
        //console.log("ad")
        this.run()
    }

    run() {
        this.stop();
        if (this._tween) {
            //this._tween.stop();
            this._tween.start();
            this._running = true;
        }
    }

    runIgnore() {
        if (this._tween) {
            if (this._running) return;
            this.run();
        }
    }

    stop() {
        if (this._tween) {
            this._tween.stop();
            this.node.scale = 1;
            this.node.angle = 0;
            this.node.position = this._startPos;
            this._running = false;
        }
    }


}