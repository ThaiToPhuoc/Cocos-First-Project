import Utils, { TweenNumberObject } from "../../utils/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HandChip extends cc.Component {

    chip: number = 0;
    tween: cc.Tween = null;
    
    @property(cc.Label)
    lbChip: cc.Label = null;

    setChip(value: number, callback: Function = null) {
        if (this.tween) {
            this.tween.stop();
            this.tween = null;
        }
        let tempChip = this.chip;
        this.chip = value;
        this.tween = Utils.tweenNumber(new TweenNumberObject(tempChip), 0.25, this.chip, (progress) => {
            this.lbChip.string = Utils.convert2UnitMoney(Math.round(progress), 3);
        }, () => {
            if (callback) {
                callback();
            }
        });
    }

    addChip(value: number, callback: Function = null) {
        if (this.tween) {
            this.tween.stop();
            this.tween = null;
        }
        let tempChip = this.chip;
        this.chip += value;
        this.tween = Utils.tweenNumber(new TweenNumberObject(tempChip), 0.25, this.chip, (progress) => {
            this.lbChip.string = Utils.convert2UnitMoney(Math.round(progress), 3);
        }, () => {
            if (callback) {
                callback();
            }
        });
    }

    subChip(value: number, callback: Function = null) {
        if (this.tween) {
            this.tween.stop();
            this.tween = null;
        }
        let tempChip = this.chip;
        this.chip -= value;
        this.tween = Utils.tweenNumber(new TweenNumberObject(tempChip), 0.25, this.chip, (progress) => {
            this.lbChip.string = Utils.convert2UnitMoney(Math.round(progress), 3);
        }, () => {
            if (callback) {
                callback();
            }
        });
    }

    mulChip(value: number, callback: Function = null) {
        if (this.tween) {
            this.tween.stop();
            this.tween = null;
        }
        let tempChip = this.chip;
        this.chip *= value;
        this.tween = Utils.tweenNumber(new TweenNumberObject(tempChip), 0.25, this.chip, (progress) => {
            this.lbChip.string = Utils.convert2UnitMoney(Math.round(progress), 3);
        }, () => {
            if (callback) {
                callback();
            }
        });
    }

    divChip(value: number, callback: Function = null) {
        if (this.tween) {
            this.tween.stop();
            this.tween = null;
        }
        let tempChip = this.chip;
        this.chip /= value;
        this.tween = Utils.tweenNumber(new TweenNumberObject(tempChip), 0.25, this.chip, (progress) => {
            this.lbChip.string = Utils.convert2UnitMoney(Math.round(progress), 3);
        }, () => {
            if (callback) {
                callback();
            }
        });
    }
}

