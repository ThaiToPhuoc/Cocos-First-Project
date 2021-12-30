const {ccclass, property} = cc._decorator;

@ccclass("SoundData")
export default class SoundData{

    @property(cc.String)
    name = "";

    @property(cc.AudioClip)
    clip = null;

}
