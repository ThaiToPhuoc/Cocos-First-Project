export default class LuckySpinItemData {

    chip: number = 0;
    amount: number = 0;
    color: number = -1;

    constructor(chip: number, amount: number, color: number){
        this.chip = chip;
        this.amount = amount;
        this.color = color;
    }
}
