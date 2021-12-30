
export default class AchievementItemData {

    key: string = "";

    current: number = 0;

    min: number = 0;

    stage: number = 0;

    final: boolean = false;

    numbers: number[] = [];
    chips: number[] = [];
    exps: number[] = [];

    public get max() : number {
        let stage = this.stage;
        if(this.stage > 9){
            stage = 9;
            this.final = true;
        }
        return this.numbers[stage];
    }
    public get chip() : number {
        let stage = this.stage;
        if(this.stage > 9){
            stage = 9;
            this.final = true;
        }
        return this.chips[stage];
    }
    public get xp() : number {
        let stage = this.stage;
        if(this.stage > 9){
            stage = 9;
            this.final = true;
        }
        return this.exps[stage];
    }
    

    constructor(key: string, chips: number[], xps: number[], numbers: number[]) {
        this.key = key;
        this.chips = chips;
        this.exps = xps;  
        this.numbers = numbers;  
    }

}
