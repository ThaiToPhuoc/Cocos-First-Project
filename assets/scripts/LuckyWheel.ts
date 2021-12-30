import BlockInputManager from "./components/blockInput/BlockInputManager";
import { Sound } from "./components/sound/Sound";
import SoundManager from "./components/sound/SoundManager";
import DataManager from "./data/DataManager";
import LuckySpinItem from "./views/LuckySpin/LuckySpinItem";
import LuckySpinItemData from "./views/LuckySpin/LuckySpinItemData";
import AnalyticEvent from "./plugin/AnalyticEvent";
import PluginManager, { RewardAds } from "./plugin/PluginManager";
import Config from "./utils/Config";
import Easing from "./utils/Easing";
import Utils from "./utils/Utils";
import RewardView from "./views/Reward/RewardView";
import UserInfoView from "./views/UserInfo/UserInfoView";

const {ccclass, property} = cc._decorator;

export enum spinType{
    normal, ads
}

@ccclass
export default class LuckyWheel extends cc.Component {
    public static instance: LuckyWheel = null;

    @property(cc.Button)
    btnSpin: cc.Button = null;

    items: LuckySpinItem[] = [];

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
        this.btnSpin.node.on("click", () => {
            if (!this.isCoolDown) {
                this.onSpin(spinType.normal);
            } else {
                PluginManager.instance.showRewardAds(RewardAds.LUCKY_SPIN, this.adsCallback);
            }
        }, this);
        this.loadData();
    }

    update() {
        if (this.isCoolDown) {
            if (this.coolDownTime > 0) {
                let today = Date.now();
                this.coolDownTime = (this.endTime - today);
                this.cooldownLabel.string = "Next spin: " + Utils.timeHHMMSS(this.coolDownTime);
                this.cooldownLabel.node.active = true;
            } else {
                this.coolDownTime = 0;
                this.isCoolDown = false;
                this.btnSpin.interactable = true;
                this.btnSpin.getComponent(cc.Sprite).spriteFrame = this.normalButton;
                this.cooldownLabel.node.active = false;
            }
        }
        this.timerPool();
        this.spinProgressLabel.string = DataManager.instance.SPIN_COUNT + "/5";
        this.spinProgressBar.progress = Utils.normalized(DataManager.instance.SPIN_COUNT, 0, 5);
    }

    timerPool() {
        if (this.coolDownTimePool > 0 && this.spinPool.length > 0) {
            let now = Date.now();
            this.coolDownTimePool = (this.endTimePool - now);
        } else {
            this.resetPool();
        }
    }

    onSpin(type: spinType){
        BlockInputManager.instance.blockInput(true);
        this.buttonTouch.stopSystem();
        this.btnSpin.interactable = false;
        let randomItem = Utils.randomRangeInt(0,this.spinPool.length);
        let randomValue = this.spinPool[Utils.randomRangeInt(0, this.spinPool.length)];
        this.spinPool.splice(randomItem, 1);
        let itemAngle = randomValue * (360 / this.NUM_ITEM) * this.clockWise;
        if (this.tweenSpin) {
            this.tweenSpin.stop();
        }

        SoundManager.playEFSound(Sound.SFX_Lucky_Spin_Spin,true);
        this.tweenSpin = cc.tween(this.content)
            .set({ angle: 0 })
            .to(this.spinTime, { angle: (360 * this.spinRound + itemAngle) * this.clockWise }, { easing: Easing.smooth })
            .call(() => {
                BlockInputManager.instance.blockInput(false);
                console.log(`spin complete: ${this.items[randomValue].data.chip}`);
                SoundManager.stop(Sound.SFX_Lucky_Spin_Spin);
                this.btnSpin.interactable = true;

                this.startTime = Date.now();
                this.endTime = this.startTime + Utils.minutesToMiliseconds(10);
                this.coolDownTime = (this.endTime - this.startTime);
                this.isCoolDown = true;

                this.btnSpin.getComponent(cc.Sprite).spriteFrame = this.cooldownButton;
                this.buttonTouch.resetSystem();
                let reward = this.items[randomValue].data.chip;
                if (DataManager.instance.SPIN_COUNT < 5) {
                    DataManager.instance.SPIN_COUNT++;
                    RewardView.instance.show(reward);
                    // UserInfoView.instance.addBalance(reward);
                    if (DataManager.instance.SPIN_COUNT == 5) {
                        if (this.tweenDouble) {
                            this.tweenDouble.stop();
                            this.tweenDouble = null;
                        }
                        this.tweenDouble = Utils.scaleInOut(this.doubleNode, 999, 1, 0.2);
                    }
                    switch (type) {
                        case spinType.normal:
                            PluginManager.instance.logEvent(AnalyticEvent.lucky_spin_claim_normal, { "reward": reward });
                            break;
                        case spinType.ads:
                            PluginManager.instance.logEvent(AnalyticEvent.lucky_spin_claim_ads, { "reward": reward });
                            break;
                    }
                } else {
                    RewardView.instance.show(reward * 2);
                    // UserInfoView.instance.addBalance(reward * 2);
                    DataManager.instance.SPIN_COUNT = 0;
                    if (this.tweenDouble) {
                        this.tweenDouble.stop();
                        this.tweenDouble = null;
                    }
                    PluginManager.instance.logEvent(AnalyticEvent.lucky_spin_claim_x2, { "base": reward, "reward": reward * 2 });
                }

            })
            .start();
    }

    loadData() {
        for (let i = 0; i < this.NUM_ITEM; i++) {
            let theta = i * 2 * Math.PI / this.NUM_ITEM;
            let x = Math.sin(theta) * this.radius;
            let y = Math.cos(theta) * this.radius;
            let item = cc.instantiate(this.itemPrefab).getComponent(LuckySpinItem);
            item.node.parent = this.content;
            item.node.position = cc.v3(x, y, 0);
            item.node.angle = i * (360 / this.NUM_ITEM) * this.clockWise;
            item.color = i;
            this.items.push(item);
        }

        for (let i = 0; i < Config.LUCKY_SPIN_COLOR.length; i++) {
            let data = new LuckySpinItemData(Config.LUCKY_SPIN_BASE_CHIP[i] * DataManager.instance.LEVEL,
                Config.LUCKY_SPIN_Amount[i], Config.LUCKY_SPIN_COLOR[i]);
            this.items.find(p => p.color == data.color).data = data;
        }
        this.resetPool();
    }

    resetPool() {
        this.resetTimePool();
        this.spinPool.length = 0;
        for (let i = 0; i < Config.LUCKY_SPIN_COLOR.length; i++) {
            for (let j = 0; j < Config.LUCKY_SPIN_Amount[i]; j++) {
                this.spinPool.push(Config.LUCKY_SPIN_COLOR[i]);
            }
        }
        Utils.shuffle(this.spinPool);
    }

    adsCallback() {
        this.onSpin(spinType.ads);
    }

    show(callback: Function = null) {     
        this.node.setPosition(0,0);
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
