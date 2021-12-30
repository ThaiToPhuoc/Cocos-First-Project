import BlockInputManager from "./components/blockInput/BlockInputManager";
import Card from "./components/card/Card";
import Chip from "./components/chip/Chip";
import Deck from "./components/deck/Deck";
import Hand from "./components/hand/Hand";
import HandState from "./components/hand/HandState";
import DataManager from "./data/DataManager";
import PoolManager from "./components/pool/PoolManager";
import { Sound } from "./components/sound/Sound";
import SoundManager from "./components/sound/SoundManager";
import Config from "./utils/Config";
import Utils from "./utils/Utils";
import AnnounceView, { StatusType } from "./views/Announce/AnnounceView";
import UserInfoView from "./views/UserInfo/UserInfoView";
import RewardView from "./views/Reward/RewardView";
import PluginManager from "./plugin/PluginManager";
import NotEnoughBalanceDialog from "./dialogs/NotEnoughBalance/NotEnoughBalanceDialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    public static instance: Game = null;

    @property([Hand])
    allHands: Hand[] = [];

    @property(cc.Node)
    grpChips: cc.Node = null;
    chips: Chip[] = [];

    @property(cc.Button)
    btnClear: cc.Button = null;
    @property(cc.Button)
    btnDeal: cc.Button = null;

    //game action
    @property(cc.Button)
    btnStand: cc.Button = null;
    @property(cc.Button)
    btnDouble: cc.Button = null;
    @property(cc.Button)
    btnHit: cc.Button = null;
    @property(cc.Button)
    btnSplit: cc.Button = null;

    //insurance action
    @property(cc.Button)
    btnInsuranceYes: cc.Button = null;
    @property(cc.Button)
    btnInsuranceNo: cc.Button = null;

    @property(cc.Label)
    lbBetMessage: cc.Label = null;

    @property(cc.SpriteAtlas)
    atlasFront: cc.SpriteAtlas = null;

    @property(cc.SpriteFrame)
    sprBack: cc.SpriteFrame = null;

    betMessageTween: cc.Tween = null;

    BET_AMOUNT: number = 0;
    EXP: number = 0;

    RESULT: string = "";
    STREAK: number = 0;

    public get hands(): Hand[] {
        let temp = [];
        for (let i = 0; i < this.allHands.length; i++) {
            let hand = this.allHands[i];
            if (hand.node.active) {
                temp.push(hand);
            }
        }
        return temp;
    }

    public get dealerHand(): Hand {
        return this.allHands[2];
    }

    public get playerHands(): Hand[] {
        let temp = [];
        for (let i = 0; i < this.hands.length - 1; i++) {
            let t = this.hands[i];
            if (t.node.active) {
                temp.push(t);
            }
        }
        return temp;
    }

    public get currentHand(): Hand {
        for (let i = 0; i < this.playerHands.length; i++) {
            let hand = this.hands[i];
            if (!hand.isDone) return hand;
        }
        return null;
    }

    public get firstHand(): Hand {
        return this.allHands[0];
    }

    public get secondtHand(): Hand {
        return this.allHands[1];
    }

    public get currentCheckHand(): Hand {
        for (let i = 0; i < this.playerHands.length; i++) {
            let hand = this.hands[i];
            if (!hand.isCheck) return hand;
        }
        return null;
    }

    public get checkAbleHands(): Hand[] {
        let hands = [];
        for (let i = 0; i < this.playerHands.length; i++) {
            let hand = this.playerHands[i];
            if (hand.handPoint <= 21 && !hand.isCheck) {
                hands.push(hand);
            }
        }
        return hands;
    }


    public get CURRENT_BET(): number {
        return this.firstHand.chipBet.chip;
    }

    onLoad() {
        Game.instance = this;

        this.setupBetChips();

        this.btnClear.node.on('click', () => {
            this.firstHand.chipBet.setChip(0);
            this.hideBetAction(true, () => {
                this.showBetMessage(false, "PLACE YOUR BET");
            });
        }, this);

        this.btnDeal.node.on('click', () => {
            DataManager.instance.BET_TIMES++;
            this.BET_AMOUNT = this.firstHand.chipBet.chip;
            this.hideBetChip(true);
            this.hideBetAction(true);
            UserInfoView.instance.subBalance(this.BET_AMOUNT, () => {
                DataManager.instance.TOTAL_CHIP_BET += this.BET_AMOUNT;
                this.dealCards();
            });
        }, this);

        //action button
        this.btnDouble.node.on('click', () => {
            this.onDouble();
        }, this);
        this.btnHit.node.on('click', () => {
            this.onHit();
        }, this);
        this.btnSplit.node.on('click', () => {
            this.onSplit();
        }, this);
        this.btnStand.node.on('click', () => {
            this.onStand();
        }, this);

        //insurance button
        this.btnInsuranceNo.node.on('click', () => {
            this.insuranceNo();
        }, this);

        this.btnInsuranceYes.node.on('click', () => {
            this.insuranceYes();
        }, this);

        this.betMessageTween = Utils.flashingOpacity(this.lbBetMessage.node, 9999, 1.5);

    }

    setupBetChips() {
        this.chips = this.grpChips.getComponentsInChildren(Chip);
        this.chips[0].value = DataManager.instance.MIN_BET;
        this.chips[1].value = DataManager.instance.MAX_BET * 0.25;
        this.chips[2].value = DataManager.instance.MAX_BET * 0.5;
        this.chips[3].value = DataManager.instance.MAX_BET * 0.75;
        this.chips[4].value = DataManager.instance.MAX_BET;
        this.chips.forEach((chip, index) => {
            chip.lbValue.string = Utils.convert2UnitMoney(chip.value, 3);
            cc.resources.load(`atlas/chip/${index}`, cc.SpriteFrame, function (err: Error, spriteFrame: cc.SpriteFrame) {
                chip.sprBackground.spriteFrame = spriteFrame;
            });
            chip.node.on('click', () => {
                //check balance
                if ((this.CURRENT_BET + chip.value) > DataManager.instance.BALANCE) {
                    SoundManager.playEFSound(Sound.SFX_BET_MAX);
                    this.showBetMessage(true, `NOT ENOUGH BALANCE`);
                    return;
                };
                //check max bet
                if ((this.CURRENT_BET + chip.value) > DataManager.instance.MAX_BET) {
                    SoundManager.playEFSound(Sound.SFX_BET_MAX);
                    this.showBetMessage(true, `Max bet is ${Utils.convert2UnitMoney(DataManager.instance.MAX_BET, 3)}`);
                    return;
                };
                SoundManager.playEFSound(Sound.SFX_BET_CHIP);
                this.firstHand.chipBet.addChip(chip.value);
                this.showBetAction(true);
                this.hideBetMessage(false);
            }, this);
        });
    }

    start() {
        this.startGame(false);
    }

    startGame(nextGame: boolean) {
        this.EXP = 0;
        this.allHands.forEach(hand => hand.resetHand());
        this.dealerHand.node.active = true;
        this.firstHand.node.active = true;
        this.secondtHand.node.active = false;
        this.firstHand.node.setPosition(0, this.firstHand.node.position.y, 0);
        this.secondtHand.node.setPosition(0, this.secondtHand.node.position.y, 0);
        this.hideInsuranceAction(false);
        if (nextGame) {
            if (DataManager.instance.AUTO_BET) {
                this.hideBetChip(true);
                UserInfoView.instance.subBalance(this.BET_AMOUNT, () => {
                    DataManager.instance.TOTAL_CHIP_BET += this.BET_AMOUNT;
                    this.dealCards();
                });
                this.firstHand.chipBet.setChip(this.BET_AMOUNT);
            } else {
                this.showBetChip(true);
                this.showBetMessage(true, "PLACE YOUR BET");
                this.firstHand.chipBet.setChip(0);
                this.BET_AMOUNT = 0;
            }
        } else {
            this.hideAction(false);
            this.btnClear.node.active = false;
            this.btnDeal.node.active = false;
            if (DataManager.instance.AUTO_BET) {
                this.hideBetChip(false);
                UserInfoView.instance.subBalance(this.BET_AMOUNT, () => {
                    DataManager.instance.TOTAL_CHIP_BET += this.BET_AMOUNT;
                    this.dealCards();
                });
                this.firstHand.chipBet.setChip(this.BET_AMOUNT);
            } else {
                this.showBetChip(false);
                this.showBetMessage(false, "PLACE YOUR BET");
                this.firstHand.chipBet.setChip(0);
                this.BET_AMOUNT = 0;
            }
        }
    }

    questUpdate(key0: string, key1: string, value: number) {
        if(key0 == key1){
            switch (key0) {
                case "Q_PLAYED_TIMES":
                    DataManager.instance.Q_PLAYED_TIMES += value;
                    break;
                case "Q_WIN_TIMES":
                    DataManager.instance.Q_WIN_TIMES += value;
                    break;
                case "Q_HIT_TIMES":
                    DataManager.instance.Q_HIT_TIMES += value;
                    break;
                case "Q_WIN_STREAKS":
                    DataManager.instance.Q_WIN_STREAKS = value;
                    break;
                case "Q_SPLIT_TIMES":
                    DataManager.instance.Q_SPLIT_TIMES += value;
                    break;
            }
        }     
    }

    nextGame() {
        DataManager.instance.HAND_PLAY += this.playerHands.length;
        this.questUpdate(DataManager.instance.Q_CURRENT, "Q_PLAYED_TIMES", this.playerHands.length);
        DataManager.instance.RANK_POINT = DataManager.instance.TOTAL_CHIP_WIN - DataManager.instance.TOTAL_CHIP_BET;
        if (DataManager.instance.RANK_POINT < 0) DataManager.instance.RANK_POINT = 0;
        if (DataManager.instance.HAND_PLAY > 0) {
            DataManager.instance.WIN_RATE = (DataManager.instance.HAND_WIN / DataManager.instance.HAND_PLAY) * 100;
        } else {
            DataManager.instance.WIN_RATE = 0;
        }
        PluginManager.instance.sendScores();
        BlockInputManager.instance.wait(1, () => {
            UserInfoView.instance.addEXP(this.EXP, () => {
                if (DataManager.instance.BALANCE < DataManager.instance.MIN_BALANCE) {
                    NotEnoughBalanceDialog.instance.show(DataManager.instance.MIN_BALANCE)
                    return;
                };
                this.startGame(false);
            });
        });
    }

    showBetMessage(effect: boolean, message: string, callback: Function = null) {
        this.lbBetMessage.string = message;
        if (effect) {
            Utils.fadeIn(this.lbBetMessage.node, () => {
                if (callback) callback();
            });
        } else {
            this.lbBetMessage.node.active = true;
            if (callback) callback();
        }
    }

    hideBetMessage(effect: boolean, callback: Function = null) {
        if (effect) {
            Utils.fadeOut(this.lbBetMessage.node, () => {
                if (callback) callback();
            });
        } else {
            this.lbBetMessage.node.active = false;
            if (callback) callback();
        }
    }

    showBetChip(effect: boolean, callback: Function = null) {
        this.chips.forEach(chip => {
            if (effect) {
                Utils.fadeIn(chip.node, () => {
                    if (callback) callback();
                });
            } else {
                chip.node.active = true;
                if (callback) callback();
            }
        });
    }

    hideBetChip(effect: boolean, callback: Function = null) {
        this.chips.forEach(chip => {
            if (effect) {
                Utils.fadeOut(chip.node, () => {
                    if (callback) callback();
                });
            } else {
                chip.node.active = false;
                if (callback) callback();
            }
        });
        this.hideBetMessage(effect);
    }

    hideAction(effect: boolean = true, callback: Function = null) {
        if (effect) {
            Utils.fadeOut(this.btnDouble.node);
            Utils.fadeOut(this.btnHit.node);
            Utils.fadeOut(this.btnSplit.node);
            Utils.fadeOut(this.btnStand.node, () => {
                if (callback) callback();
            });
        } else {
            this.btnDouble.node.active = false;
            this.btnHit.node.active = false;
            this.btnSplit.node.active = false;
            this.btnStand.node.active = false;
            if (callback) callback();
        }
    }

    showAction(effect: boolean = true, callback: Function = null) {
        if (effect) {
            //btnSplit check
            if (DataManager.instance.BALANCE >= this.BET_AMOUNT) {
                if (this.playerHands.length < 2 && this.currentHand.cards.length == 2 && this.currentHand.cards[0].data.point == this.currentHand.cards[1].data.point) {
                    Utils.fadeIn(this.btnSplit.node);
                } else {
                    this.btnSplit.node.active = false;
                }
            } else {
                this.btnSplit.node.active = false;
            }
            //btnDouble check
            if (DataManager.instance.BALANCE >= this.BET_AMOUNT) {
                if (this.currentHand.cards.length != 2) {
                    this.btnDouble.node.active = false;
                } else {
                    Utils.fadeIn(this.btnDouble.node);
                }
            } else {
                this.btnDouble.node.active = false;
            }
            //
            Utils.fadeIn(this.btnHit.node);
            Utils.fadeIn(this.btnStand.node, () => {
                if (callback) callback();
            });
        } else {
            //btnSplit check
            if (DataManager.instance.BALANCE >= this.BET_AMOUNT) {
                if (this.playerHands.length < 2 && this.currentHand.cards.length == 2 && this.currentHand.cards[0].data.point == this.currentHand.cards[1].data.point) {
                    this.btnSplit.node.active = true;
                } else {
                    this.btnSplit.node.active = false;
                }
            } else {
                this.btnSplit.node.active = false;
            }
            //btnDouble check
            if (DataManager.instance.BALANCE >= this.BET_AMOUNT) {
                if (this.currentHand.cards.length != 2) {
                    this.btnDouble.node.active = false;
                } else {
                    this.btnDouble.node.active = true;
                }
            } else {
                this.btnDouble.node.active = false;
            }
            //
            this.btnHit.node.active = true;
            this.btnStand.node.active = true;
            if (callback) callback();
        }
    }

    showBetAction(effect: boolean, callback: Function = null) {
        if (this.btnClear.node.active && this.btnDeal.node.active) return;
        if (effect) {
            Utils.fadeIn(this.btnClear.node);
            Utils.fadeIn(this.btnDeal.node, () => {
                if (callback) callback();
            });
        } else {
            this.btnClear.node.active = true;
            this.btnDeal.node.active = true;
            if (callback) callback();
        }

    }

    hideBetAction(effect: boolean, callback: Function = null) {
        if (effect) {
            Utils.fadeOut(this.btnClear.node);
            Utils.fadeOut(this.btnDeal.node, () => {
                if (callback) callback();
            });
        } else {
            this.btnClear.node.active = false;
            this.btnDeal.node.active = false;
            if (callback) callback();
        }
    }

    showInsuranceAction(effect: boolean, callback: Function = null) {
        if (effect) {
            Utils.fadeIn(this.btnInsuranceNo.node);
            Utils.fadeIn(this.btnInsuranceYes.node, () => {
                if (callback) callback();
            });
        } else {
            this.btnInsuranceNo.node.active = true;
            this.btnInsuranceYes.node.active = true;
            if (callback) callback();
        }

    }

    hideInsuranceAction(effect: boolean, callback: Function = null) {
        if (effect) {
            Utils.fadeOut(this.btnInsuranceNo.node);
            Utils.fadeOut(this.btnInsuranceYes.node, () => {
                if (callback) callback();
            });
        } else {
            this.btnInsuranceNo.node.active = false;
            this.btnInsuranceYes.node.active = false;
            if (callback) callback();
        }
    }

    drawCard(hand: Hand, callback: Function = null) {
        SoundManager.playEFSound(Sound.SFX_CARD_DEAL);
        let card = PoolManager.getPool("Card").getComponent(Card);
        let cardData = Deck.instance.card;
        cardData.isBack = true;
        card.data = cardData;
        card.updateFrame();
        card.node.parent = hand.grpCards.node;

        card.node.setScale(0);
        card.node.angle = -45;

        Utils.scaleTo(card.node, 1, Config.DRAW_CARD_TIME);
        Utils.rotateTo(card.node, -360, Config.DRAW_CARD_TIME);

        let start = Deck.instance.node;
        let end = hand.cards.length == 0 ? hand.grpCards.node : hand.cards[hand.cards.length - 1].node;
        let call = () => {
            hand.cards.push(card.getComponent(Card));
            Utils.autoAlignHorizontal(hand.cards.map(p => p.node), () => {
                if (callback) callback(hand, card);
            }, Config.CARD_SLIDE_TIME, Config.CARD_SPACE);
        };
        let offset = cc.v2(Config.DRAW_CARD_SPACE, 0);
        Utils.moveTo(card.node, start, end, Config.DRAW_CARD_TIME, call, offset);
    }

    dealCards() {
        BlockInputManager.instance.blockInput(true);
        let handIndex = 0;
        let dealCardTurn = 0;
        let deal = () => {
            if (handIndex == this.hands.length) {
                handIndex = 0;
            }
            this.drawCard(this.hands[handIndex], (hand: Hand, card: Card) => {
                dealCardTurn++;
                handIndex++;
                if (dealCardTurn < this.hands.length * 2) {
                    card.flip(() => {
                        deal();
                    });
                } else {
                    this.hands.forEach((hand, index) => {
                        hand.setHandPoint();
                        if (index < this.hands.length - 1) {
                            this.checkInsure();
                        }
                    });
                    BlockInputManager.instance.blockInput(false);
                }
            });
        }
        deal();
    }

    checkInsure() {
        if (this.dealerHand.cards[0].data.rank == 12) {
            if (DataManager.instance.BALANCE >= this.BET_AMOUNT / 2) {
                this.showInsuranceAction(true);
            } else {
                this.checkBlackjack();
            }
        } else {
            this.checkBlackjack();
        }
    }

    insuranceYes() {
        this.hideInsuranceAction(true, () => {
            this.currentHand.chipInsure.node.active = true;
            this.currentHand.chipInsure.setChip(this.BET_AMOUNT / 2);
            UserInfoView.instance.subBalance(this.BET_AMOUNT / 2, () => {
                DataManager.instance.TOTAL_CHIP_BET += this.BET_AMOUNT / 2;
                this.doInsurance(() => {
                    this.checkBlackjack();
                });
            });
        });
    }

    insuranceNo() {
        this.hideInsuranceAction(true, () => {
            this.checkBlackjack();
        });
    }

    doInsurance(callback: Function = null) {
        this.dealerHand.setHandPoint();
        let insuranceBetAmount = this.BET_AMOUNT / 2;
        if (this.dealerHand.handPoint == 21) {
            AnnounceView.instance.show(StatusType.InsuranceWin, () => {
                AnnounceView.instance.hide(() => {
                    this.firstHand.chipInsure.node.active = false;
                    let reward = insuranceBetAmount * 2;
                    RewardView.instance.show(reward, null, () => {
                        if (callback) {
                            callback();
                        }
                    });
                    UserInfoView.instance.addBalance(reward, () => {
                        DataManager.instance.TOTAL_CHIP_WIN += reward;
                        DataManager.instance.INSURANCE_WIN_TIMES++;
                    });
                }, Config.NEXT_HAND_WAIT_TIME);
            })
        } else {
            AnnounceView.instance.show(StatusType.InsuranceLose, () => {
                AnnounceView.instance.hide(() => {
                    this.firstHand.chipInsure.node.active = false;
                    if (callback) callback();
                }, Config.NEXT_HAND_WAIT_TIME);
            })
        }
    }
    countStreak(result: string) {
        switch (result) {
            case Result.WIN:
                if (this.RESULT == "" || this.RESULT != Result.WIN) {
                    this.STREAK = 0;
                }
                this.STREAK++;
                if (this.STREAK > DataManager.instance.Q_WIN_STREAKS) {
                    this.questUpdate(DataManager.instance.Q_CURRENT, "Q_WIN_STREAKS", this.STREAK);
                }
                if (this.STREAK > DataManager.instance.WIN_STREAK) {
                    DataManager.instance.WIN_STREAK = this.STREAK;
                }
                break;
            case Result.LOSE:
                if (this.RESULT == "" || this.RESULT != Result.LOSE) {
                    this.STREAK = 0;
                }
                this.STREAK++;
                if (this.STREAK > DataManager.instance.LOSE_STREAK) {
                    DataManager.instance.LOSE_STREAK = this.STREAK;
                }
                break;
        }
    }
    checkBlackjack(callback: Function = null) {
        if (this.currentHand.handPoint == 21) {
            this.hideAction();
            this.dealerHand.cards[1].flip(() => {
                this.dealerHand.setHandPoint();
                let p = () => {
                    if (this.currentHand.handPoint == 21 && this.dealerHand.handPoint != 21) {
                        AnnounceView.instance.show(StatusType.Blackjack, () => {
                            this.EXP += DataManager.instance.EXP_WIN;
                            AnnounceView.instance.hide(() => {
                                let reward = this.BET_AMOUNT * 2.5;
                                if (DataManager.instance.AUTO_BET) {
                                    BlockInputManager.instance.blockInput(true);
                                    RewardView.instance.show(reward, () => {
                                        RewardView.instance.hide(() => {
                                            BlockInputManager.instance.blockInput(false);
                                            if (callback) {
                                                callback();
                                            }
                                        }, Config.NEXT_HAND_WAIT_TIME);
                                    });
                                } else {
                                    RewardView.instance.show(reward, null, () => {
                                        if (callback) {
                                            callback();
                                        }
                                    });
                                }
                                UserInfoView.instance.addBalance(reward, () => {
                                    DataManager.instance.TOTAL_CHIP_WIN += reward;
                                    DataManager.instance.BLACKJACK_TIMES++;
                                    DataManager.instance.HAND_WIN++;
                                    this.questUpdate(DataManager.instance.Q_CURRENT, "Q_WIN_TIMES", 1);
                                    this.countStreak(Result.WIN);
                                    this.nextGame();
                                });
                            }, Config.NEXT_HAND_WAIT_TIME)
                        })
                    }
                    if (this.currentHand.handPoint == 21 && this.dealerHand.handPoint == 21) {
                        AnnounceView.instance.show(StatusType.Push, () => {
                            this.EXP += DataManager.instance.EXP_LOSE_DRAW;
                            AnnounceView.instance.hide(() => {
                                let reward = this.BET_AMOUNT;
                                if (DataManager.instance.AUTO_BET) {
                                    BlockInputManager.instance.blockInput(true);
                                    RewardView.instance.show(reward, () => {
                                        RewardView.instance.hide(() => {
                                            BlockInputManager.instance.blockInput(false);
                                            if (callback) {
                                                callback();
                                            }
                                        }, Config.NEXT_HAND_WAIT_TIME);
                                    });
                                } else {
                                    RewardView.instance.show(reward, null, () => {
                                        if (callback) {
                                            callback();
                                        }
                                    });
                                }
                                UserInfoView.instance.addBalance(reward, () => {
                                    DataManager.instance.TOTAL_CHIP_WIN += reward;
                                    DataManager.instance.BLACKJACK_TIMES++;
                                    this.nextGame();
                                });
                            }, Config.NEXT_HAND_WAIT_TIME)
                        });
                    }
                }
                p();
            });
        } else {
            this.showAction();
        }
    }

    nextHands() {
        this.currentHand.setHandState(HandState.INACTIVE);
        this.currentHand.setHandPoint(false);
        this.currentHand.isDone = true;
        if (this.currentHand == null) {
            this.hideAction(false, () => {
            });
            this.dealerHand.cards[1].flip(() => {
                this.dealerHand.setHandPoint();
                this.dealerHit();
            });
            return;
        }
        this.currentHand.setHandState(HandState.ACTIVE);
        if (this.currentHand.handPoint >= 21) {
            this.nextHands();
        } else {
            this.showAction();
        }
    }

    nextHand() {
        this.currentHand.setHandPoint(false);
        this.currentHand.isDone = true;
        if (this.currentHand == null) {
            this.dealerHand.cards[1].flip(() => {
                this.dealerHand.setHandPoint();
                this.dealerHit();
            });
            return;
        }
    }

    onStand() {
        this.hideAction(false, () => {
            if (this.playerHands.length > 1) {
                this.nextHands();
            } else {
                this.nextHand();
            }
        });
    }

    onHit() {
        DataManager.instance.HIT_TIMES++;
        this.questUpdate(DataManager.instance.Q_CURRENT, "Q_HIT_TIMES", 1);
        this.hideAction(false, () => {
            this.drawCard(this.currentHand, (hand: Hand, card: Card) => {
                card.flip(() => {
                    hand.setHandPoint();
                    if (hand.handPoint >= 21) {
                        BlockInputManager.instance.wait(0.5, () => {
                            if (this.playerHands.length > 1) {
                                this.nextHands();
                            } else {
                                this.nextHand();
                            }
                        });
                    } else {
                        this.showAction();
                    }
                });
            });
        });
    }

    onDouble() {
        this.hideAction(false, () => {
            this.currentHand.chipInsure.node.active = true;
            this.currentHand.chipInsure.setChip(this.BET_AMOUNT);
            UserInfoView.instance.subBalance(this.BET_AMOUNT, () => {
                DataManager.instance.TOTAL_CHIP_BET += this.BET_AMOUNT;
                this.drawCard(this.currentHand, (hand: Hand, card: Card) => {
                    card.flip(() => {
                        hand.setHandPoint();
                        if (this.playerHands.length > 1) {
                            hand.setHandState(HandState.INACTIVE);
                            this.nextHands();
                        } else {
                            this.nextHand();
                        }
                    });
                });
            });
        });
    }

    onSplit() {
        DataManager.instance.SPLIT_TIMES++;
        this.questUpdate(DataManager.instance.Q_CURRENT, "Q_SPLIT_TIMES", 1);
        BlockInputManager.instance.blockInput(true);
        this.hideAction(false, () => {
            this.secondtHand.node.active = true;
            let oldCard = this.firstHand.cards[0];
            let newCard = this.firstHand.cards[1];
            this.secondtHand.cards.push(newCard);

            newCard.node.parent = this.secondtHand.grpCards.node;

            this.firstHand.cards.splice(1, 1);
            this.firstHand.setHandPoint();
            this.firstHand.chipBet.setChip(this.BET_AMOUNT);

            this.secondtHand.setHandPoint();
            this.secondtHand.chipBet.setChip(this.BET_AMOUNT);

            newCard.node.setPosition(0, newCard.node.position.y, 0);
            oldCard.node.setPosition(0, oldCard.node.position.y, 0);
            SoundManager.playEFSound(Sound.SFX_HAND_SPLIT);
            Utils.autoAlignHorizontal(this.playerHands.map(p => p.node), () => {
                UserInfoView.instance.subBalance(this.BET_AMOUNT, () => {
                    DataManager.instance.TOTAL_CHIP_BET += this.BET_AMOUNT;
                    //old hand get 1 card
                    this.drawCard(this.firstHand, (hand: Hand, card: Card) => {
                        card.flip(() => {
                            hand.setHandPoint();
                            //new hand get 1 card
                            this.drawCard(this.secondtHand, (hand: Hand, card: Card) => {
                                card.flip(() => {
                                    hand.setHandPoint();
                                    BlockInputManager.instance.blockInput(false);
                                    if (this.currentHand.handPoint >= 21) {
                                        BlockInputManager.instance.wait(0.5, () => {
                                            this.nextHands();
                                        });
                                    } else {
                                        this.showAction();
                                        hand.setHandState(HandState.INACTIVE);
                                    }
                                });
                            });
                        });
                    });
                });
            }, Config.HAND_SPLIT_TIME, Config.HAND_SPACE);
        });
    }

    dealerHit() {
        if (this.checkAbleHands.length > 0) {
            if (this.dealerHand.handPoint > 17) {
                BlockInputManager.instance.wait(0.5, () => {
                    this.checkHands();
                });
                return;
            }
            if (this.dealerHand.handPoint == 17 && !this.dealerHand.isSoft) {
                BlockInputManager.instance.wait(0.5, () => {
                    this.checkHands();
                })
                return;
            }
            if (this.dealerHand.handPoint == 17 && this.dealerHand.isSoft) {
                this.drawCard(this.dealerHand, (hand: Hand, card: Card) => {
                    card.flip(() => {
                        hand.setHandPoint();
                        BlockInputManager.instance.wait(0.5, () => {
                            this.checkHands();
                        })
                    });
                });
                return;
            }

            let hits = () => {
                this.drawCard(this.dealerHand, (hand: Hand, card: Card) => {
                    card.flip(() => {
                        hand.setHandPoint();
                        if (hand.handPoint >= 16) {
                            BlockInputManager.instance.wait(0.5, () => {
                                this.checkHands();
                            });
                        } else {
                            hits();
                        }
                    });
                });

            }
            hits();
        } else {
            this.checkHands();
        }
    }

    checkHands() {
        if (this.playerHands.length > 1) {
            let p = () => {
                this.currentCheckHand.setHandState(HandState.ACTIVE);
                this.checkResult(this.currentCheckHand, () => {
                    this.currentCheckHand.setHandState(HandState.INACTIVE);
                    this.currentCheckHand.isCheck = true;
                    if (this.currentCheckHand != null) {
                        BlockInputManager.instance.wait(1, () => {
                            p();
                        });
                    } else {
                        this.nextGame();
                    }
                });
            };
            p();
        } else {
            this.checkResult(this.currentCheckHand, () => {
                this.nextGame();
            });
        }
    }

    checkResult(hand: Hand, callback: Function = null) {
        this.hands.forEach(hand => {
            hand.setHandPoint(false);
        });
        //push dealer > 21 & player > 21
        if (this.dealerHand.handPoint > 21 && hand.handPoint > 21) {
            this.EXP += DataManager.instance.EXP_LOSE_DRAW;
            AnnounceView.instance.show(StatusType.Push, () => {
                AnnounceView.instance.hide(() => {
                    let reward = 0;
                    if (hand.chipInsure.node.active) {
                        reward = this.BET_AMOUNT * 2;
                    } else {
                        reward = this.BET_AMOUNT;
                    }
                    if (DataManager.instance.AUTO_BET) {
                        BlockInputManager.instance.blockInput(true);
                        RewardView.instance.show(reward, () => {
                            RewardView.instance.hide(() => {
                                BlockInputManager.instance.blockInput(false);
                                if (callback) {
                                    callback();
                                }
                            }, Config.NEXT_HAND_WAIT_TIME);
                        });
                    } else {
                        RewardView.instance.show(reward, null, () => {
                            if (callback) {
                                callback();
                            }
                        });
                    }
                    UserInfoView.instance.addBalance(reward, () => {
                        DataManager.instance.TOTAL_CHIP_WIN += reward;
                    });
                }, Config.NEXT_HAND_WAIT_TIME);
            });
            return;
        }
        //lose player > 21
        if (hand.handPoint > 21) {
            this.EXP += DataManager.instance.EXP_LOSE_DRAW;
            this.countStreak(Result.LOSE);
            AnnounceView.instance.show(StatusType.Lose, () => {
                AnnounceView.instance.hide(() => {
                    if (callback) {
                        callback();
                    }
                }, Config.NEXT_HAND_WAIT_TIME);
            });
            return;
        }
        //win dealer > 21
        if (this.dealerHand.handPoint > 21) {
            DataManager.instance.HAND_WIN++;
            this.questUpdate(DataManager.instance.Q_CURRENT, "Q_WIN_TIMES", 1);
            this.countStreak(Result.WIN);
            if (hand.cards.length >= 5) {
                DataManager.instance.FIVE_CARD_WIN_TIMES++;
            }
            if (hand.cards.length > DataManager.instance.HIGHEST_WIN_HIT) {
                DataManager.instance.HIGHEST_WIN_HIT = hand.cards.length;
            }
            this.EXP += DataManager.instance.EXP_WIN;
            AnnounceView.instance.show(StatusType.Win, () => {
                AnnounceView.instance.hide(() => {
                    let reward = 0;
                    if (hand.chipInsure.node.active) {
                        reward = this.BET_AMOUNT * 4;
                    } else {
                        reward = this.BET_AMOUNT * 2;
                    }
                    if (DataManager.instance.AUTO_BET) {
                        BlockInputManager.instance.blockInput(true);
                        RewardView.instance.show(reward, () => {
                            RewardView.instance.hide(() => {
                                BlockInputManager.instance.blockInput(false);
                                if (callback) {
                                    callback();
                                }
                            }, Config.NEXT_HAND_WAIT_TIME);
                        });
                    } else {
                        RewardView.instance.show(reward, null, () => {
                            if (callback) {
                                callback();
                            }
                        });
                    }
                    UserInfoView.instance.addBalance(reward, () => {
                        DataManager.instance.TOTAL_CHIP_WIN += reward;
                    });
                }, Config.NEXT_HAND_WAIT_TIME);
            });
            return;
        }
        //push dealer == player
        if (this.dealerHand.handPoint == hand.handPoint) {
            this.EXP += DataManager.instance.EXP_LOSE_DRAW;
            AnnounceView.instance.show(StatusType.Push, () => {
                AnnounceView.instance.hide(() => {
                    let reward = 0;
                    if (hand.chipInsure.node.active) {
                        reward = this.BET_AMOUNT * 2;
                    } else {
                        reward = this.BET_AMOUNT;
                    }
                    if (DataManager.instance.AUTO_BET) {
                        BlockInputManager.instance.blockInput(true);
                        RewardView.instance.show(reward, () => {
                            RewardView.instance.hide(() => {
                                BlockInputManager.instance.blockInput(false);
                                if (callback) {
                                    callback();
                                }
                            }, Config.NEXT_HAND_WAIT_TIME);
                        });
                    } else {
                        RewardView.instance.show(reward, null, () => {
                            if (callback) {
                                callback();
                            }
                        });
                    }
                    UserInfoView.instance.addBalance(reward, () => {
                        DataManager.instance.TOTAL_CHIP_WIN += reward;
                    });
                }, Config.NEXT_HAND_WAIT_TIME);
            });
            return;
        }
        //lose dealer > player
        if (this.dealerHand.handPoint > hand.handPoint) {
            this.EXP += DataManager.instance.EXP_LOSE_DRAW;
            this.countStreak(Result.LOSE);
            AnnounceView.instance.show(StatusType.Lose, () => {
                AnnounceView.instance.hide(() => {
                    if (callback) {
                        callback();
                    }
                }, Config.NEXT_HAND_WAIT_TIME);
            });

            return;
        }
        //win dealer < player
        if (this.dealerHand.handPoint < hand.handPoint) {
            DataManager.instance.HAND_WIN++;
            this.questUpdate(DataManager.instance.Q_CURRENT, "Q_WIN_TIMES", 1);
            this.countStreak(Result.WIN);
            if (hand.cards.length >= 5) {
                DataManager.instance.FIVE_CARD_WIN_TIMES++;
            }
            if (hand.cards.length > DataManager.instance.HIGHEST_WIN_HIT) {
                DataManager.instance.HIGHEST_WIN_HIT = hand.cards.length;
            }
            this.EXP += DataManager.instance.EXP_WIN;
            AnnounceView.instance.show(StatusType.Win, () => {
                AnnounceView.instance.hide(() => {
                    let reward = 0;
                    if (hand.chipInsure.node.active) {
                        reward = this.BET_AMOUNT * 4;
                    } else {
                        reward = this.BET_AMOUNT * 2;
                    }
                    if (DataManager.instance.AUTO_BET) {
                        BlockInputManager.instance.blockInput(true);
                        RewardView.instance.show(reward, () => {
                            RewardView.instance.hide(() => {
                                BlockInputManager.instance.blockInput(false);
                                if (callback) {
                                    callback();
                                }
                            }, Config.NEXT_HAND_WAIT_TIME);
                        });
                    } else {
                        RewardView.instance.show(reward, null, () => {
                            if (callback) {
                                callback();
                            }
                        });
                    }
                    UserInfoView.instance.addBalance(reward, () => {
                        DataManager.instance.TOTAL_CHIP_WIN += reward;
                    });
                }, Config.NEXT_HAND_WAIT_TIME);
            });
            return;
        }
    }
}
export class Result {
    public static WIN = 'WIN';
    public static LOSE = 'LOSE';
}
