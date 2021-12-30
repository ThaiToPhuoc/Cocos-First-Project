import Utils from "../../utils/Utils";

export default class InboxItemData {
    id: string = "";
    icon: string = "";
    title: string = "";
    message: string = "";
    chip: number = 1000;
    isClaim: boolean = false;
    constructor(title: string, chip: number, message: string = ""){
        this.id = Utils.uuid();
        this.title = title;
        this.chip = chip;
        this.isClaim = false;
        this.message = message;
    }   
}
