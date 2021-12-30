import Utils from "../utils/Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ButtonMenu extends cc.Component {

    @property(cc.Node)
    dropdown: cc.Node = null;

    show: boolean = false;

    onLoad () {
        this.dropdown.active = false;
        this.node.on('click', ()=>{
            if(!this.show){              
                Utils.fadeIn(this.dropdown);
            } else {
                Utils.fadeOut(this.dropdown);
            }
            this.show = !this.show;
        }, this);
    }
}

