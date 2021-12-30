import Utils from "../../utils/Utils";
import CardData from "../card/CardData";
import DeckData from "./DeckData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Deck extends cc.Component {

    public static instance: Deck = null;

    data: DeckData = null;

    @property(cc.Node)
    cardPos: cc.Node = null;

    onLoad() {
        Deck.instance = this;
        this.reset();
    }

    public get card(): CardData {
        let card: CardData;
        for (let i = 0; i < this.data.cards.length; i++) {
            let temp = this.data.cards[i];
            if (!temp.isDeal) {
                card = temp;
                card.isDeal = true;
                break;
            }
        }
        return card;
    }

    reset() {
        let deckData = new DeckData();
        this.data = deckData;           
        Utils.shuffle(this.data.cards);
    }
    
}
