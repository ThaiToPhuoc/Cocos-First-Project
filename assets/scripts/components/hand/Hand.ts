import Card from "../../components/card/Card";
import PoolManager from "../pool/PoolManager";
import HandChip from "../handChip/HandChip";
import HandState from "./HandState";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Hand extends cc.Component {
    
    cards: Card[] = [];

    @property(cc.Layout)
    grpCards: cc.Layout = null;

    @property(HandChip)
    chipBet: HandChip = null;

    @property(HandChip)
    chipInsure: HandChip = null;

    @property(cc.Node)
    grpPoint: cc.Node = null;

    @property(cc.Label)
    lbPoint: cc.Label = null;

    isDone: boolean = false;
    isCheck: boolean = false;
    isSoft: boolean = false;

    onLoad() {
        this.resetHand();
    }

    resetHand() {
        this.grpCards.getComponentsInChildren(Card).forEach(card => {
            PoolManager.putPool("Card", card.node);
        });
        this.cards.length = 0;
        this.chipBet.node.active = true;
        this.chipBet.setChip(0);
        this.chipInsure.node.active = false;
        this.grpPoint.active = false;
        this.isDone = false;
        this.isCheck = false;
        this.isSoft = false;
    }


    public get handPoint(): number {
        let point = 0;
        let ace = 0;
        for (let i = 0; i < this.cards.length; i++) {
            let card = this.cards[i];
            if (card.data.rank == 12) {
                ace++;
            } else {
                point += card.data.point;
            }
        }
        if (ace > 0) {
            let acePoint = 0;
            for (let i = 0; i < ace; i++) {
                if (i == 0) {
                    acePoint += 11;
                } else {
                    acePoint += 1;
                }
            }
            if (point + acePoint <= 21) {
                point += acePoint;
            } else {
                point += acePoint - 10;
            }
        } 
        return point;
    }


    setHandPoint(checkSoft: boolean = true) {
        //count
        let point = 0;
        let ace = 0;
        let cards = this.cards.filter((card) => card.data.isBack == false);
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            if (card.data.rank == 12) {
                ace++;
            } else {
                point += card.data.point;
            }
        }
        if (ace > 0) {
            let acePoint = 0;
            for (let i = 0; i < ace; i++) {
                if (i == 0) {
                    acePoint += 11;
                } else {
                    acePoint += 1;
                }
            }
            if (point + acePoint <= 21) {
                point += acePoint;
                this.isSoft = true;
            } else {
                point += acePoint - 10;
                this.isSoft = false;
            }
        } else {
            this.isSoft = false;
        }
        //show
        if (checkSoft) {
            if (this.isSoft) {
                if (point != 21) {
                    this.lbPoint.string = `${(point - 10)}/${point}`;
                } else {
                    this.lbPoint.string = point + "";
                }
            } else {
                this.lbPoint.string = point.toString() + "";
            }
        } else {
            this.lbPoint.string = point.toString();
        }
        this.grpPoint.active = true;
    }

    setHandState(state: string) {
        switch (state) {
            case HandState.ACTIVE:
                this.cards.forEach(card => {
                    card.node.color = cc.Color.WHITE;
                });
                break;
            case HandState.INACTIVE:
                this.cards.forEach(card => {
                    card.node.color = cc.Color.GRAY;
                });
                break;
        }
    }
}



