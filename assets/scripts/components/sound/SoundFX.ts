import SoundManager from "./SoundManager";

const { ccclass, property, disallowMultiple } = cc._decorator;

export enum SoundType {
    MUSIC,
    EFFECT
}


@ccclass
@disallowMultiple
export default class SoundFX extends cc.Component {
    @property(cc.String)
    public soundName: string = "";

    @property({ type: cc.Enum(SoundType) })
    public soundType: SoundType = SoundType.EFFECT;

    @property(cc.Boolean)
    public playOnLoad: boolean = true;

    private soundId: any = null;

    @property(cc.Boolean)
    private setup: boolean = false;

    @property({ type: cc.AudioClip, visible: function () { return this.setup; } })
    private get sound() {
        return null;
    }

    private set sound(v: cc.AudioClip) {
        if (!!v) this.soundName = v.name;
    }

    public start() {
        if (this.playOnLoad) this.play();
    }

    public play() {
        if (!!this.soundName) {
            if (this.soundType == SoundType.EFFECT) {
                SoundManager.playEFSound(this.soundName);
            }
            else {
                SoundManager.playBGSound(this.soundName);
            }

        }
    }

    public stop() {
        if (!!this.soundId) {
            SoundManager.stop(this.soundId);
            this.soundId = null;
        }
    }
}