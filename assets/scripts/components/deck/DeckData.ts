import Config from "../../utils/Config";
import CardData from "../card/CardData";

export default class DeckData {

    cards: CardData[] = [];
    numCard: number = 52;
    
    constructor(){
        this.cards.length = 0;
        let rank = Config.MIN_RANK;
        let suit = Config.MIN_SUIT;
        for (let i = 0; i < 10000; i++) {
            let card = new CardData(rank, suit);
            card.isDeal = false;
            card.isBack = true;
            card.isCutcard = false;
            suit++;
            rank++;
            if (rank == Config.MAX_RANK + 1) {
                rank = Config.MIN_RANK;
            }
            if (suit == Config.MAX_SUIT + 1) {
                suit = Config.MIN_SUIT;
            }
            this.cards.push(card);
        }
    }
}
