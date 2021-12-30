import Scene from "./components/scene/Scene";
import SceneManager from "./components/scene/SceneManager";
import DataManager from "./data/DataManager";
import { Sound } from "./components/sound/Sound";
import SoundManager from "./components/sound/SoundManager";
import PluginManager from "./plugin/PluginManager";
import AnalyticEvent from "./plugin/AnalyticEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Launcher extends cc.Component {

    start() {
        SoundManager.setBGVolume(DataManager.instance.VOLUME_MUSIC);
        SoundManager.setEFVolume(DataManager.instance.VOLUME_EFFECT);
        SoundManager.playBGSound(Sound.MUSIC_BACKGROUND);
        SceneManager.loadSceneAsync(Scene.SCENE_MENU, true, false);
        if(DataManager.instance.FPS) {
            SceneManager.instance.lbFps.node.active = true;
        } else {
            SceneManager.instance.lbFps.node.active = false; 
        }
        PluginManager.instance.logEvent(AnalyticEvent.app_started);
    }
}
