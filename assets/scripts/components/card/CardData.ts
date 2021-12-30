export default class CardData {

    rank: number = 0;
    suit: number = 0;
    point: number = 0;

    isBack: boolean = true;

    isDeal: boolean = false;

    isCutcard: boolean = false;

    constructor(rank: number, suit: number) {
        this.rank = rank
        this.suit = suit;

        switch (this.rank) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
                this.point = this.rank + 2;
                break;
            case 9:
            case 10:
            case 11:
                this.point = 10;
                break;
        }
    }

}
