import Scene from "../scene/Scene";
import DataManager from "../../data/DataManager";
import Dialog from "../dialog/Dialog";
import DialogManager from "../dialog/DialogManager";
import PluginManager from "../../plugin/PluginManager";
import { QuitGameDialogParam } from "../../dialogs/QuitGame/QuitGameDialog";
import SceneManager from "../scene/SceneManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class InputManager extends cc.Component {

    public static instance: InputManager = null;

    onLoad() {
        InputManager.instance = this;
        cc.game.addPersistRootNode(this.node);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onBack, this);

        cc.game.on(cc.game.EVENT_HIDE, function () {
            DataManager.instance.saveDataLocal();
            PluginManager.instance.sendScores();
        });
    }

    onBack(event: any) {
        if (event.keyCode == cc.macro.KEY.back || event.keyCode == cc.macro.KEY.backspace) {
            let param: QuitGameDialogParam = new QuitGameDialogParam();
            let okCallback: Function;
            switch (cc.director.getScene().name) {
                case Scene.SCENE_LAUNCHER:
                    //do nothing
                    break;
                case Scene.SCENE_GAME:
                    param.title = "BACK";
                    param.message = "Back to menu?";
                    okCallback = () => {
                        SceneManager.loadSceneAsync(Scene.SCENE_MENU, true, false);
                    }
                    break;
                case Scene.SCENE_MENU:
                    param.title = "QUIT";
                    param.message = "Quit Ace Blackjack?";
                    okCallback = () => {
                        cc.game.end();
                    }
                    PluginManager.instance.showReview();
                    break;
            }
            DialogManager.showDialog(Dialog.QUIT_GAME, param, null, okCallback);
        }
    }

    start() {

    }

    // update (dt) {}
}
