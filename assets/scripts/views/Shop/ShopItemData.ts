export default class ShopItemData {
    
    item: string = "";
    chip: number = 0;
    price: number = 0;

    constructor(chip: number, price: number, item: string){
        this.chip = chip;
        this.price = price;
        this.item = item;
    }
}
