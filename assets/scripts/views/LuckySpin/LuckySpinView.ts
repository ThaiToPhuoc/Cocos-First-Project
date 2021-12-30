import BlockInputManager from "../../components/blockInput/BlockInputManager";
import { Sound } from "../../components/sound/Sound";
import SoundManager from "../../components/sound/SoundManager";
import DataManager from "../../data/DataManager";
import AnalyticEvent from "../../plugin/AnalyticEvent";
import PluginManager, { RewardAds } from "../../plugin/PluginManager";
import Config from "../../utils/Config";
import Easing from "../../utils/Easing";
import Utils from "../../utils/Utils";
import RewardView from "../Reward/RewardView";
import UserInfoView from "../UserInfo/UserInfoView";
import LuckySpinItem from "./LuckySpinItem";
import LuckySpinItemData from "./LuckySpinItemData";

const { ccclass, property } = cc._decorator;

export enum SpinType {
    normal, ads
}

@ccclass
export default class LuckySpinView extends cc.Component {

    public static instance: LuckySpinView = null;

    @property(cc.Button)
    btnSpin: cc.Button = null;

    items: LuckySpinItem[] = [];

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.SpriteFrame)
    normalFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    cooldownFrame: cc.SpriteFrame = null;

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
    pTouch: cc.ParticleSystem = null;

    clockWise = -1;
    NUM_ITEM: number = 15;

    spinPool: number[] = [];

    @property(cc.Label)
    lbCooldown: cc.Label = null;
    @property(cc.Label)
    lbSpinProgress: cc.Label = null;
    @property(cc.ProgressBar)
    pbSpinProgress: cc.ProgressBar = null;

    @property(cc.Node)
    nodeDouble: cc.Node = null;

    @property(cc.Button)
    btnClose: cc.Button = null;

    twDouble: cc.Tween = null;

    onLoad() {
        LuckySpinView.instance = this;
        if(this.btnClose) {
            this.btnClose.node.on("click", ()=>{
                LuckySpinView.instance.hide();
            });
        }
    }

    start() {
        this.resetTimerPool();
        this.pTouch.resetSystem();
        this.btnSpin.getComponent(cc.Sprite).spriteFrame = this.normalFrame;
        this.btnSpin.node.on("click", () => {
            if (!this.isCoolDown) {
                this.onSpin(SpinType.normal);
            } else {
                PluginManager.instance.showRewardAds(RewardAds.LUCKY_SPIN, this.adsCallback);
            }
        }, this);
        this.loadData();
    }

    onSpin(type: SpinType) {
        BlockInputManager.instance.blockInput(true);
        this.pTouch.stopSystem();
        this.btnSpin.interactable = false;
        let randomItem = Utils.randomRangeInt(0, this.spinPool.length);
        let randomValue = this.spinPool[Utils.randomRangeInt(0, this.spinPool.length)];
        this.spinPool.splice(randomItem, 1);
        let itemAngle = randomValue * (360 / this.NUM_ITEM) * this.clockWise;
        if (this.tweenSpin) {
            this.tweenSpin.stop();
        }
        SoundManager.playEFSound(Sound.SFX_Lucky_Spin_Spin, true);
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

                this.btnSpin.getComponent(cc.Sprite).spriteFrame = this.cooldownFrame;
                this.pTouch.resetSystem();
                let reward = this.items[randomValue].data.chip;
                if (DataManager.instance.SPIN_COUNT < 5) {
                    DataManager.instance.SPIN_COUNT++;
                    RewardView.instance.show(reward);
                    UserInfoView.instance.addBalance(reward);
                    if (DataManager.instance.SPIN_COUNT == 5) {
                        if (this.twDouble) {
                            this.twDouble.stop();
                            this.twDouble = null;
                        }
                        this.twDouble = Utils.scaleInOut(this.nodeDouble, 999, 1, 0.2);
                    }
                    switch (type) {
                        case SpinType.normal:
                            PluginManager.instance.logEvent(AnalyticEvent.lucky_spin_claim_normal, { "reward": reward });
                            break;
                        case SpinType.ads:
                            PluginManager.instance.logEvent(AnalyticEvent.lucky_spin_claim_ads, { "reward": reward });
                            break;
                    }
                } else {
                    RewardView.instance.show(reward * 2);
                    UserInfoView.instance.addBalance(reward * 2);
                    DataManager.instance.SPIN_COUNT = 0;
                    if (this.twDouble) {
                        this.twDouble.stop();
                        this.twDouble = null;
                    }
                    PluginManager.instance.logEvent(AnalyticEvent.lucky_spin_claim_x2, { "base": reward, "reward": reward * 2 });
                }

            })
            .start();
    }

    adsCallback() {
        this.onSpin(SpinType.ads);
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
        this.resetTimerPool();
        this.spinPool.length = 0;
        for (let i = 0; i < Config.LUCKY_SPIN_COLOR.length; i++) {
            for (let j = 0; j < Config.LUCKY_SPIN_Amount[i]; j++) {
                this.spinPool.push(Config.LUCKY_SPIN_COLOR[i]);
            }
        }
        Utils.shuffle(this.spinPool);
    }

    update() {
        if (this.isCoolDown) {
            if (this.coolDownTime > 0) {
                let today = Date.now();
                this.coolDownTime = (this.endTime - today);
                this.lbCooldown.string = "Next spin: " + Utils.timeHHMMSS(this.coolDownTime);
                this.lbCooldown.node.active = true;
            } else {
                this.coolDownTime = 0;
                this.isCoolDown = false;
                this.btnSpin.interactable = true;
                this.btnSpin.getComponent(cc.Sprite).spriteFrame = this.normalFrame;
                this.lbCooldown.node.active = false;
            }
        }
        this.timerPool();
        this.lbSpinProgress.string = DataManager.instance.SPIN_COUNT + "/5";
        this.pbSpinProgress.progress = Utils.normalized(DataManager.instance.SPIN_COUNT, 0, 5);
    }

    resetTimerPool() {
        let now = Date.now();
        let mNow = new Date(now).getHours() * 3600000 + new Date(now).getMinutes() * 60000 + new Date(now).getSeconds() * 1000 + new Date(now).getMilliseconds();
        this.endTimePool = now + Config.LUCKY_SPIN_POOL_RESET_TIME * 24 * 60 * 60 * 1000;
        this.coolDownTimePool = (this.endTimePool - now);
    }

    timerPool() {
        if (this.coolDownTimePool > 0 && this.spinPool.length > 0) {
            let now = Date.now();
            this.coolDownTimePool = (this.endTimePool - now);
        } else {
            this.resetPool();
        }
    }

    show(callback: Function = null) {     
        this.node.setPosition(0,0);
    }

    hide(callback: Function = null) {
        this.node.setPosition(9999,0);
    }
}
