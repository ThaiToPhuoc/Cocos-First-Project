const { ccclass, property } = cc._decorator;

@ccclass
export default class Menu extends cc.Component {

    public static instance: Menu = null;

    onLoad() {
        Menu.instance = this;   
    }

}



