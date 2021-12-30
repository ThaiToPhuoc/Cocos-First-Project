export default class SelectTableItemData {

    id: number = 0;
    isLock: boolean = false;
    isPlay: boolean = false;

    minBet: number = 0;
    maxBet: number = 0;

    minBalance: number = 0;

    numDeck: number = 0;

    winEXP: number = 0;
    loseDrawEXP: number = 0;

    name: string = "";
    imageName: string = "";

    constructor(id: number, minBet: number, maxBet: number, winEXP: number, loseDrawEXP: number, numDeck: number, name: string, imageName: string){
        this.id = id;
        this.isLock = false;
        this.isPlay = false;

        this.minBet = minBet;
        this.maxBet = maxBet;

        this.minBalance = minBet;

        this.numDeck = numDeck;

        this.winEXP = winEXP;
        this.loseDrawEXP = loseDrawEXP;

        this.name = name;
        this.imageName = imageName;
    }
}
