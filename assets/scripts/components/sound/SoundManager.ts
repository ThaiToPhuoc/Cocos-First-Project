
const { ccclass, property, disallowMultiple, menu } = cc._decorator;

@ccclass
@disallowMultiple
@menu('Game/Sound/SoundManager')
export default class SoundManager extends cc.Component {

    public static instance: SoundManager = null;

    static playingSounds: Map<string, number> = new Map();

    loadedClips: cc.AudioClip[] = [];

    onLoad() {
        SoundManager.instance = this;       
    }

    static playBGSound(name: string, loop: boolean = false) {
        //console.log(SoundManager.playingSounds);
        cc.resources.load("sounds/" + name, function (err, clip: cc.AudioClip) {
            let id = cc.audioEngine.playMusic(clip, loop);
            SoundManager.playingSounds.set(name, id);
            cc.audioEngine.setFinishCallback(id, ()=>{
                SoundManager.playingSounds.delete(name);
            })
        });
    }

    static playEFSound(name: string, loop: boolean = false) {
        //console.log(SoundManager.playingSounds);
        cc.resources.load("sounds/" + name, function (err, clip: cc.AudioClip) {
            let id = cc.audioEngine.playEffect(clip, loop);
            SoundManager.playingSounds.set(name, id);
            cc.audioEngine.setFinishCallback(id, ()=>{
                SoundManager.playingSounds.delete(name);
            })
        });
    }

    static stop(name: string) {
        let id = SoundManager.playingSounds.get(name);
        cc.audioEngine.stop(id);
        SoundManager.playingSounds.delete(name);
    }

    static setBGVolume(volume: number) {
        cc.audioEngine.setMusicVolume(volume);
    }

    static setEFVolume(volume: number) {
        cc.audioEngine.setEffectsVolume(volume);
    }

}