const {ccclass, property} = cc._decorator;

@ccclass
export default class DialogManager extends cc.Component {

    static dialogs: cc.Node[] = [];

    onLoad () {
        cc.game.addPersistRootNode(this.node);
    }

    public static showDialog(dialogName: string, param: any = null, callback: Function = null, okCallback: Function = null){
        let dialog = DialogManager.dialogs.find(n=>n.name == dialogName);
        if(dialog){
            dialog.active = false;
            dialog.setSiblingIndex(cc.director.getScene().getChildByName('Canvas').childrenCount);
            dialog.getComponent(dialogName).show(param, callback, okCallback);
        } else {
            cc.resources.load(`prefabs/dialogs/${dialogName}`, cc.Prefab, function (err: Error, prefab: cc.Prefab) {
                if(err){
                    cc.log(`${err.name} : ${err.message}`);
                }
                let dialog = cc.instantiate(prefab);
                dialog.parent = cc.director.getScene().getChildByName('Canvas');
                dialog.setPosition(0, 0);
                dialog.setSiblingIndex(cc.director.getScene().getChildByName('Canvas').childrenCount);
                DialogManager.dialogs.push(dialog);
                dialog.getComponent(dialogName).show(param, callback, okCallback);
            }); 
        }
                    
    }

    public static hideDialog(dialogName: string, callback: Function = null){
        let dialog = DialogManager.dialogs.find(n=>n.name == dialogName);
        dialog.getComponent(dialogName).hide(()=>{
            if(callback) callback();
        });      
    }
}
