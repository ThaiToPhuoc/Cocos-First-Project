const {ccclass, property} = cc._decorator;

@ccclass('SoundDescription')
export default class SoundDescription {
    @property(cc.String)
    public key: string = '';
    @property({type: cc.AudioClip})
    public clip: cc.AudioClip = null;
}