import SoundFX, { SoundType } from "./SoundFX";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Button)
export default class SoundFXButton extends SoundFX {
    @property(cc.Button)
    public get button() {
        return this.getComponent(cc.Button);
    }

    start() {
        super.start();
        if(this.button) {
            this.button.node.on("click", () => {
                this.play();
            });
        }
    }
}