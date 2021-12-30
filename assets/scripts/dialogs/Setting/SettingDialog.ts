import DataManager from "../../data/DataManager";
import Dialog from "../../components/dialog/Dialog";
import DialogManager from "../../components/dialog/DialogManager";
import SoundManager from "../../components/sound/SoundManager";
import Utils from "../../utils/Utils";
import SceneManager from "../../components/scene/SceneManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SettingDialog extends cc.Component {

    @property(cc.Button)
    btnClose: cc.Button = null;

    @property(cc.Slider)
    sliderMusic: cc.Slider = null;
    @property(cc.ProgressBar)
    progressBarMusic: cc.ProgressBar = null;

    @property(cc.Slider)
    sliderEffect: cc.Slider = null;
    @property(cc.ProgressBar)
    progressBarEffect: cc.ProgressBar = null;

    @property(cc.Toggle)
    toggleFps: cc.Toggle = null;

    @property(cc.Label)
    lbVersion: cc.Label = null;


    onLoad() {
        this.sliderMusic.progress = DataManager.instance.VOLUME_MUSIC;
        this.sliderEffect.progress = DataManager.instance.VOLUME_EFFECT;

        this.toggleFps.isChecked = DataManager.instance.FPS;

        this.progressBarMusic.progress = this.sliderMusic.progress;
        this.progressBarEffect.progress = this.sliderEffect.progress;

        this.sliderMusic.node.on('slide', () => {
            SoundManager.setBGVolume(this.sliderMusic.progress);
            this.progressBarMusic.progress = this.sliderMusic.progress;
            this.progressBarEffect.progress = this.sliderEffect.progress;
        }, this);

        this.sliderEffect.node.on('slide', () => {
            SoundManager.setEFVolume(this.sliderEffect.progress);
            this.progressBarMusic.progress = this.sliderMusic.progress;
            this.progressBarEffect.progress = this.sliderEffect.progress;
        }, this);

        this.btnClose.node.on("click", () => {
            DialogManager.hideDialog(Dialog.SETTING);
        }, this);

        this.toggleFps.node.on('toggle', ()=>{
            if(this.toggleFps.isChecked) {
                SceneManager.instance.lbFps.node.active = true;
            } else {
                SceneManager.instance.lbFps.node.active = false; 
            }
            DataManager.instance.FPS = this.toggleFps.isChecked;
        });

        this.lbVersion.string = DataManager.instance.VERSION;
    }

    show(param: any = null, callback: Function = null) {
        Utils.fadeIn(this.node, () => {
            if (callback) {
                callback();
            }
        })
    }

    hide(callback: Function = null) {
        Utils.fadeOut(this.node, () => {
            if (callback) {
                callback();
            }
        })
    }
}
