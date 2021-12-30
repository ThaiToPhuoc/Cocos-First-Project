const {ccclass, property} = cc._decorator;

@ccclass
export default class BlockInputManager extends cc.Component {

    public static instance: BlockInputManager = null;

    @property(cc.BlockInputEvents)
    blockInputEvents: cc.BlockInputEvents = null;

    onLoad () {
        BlockInputManager.instance = this;
        cc.game.addPersistRootNode(this.node);
        this.blockInput(false);
    }

    blockInput(block: boolean = false){
        if(block){
            this.blockInputEvents.enabled = true;
        } else {
            this.blockInputEvents.enabled = false;
        }
    }

    wait(time: number, callback: Function){
        this.blockInputEvents.enabled = true;
        this.scheduleOnce(()=>{
            this.blockInputEvents.enabled = false;
            callback();
        }, time);
    }
}
