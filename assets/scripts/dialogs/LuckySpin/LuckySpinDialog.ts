import DataManager from "../../data/DataManager";
import Config from "../../utils/Config";
import Easing from "../../utils/Easing";
import Utils from "../../utils/Utils";
import LuckySpinItem from "../../views/LuckySpin/LuckySpinItem";
import LuckySpinItemData from "../../views/LuckySpin/LuckySpinItemData";
import UserInfoView from "../../views/UserInfo/UserInfoView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LuckySpinDialog extends cc.Component {

    public static instance: LuckySpinDialog = null;

    @property(cc.Node)
    body: cc.Node = null;

    @property(cc.Button)
    btnClose: cc.Button = null;

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

    onLoad() {
        LuckySpinDialog.instance = this;
    }

    start() {
        this.resetTimerPool();
        this.btnClose.node.on("click", () => {
            this.hide();
        }, this);
        this.pTouch.resetSystem();
        this.btnSpin.getComponent(cc.Sprite).spriteFrame = this.normalFrame;
        this.btnSpin.node.on("click", () => {
            if (!this.isCoolDown) {
                this.onSpin();
            } else {
            }
        }, this);
        this.loadData();
    }

    onSpin() {
        this.pTouch.stopSystem();
        this.btnSpin.interactable = false;
        let randomItem = Utils.randomRangeInt(0, this.spinPool.length);
        let randomValue = this.spinPool[Utils.randomRangeInt(0, this.spinPool.length)];
        this.spinPool.splice(randomItem, 1);
        let itemAngle = randomValue * (360 / this.NUM_ITEM) * this.clockWise;
        if (this.tweenSpin) {
            this.tweenSpin.stop();
        }
        this.tweenSpin = cc.tween(this.content)
            .set({ angle: 0 })
            .to(this.spinTime, { angle: (360 * this.spinRound + itemAngle) * this.clockWise }, { easing: Easing.smooth })
            .call(() => {
                this.btnSpin.interactable = true;
                this.startTime = Date.now();
                this.endTime = this.startTime + 60 * 1000 * 10;
                this.coolDownTime = (this.endTime - this.startTime);
                this.isCoolDown = true;

                this.btnSpin.getComponent(cc.Sprite).spriteFrame = this.cooldownFrame;
                this.pTouch.resetSystem();
                UserInfoView.instance.addBalance(this.items[randomValue].data.chip, null, this.items[randomValue].lbChip.node);
            })
            .start();
    }

    adsCallback() {
        this.onSpin();
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

    show(callback: Function = null) {
        Utils.fadeIn(this.body, () => {
            if (callback) {
                callback();
            }
        })
    }

    hide(callback: Function = null) {
        Utils.fadeOut(this.body, () => {
            if (callback) {
                callback();
            }
        })
    }

    update() {
        if (this.isCoolDown) {
            if (this.coolDownTime > 0) {
                let today = Date.now();
                this.coolDownTime = (this.endTime - today);
            } else {
                this.coolDownTime = 0;
                this.isCoolDown = false;
                this.btnSpin.interactable = true;
                this.btnSpin.getComponent(cc.Sprite).spriteFrame = this.normalFrame;
            }
        }
        this.timerPool();
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
}
