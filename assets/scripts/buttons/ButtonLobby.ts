import Scene from "../components/scene/Scene";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ButtonLobby extends cc.Component {
    
    @property(cc.Label)
    lbBtnName: cc.Label = null;

    onLoad() {
        switch (cc.director.getScene().name) {
            case Scene.SCENE_GAME:
                this.lbBtnName.string = "Lobby";
                this.node.on('click', () => {
                    cc.director.loadScene(Scene.SCENE_MENU);
                }, this);

                break;
            case Scene.SCENE_MENU:
                this.lbBtnName.string = "Quit";
                this.node.on('click', () => {
                    cc.game.end();
                }, this);
                break;
        }
        
    }
}

