import Data from "./Data";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DataManager extends cc.Component {

    public static instance: DataManager = null;

    //Launcher
    VERSION: string = "Version 1.0.0";
    LOADING_TOTAL_COUNT: number = 1000;

    DATA_VERSION: number = 0;

    //User info
    DISPLAY_NAME: string = "";
    BALANCE: number = 10000;
    LEVEL: number = 1;
    EXP: number = 0;
    EXP_MIN: number = 0;
    EXP_MAX: number = 50;
    RANK_POINT: number = 0;

    //setting
    VOLUME_MUSIC: number = 0;
    VOLUME_EFFECT: number = 0.35;

    FPS: boolean = false;

    //table
    TABLE_NAME: string = '';
    MIN_BET: number = 0;
    MAX_BET: number = 0;
    MIN_BALANCE: number = 0;
    EXP_WIN: number = 0;
    EXP_LOSE_DRAW: number = 0;

    //auto bet
    AUTO_BET: boolean = false;

    //achievement
    HAND_PLAY: number = 0;
    HAND_WIN: number = 0;
    BET_TIMES: number = 0;
    HIT_TIMES: number = 0;
    BLACKJACK_TIMES: number = 0;
    FIVE_CARD_WIN_TIMES: number = 0;
    SPLIT_TIMES: number = 0;
    LOSE_STREAK: number = 0;
    WIN_STREAK: number = 0;
    TOTAL_CHIP_WIN: number = 0;
    TOTAL_CHIP_BET: number = 0;
    INSURANCE_WIN_TIMES: number = 0;

    //daily quest
    Q_MAIN: number = 0;
    
    Q_PLAYED_TIMES: number = 0;
    Q_WIN_TIMES: number = 0;
    Q_HIT_TIMES: number = 0;
    Q_WIN_STREAKS: number = 0;
    Q_SPLIT_TIMES: number = 0;

    Q_MAIN_CLAIM_TIME: number = 0;

    Q_CURRENT: string = "";

    //daily reward
    DAILLY_REWARD_DAY: number = 1;
    DAILLY_REWARD_SESSION_SHOW: boolean = false;
    DAILLY_REWARD_TODAY_CLAIM: boolean = false;
    DAILLY_REWARD_CLAIM_TIME: number = 0;
    //stats
    WIN_RATE: number = 0;
    HIGHEST_WIN_HIT: number = 0;

    //review
    RATE_AND_REVIEW_SHOW: boolean = false;

    //Shop
    RECOMMEND_OFFER_BUY: boolean = false;
    DAILY_OFFER_BUY: boolean = false;
    DAILY_OFFER_BUY_TIME: number = 0;

    //lucky spin
    SPIN_COUNT: number = 0;

    onLoad() {
        DataManager.instance = this;
        cc.game.addPersistRootNode(this.node);
        this.loadDataLocal();
        this.saveDataLocal();
        //this.schedule(this.saveDataLocal, 1);

        
    }
    
    getVersion(): number {
        if (cc.sys.localStorage.getItem(Data.DATA_VERSION)) {
            this.DATA_VERSION = Number(cc.sys.localStorage.getItem(Data.DATA_VERSION));
        }
        return this.DATA_VERSION;
    }

    loadDataLocal() {
        //user info
        if (cc.sys.localStorage.getItem(Data.DISPLAY_NAME)) {
            this.DISPLAY_NAME = String(cc.sys.localStorage.getItem(Data.DISPLAY_NAME));
        }

        if (cc.sys.localStorage.getItem(Data.BALANCE)) {
            this.BALANCE = Number(cc.sys.localStorage.getItem(Data.BALANCE));
        }

        if (cc.sys.localStorage.getItem(Data.LEVEL)) {
            this.LEVEL = Number(cc.sys.localStorage.getItem(Data.LEVEL));
        }

        if (cc.sys.localStorage.getItem(Data.EXP)) {
            this.EXP = Number(cc.sys.localStorage.getItem(Data.EXP));
        }

        if (cc.sys.localStorage.getItem(Data.EXP_MIN)) {
            this.EXP_MIN = Number(cc.sys.localStorage.getItem(Data.EXP_MIN));
        }

        if (cc.sys.localStorage.getItem(Data.EXP_MAX)) {
            this.EXP_MAX = Number(cc.sys.localStorage.getItem(Data.EXP_MAX));
        }

        if (cc.sys.localStorage.getItem(Data.RANK_POINT)) {
            this.RANK_POINT = Number(cc.sys.localStorage.getItem(Data.RANK_POINT));
        }

        //setting
        if (cc.sys.localStorage.getItem(Data.VOLUME_MUSIC)) {
            this.VOLUME_MUSIC = Number(cc.sys.localStorage.getItem(Data.VOLUME_MUSIC));
        }

        if (cc.sys.localStorage.getItem(Data.VOLUME_EFFECT)) {
            this.VOLUME_EFFECT = Number(cc.sys.localStorage.getItem(Data.VOLUME_EFFECT));
        }


        //achievement
        if (cc.sys.localStorage.getItem(Data.HAND_PLAY)) {
            this.HAND_PLAY = Number(cc.sys.localStorage.getItem(Data.HAND_PLAY));
        }
        if (cc.sys.localStorage.getItem(Data.HAND_WIN)) {
            this.HAND_WIN = Number(cc.sys.localStorage.getItem(Data.HAND_WIN));
        }
        if (cc.sys.localStorage.getItem(Data.BET_TIMES)) {
            this.BET_TIMES = Number(cc.sys.localStorage.getItem(Data.BET_TIMES));
        }
        if (cc.sys.localStorage.getItem(Data.HIT_TIMES)) {
            this.HIT_TIMES = Number(cc.sys.localStorage.getItem(Data.HIT_TIMES));
        }
        if (cc.sys.localStorage.getItem(Data.BLACKJACK_TIMES)) {
            this.BLACKJACK_TIMES = Number(cc.sys.localStorage.getItem(Data.BLACKJACK_TIMES));
        }
        if (cc.sys.localStorage.getItem(Data.FIVE_CARD_WIN_TIMES)) {
            this.FIVE_CARD_WIN_TIMES = Number(cc.sys.localStorage.getItem(Data.FIVE_CARD_WIN_TIMES));
        }
        if (cc.sys.localStorage.getItem(Data.SPLIT_TIMES)) {
            this.SPLIT_TIMES = Number(cc.sys.localStorage.getItem(Data.SPLIT_TIMES));
        }
        if (cc.sys.localStorage.getItem(Data.LOSE_STREAK)) {
            this.LOSE_STREAK = Number(cc.sys.localStorage.getItem(Data.LOSE_STREAK));
        }
        if (cc.sys.localStorage.getItem(Data.WIN_STREAK)) {
            this.WIN_STREAK = Number(cc.sys.localStorage.getItem(Data.WIN_STREAK));
        }
        if (cc.sys.localStorage.getItem(Data.TOTAL_CHIP_WIN)) {
            this.TOTAL_CHIP_WIN = Number(cc.sys.localStorage.getItem(Data.TOTAL_CHIP_WIN));
        }
        if (cc.sys.localStorage.getItem(Data.TOTAL_CHIP_BET)) {
            this.TOTAL_CHIP_BET = Number(cc.sys.localStorage.getItem(Data.TOTAL_CHIP_BET));
        }
        if (cc.sys.localStorage.getItem(Data.INSURANCE_WIN_TIMES)) {
            this.INSURANCE_WIN_TIMES = Number(cc.sys.localStorage.getItem(Data.INSURANCE_WIN_TIMES));
        }
        //daily quest
        if (cc.sys.localStorage.getItem(Data.Q_MAIN)) {
            this.Q_MAIN = Number(cc.sys.localStorage.getItem(Data.Q_MAIN));
        }
        if (cc.sys.localStorage.getItem(Data.Q_PLAYED_TIMES)) {
            this.Q_PLAYED_TIMES = Number(cc.sys.localStorage.getItem(Data.Q_PLAYED_TIMES));
        }
        if (cc.sys.localStorage.getItem(Data.Q_WIN_TIMES)) {
            this.Q_WIN_TIMES = Number(cc.sys.localStorage.getItem(Data.Q_WIN_TIMES));
        }
        if (cc.sys.localStorage.getItem(Data.Q_HIT_TIMES)) {
            this.Q_HIT_TIMES = Number(cc.sys.localStorage.getItem(Data.Q_HIT_TIMES));
        }
        if (cc.sys.localStorage.getItem(Data.Q_WIN_STREAKS)) {
            this.Q_WIN_STREAKS = Number(cc.sys.localStorage.getItem(Data.Q_WIN_STREAKS));
        }
        if (cc.sys.localStorage.getItem(Data.Q_SPLIT_TIMES)) {
            this.Q_SPLIT_TIMES = Number(cc.sys.localStorage.getItem(Data.Q_SPLIT_TIMES));
        }
        if (cc.sys.localStorage.getItem(Data.Q_MAIN_CLAIM_TIME)) {
            this.Q_MAIN_CLAIM_TIME = Number(cc.sys.localStorage.getItem(Data.Q_MAIN_CLAIM_TIME));
        }
        //daily reward
        if (cc.sys.localStorage.getItem(Data.DAILLY_REWARD_DAY)) {
            this.DAILLY_REWARD_DAY = Number(cc.sys.localStorage.getItem(Data.DAILLY_REWARD_DAY));
        }
        if (cc.sys.localStorage.getItem(Data.DAILLY_REWARD_TODAY_CLAIM)) {
            if (String(cc.sys.localStorage.getItem(Data.DAILLY_REWARD_TODAY_CLAIM)) == 'true') {
                this.DAILLY_REWARD_TODAY_CLAIM = true;
            } else {
                this.DAILLY_REWARD_TODAY_CLAIM = false;
            }
        }
        if (cc.sys.localStorage.getItem(Data.DAILLY_REWARD_CLAIM_TIME)) {
            this.DAILLY_REWARD_CLAIM_TIME = Number(cc.sys.localStorage.getItem(Data.DAILLY_REWARD_CLAIM_TIME));
        }
        //stats
        if (cc.sys.localStorage.getItem(Data.WIN_RATE)) {
            this.WIN_RATE = Number(cc.sys.localStorage.getItem(Data.WIN_RATE));
        }
        if (cc.sys.localStorage.getItem(Data.HIGHEST_WIN_HIT)) {
            this.HIGHEST_WIN_HIT = Number(cc.sys.localStorage.getItem(Data.HIGHEST_WIN_HIT));
        }
        //shop
        if (cc.sys.localStorage.getItem(Data.RECOMMEND_OFFER_BUY)) {
            if (String(cc.sys.localStorage.getItem(Data.RECOMMEND_OFFER_BUY)) == 'true') {
                this.RECOMMEND_OFFER_BUY = true;
            } else {
                this.RECOMMEND_OFFER_BUY = false;
            }
        }
        if (cc.sys.localStorage.getItem(Data.DAILY_OFFER_BUY)) {
            if (String(cc.sys.localStorage.getItem(Data.DAILY_OFFER_BUY)) == 'true') {
                this.DAILY_OFFER_BUY = true;
            } else {
                this.DAILY_OFFER_BUY = false;
            }
        }
        if (cc.sys.localStorage.getItem(Data.DAILY_OFFER_BUY_TIME)) {
            this.DAILY_OFFER_BUY_TIME = Number(cc.sys.localStorage.getItem(Data.DAILY_OFFER_BUY_TIME));
        }
        //lucky spin
        if (cc.sys.localStorage.getItem(Data.SPIN_COUNT)) {
            this.SPIN_COUNT = Number(cc.sys.localStorage.getItem(Data.SPIN_COUNT));
        }

        if (cc.sys.localStorage.getItem(Data.FPS)) {
            if (String(cc.sys.localStorage.getItem(Data.FPS)) == 'true') {
                this.FPS = true;
            } else {
                this.FPS = false;
            }
        }
    }

    saveDataLocal() {
        //user info
        cc.sys.localStorage.setItem(Data.DISPLAY_NAME, this.DISPLAY_NAME);
        cc.sys.localStorage.setItem(Data.BALANCE, this.BALANCE);
        cc.sys.localStorage.setItem(Data.LEVEL, this.LEVEL);
        cc.sys.localStorage.setItem(Data.EXP, this.EXP);
        cc.sys.localStorage.setItem(Data.EXP_MIN, this.EXP_MIN);
        cc.sys.localStorage.setItem(Data.EXP_MAX, this.EXP_MAX);
        cc.sys.localStorage.setItem(Data.RANK_POINT, this.RANK_POINT);
        //setting
        cc.sys.localStorage.setItem(Data.VOLUME_MUSIC, this.VOLUME_MUSIC);
        cc.sys.localStorage.setItem(Data.VOLUME_EFFECT, this.VOLUME_EFFECT);
        cc.sys.localStorage.setItem(Data.FPS, this.FPS);
        //achievement
        cc.sys.localStorage.setItem(Data.HAND_PLAY, this.HAND_PLAY);
        cc.sys.localStorage.setItem(Data.HAND_WIN, this.HAND_WIN);
        cc.sys.localStorage.setItem(Data.BET_TIMES, this.BET_TIMES);
        cc.sys.localStorage.setItem(Data.HIT_TIMES, this.HIT_TIMES);
        cc.sys.localStorage.setItem(Data.BLACKJACK_TIMES, this.BLACKJACK_TIMES);
        cc.sys.localStorage.setItem(Data.FIVE_CARD_WIN_TIMES, this.FIVE_CARD_WIN_TIMES);
        cc.sys.localStorage.setItem(Data.SPLIT_TIMES, this.SPLIT_TIMES);
        cc.sys.localStorage.setItem(Data.LOSE_STREAK, this.LOSE_STREAK);
        cc.sys.localStorage.setItem(Data.WIN_STREAK, this.WIN_STREAK);
        cc.sys.localStorage.setItem(Data.TOTAL_CHIP_WIN, this.TOTAL_CHIP_WIN);
        cc.sys.localStorage.setItem(Data.TOTAL_CHIP_BET, this.TOTAL_CHIP_BET);
        cc.sys.localStorage.setItem(Data.INSURANCE_WIN_TIMES, this.INSURANCE_WIN_TIMES);
        //quest
        cc.sys.localStorage.setItem(Data.Q_MAIN, this.Q_MAIN);
        cc.sys.localStorage.setItem(Data.Q_PLAYED_TIMES, this.Q_PLAYED_TIMES);
        cc.sys.localStorage.setItem(Data.Q_WIN_TIMES, this.Q_WIN_TIMES);
        cc.sys.localStorage.setItem(Data.Q_HIT_TIMES, this.Q_HIT_TIMES);
        cc.sys.localStorage.setItem(Data.Q_WIN_STREAKS, this.Q_WIN_STREAKS);
        cc.sys.localStorage.setItem(Data.Q_SPLIT_TIMES, this.Q_SPLIT_TIMES);
        cc.sys.localStorage.setItem(Data.Q_MAIN_CLAIM_TIME, this.Q_MAIN_CLAIM_TIME);
        //daily reward
        cc.sys.localStorage.setItem(Data.DAILLY_REWARD_DAY, this.DAILLY_REWARD_DAY);
        cc.sys.localStorage.setItem(Data.DAILLY_REWARD_TODAY_CLAIM, this.DAILLY_REWARD_TODAY_CLAIM);
        cc.sys.localStorage.setItem(Data.DAILLY_REWARD_CLAIM_TIME, this.DAILLY_REWARD_CLAIM_TIME);
        //stats
        cc.sys.localStorage.setItem(Data.WIN_RATE, this.WIN_RATE);
        cc.sys.localStorage.setItem(Data.HIGHEST_WIN_HIT, this.HIGHEST_WIN_HIT);
        //shop
        cc.sys.localStorage.setItem(Data.RECOMMEND_OFFER_BUY, this.RECOMMEND_OFFER_BUY);
        cc.sys.localStorage.setItem(Data.DAILY_OFFER_BUY, this.DAILY_OFFER_BUY);
        cc.sys.localStorage.setItem(Data.DAILY_OFFER_BUY_TIME, this.DAILY_OFFER_BUY_TIME);
        //lucky spin
        cc.sys.localStorage.setItem(Data.SPIN_COUNT, this.SPIN_COUNT);
    }

    start() {
        /* this.schedule(()=>{
            console.log("level: " + this.LEVEL);
            console.log("exp: " + this.EXP);
            console.log("exp prev: " + this.EXP_MIN);
            console.log("exp next: " + this.EXP_MAX);
        }, 10); */
    }

    update(dt) {
        
    }
}
