import Data from "../../data/Data";

export default class DailyQuestItemData {

    index: number = 0;

    key: string = "";

    current: number = 0;

    min: number = 0;

    max: number = 5;

    chip: number = 1000;

    EXP: number = 1000;

    isClaim: boolean = false;

    id: string = "";

    title: string = "";

    constructor(index: number, key: string, current: number, min: number, max: number, chip: number, EXP: number, isClaim: boolean) {
        this.index = index;
        this.key = key;
        this.current = current;
        this.min = min;
        this.max = max;
        this.chip = chip;
        this.EXP = EXP;
        this.isClaim = isClaim;

        switch (key) {
            case Data.Q_MAIN:
                this.title = `COMPLETE ${max} CHALLENGE`;
                break;
            case Data.Q_PLAYED_TIMES:
                this.title = `Play ${max} Hand`;
                break;
            case Data.Q_WIN_TIMES:
                this.title = `Win ${max} Hand`;
                break;
            case Data.Q_HIT_TIMES:
                this.title = `Hit ${max} times`;
                break;
            case Data.Q_WIN_STREAKS:
                this.title = `Get ${max} win streak`;
                break;
            case Data.Q_SPLIT_TIMES:
                this.title = `Split ${max} times`;
                break;
        }

        this.id = `DailyQuest-${index}-${key}`;
    }

}
