import LuckyWheelItem from "./LuckyWheelItem";
import Config from "./utils/Config";

const {ccclass, property} = cc._decorator;

export enum spinType{
    normal, ads
}

@ccclass
export default class LuckyWheel extends cc.Component {
    public static instance: LuckyWheel = null;

    @property(cc.Button)
    btnSpin: cc.Button = null;

    item: LuckyWheelItem[] = [];

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.SpriteFrame)
    normalButton: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    cooldownButton: cc.SpriteFrame = null;

    startTime: number = 0;
    endTime: number = 0;
    coolDownTime: number = 0.1;
    isCoolDown: boolean = false;

    startTimePool: number = 0;
    endTimePool: number = 0;
    coolDownTimePool: number = 0.1;

    tweenSpin: cc.Tween = null;

    @property
    radius: number = 250;
    @property
    spinTime: number = 3;
    @property
    spinRound: number = 10;

    @property(cc.ParticleSystem)
    buttonTouch: cc.ParticleSystem = null;

    clockWise = -1;
    NUM_ITEM: number = 15;

    spinPool: number[] = [];

    @property(cc.Label)
    cooldownLabel: cc.Label = null;
    @property(cc.Label)
    spinProgressLabel: cc.Label = null;

    @property(cc.ProgressBar)
    spinProgressBar: cc.ProgressBar = null;

    @property(cc.Node)
    doubleNode: cc.Node = null;

    @property(cc.Button)
    closeButton: cc.Button = null;

    tweenDouble: cc.Tween = null;

    onLoad () {
        LuckyWheel.instance = this;
        if(this.closeButton){
            this.closeButton.node.on("click",()=>{
                LuckyWheel.instance.hide();
            });
        } 
    }

    start () {
        this.resetTimePool();
        this.buttonTouch.resetSystem();
        this.btnSpin.getComponent(cc.Sprite).spriteFrame = this.normalButton;

    }

    hide (callback: Function = null) {
        this.node.setPosition(9999,0);
    }

    resetTimePool() {
        let now = Date.now();
        let mnow = new Date(now).getHours() * 3600000 + new Date(now).getMinutes() * 60000 + new Date(now).getSeconds() * 1000 + new Date(now).getMilliseconds();
        this.endTimePool = now + Config.LUCKY_SPIN_POOL_RESET_TIME * 24 * 60 * 60 * 1000;
        this.coolDownTimePool = this.endTimePool - now;
    }
}
