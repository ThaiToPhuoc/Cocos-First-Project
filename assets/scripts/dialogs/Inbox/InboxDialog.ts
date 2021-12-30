import Utils from "../../utils/Utils";
import InboxItem from "./InboxItem";
import InboxItemData from "./InboxItemData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class InboxDialog extends cc.Component {

    public static instance: InboxDialog = null;

    items: InboxItem[] = [];
    @property(cc.Button)
    btnClose: cc.Button = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Button)
    btnClaimAll: cc.Button = null;
    @property(cc.Button)
    btnDeleteAll: cc.Button = null;

    @property(cc.SpriteFrame)
    deleteAllBtnEnableFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    claimAllBtnEnableFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    allBtnDisableFrame: cc.SpriteFrame = null;

    onLoad() {
        InboxDialog.instance = this;
    }

    start() {
        this.loadData();
        this.btnClose.node.on("click", () => {
            this.hide();
        }, this);

        this.btnClaimAll.node.on("click", () => {
            this.items.forEach((p) => p.collect());
        }, this);

        this.btnDeleteAll.node.on("click", () => {
            this.items.forEach((p) => p.node.destroy());
            this.items.length = 0;
            cc.sys.localStorage.removeItem("InboxDialogSave");
        }, this);
    }

    delete(id: string) {
        this.items.find(p=>p.data.id == id).node.destroy();
        this.items.forEach((el, i) => {
            if(el.data.id == id){
                this.items.splice(i, 1);
            }
        });       
        this.saveData();
    }

    loadData() {
        if (cc.sys.localStorage.getItem("InboxDialogSave")) {
            let saveData = JSON.parse(cc.sys.localStorage.getItem("InboxDialogSave")) as Array<InboxItemData>;
            for (let i = 0; i < saveData.length; i++) {
                let item = cc.instantiate(this.itemPrefab).getComponent(InboxItem);
                item.node.parent = this.content;
                item.data = saveData[i];
                this.items.push(item);
            }
        }
        if (!cc.sys.localStorage.getItem("InboxDialog-first")) {
            let data = new InboxItemData("Welcome gift", 10000, "Welcome gift");
            let item = cc.instantiate(this.itemPrefab).getComponent(InboxItem);
            item.node.parent = this.content;
            item.data = data;
            this.items.push(item);
        }
        this.saveData();
    }
    saveData() {
        cc.sys.localStorage.setItem("InboxDialog-first", "true");
        let saveData = [];
        this.items.forEach(p => {
            saveData.push(p.data);
        })
        cc.sys.localStorage.setItem("InboxDialogSave", JSON.stringify(saveData));
    }

    levelUp(level: number) {
        let data = new InboxItemData(`Level ${level} reward`, 5000, `Level ${level} reward`);
        let item = cc.instantiate(this.itemPrefab).getComponent(InboxItem);
        item.node.parent = this.content;
        item.data = data;
        this.items.push(item);
        this.saveData();
    }

    @property(cc.Node)
    inboxNotify: cc.Node = null;
    @property(cc.Label)
    lbInboxNotify: cc.Label = null;

    update() {
        let count = this.items.filter(p => p.data.isClaim == false).length;
        if (count > 0) {
            this.inboxNotify.active = true;
            this.lbInboxNotify.string = Utils.convert2UnitMoney(count, 3);

            this.btnClaimAll.interactable = true;
            this.btnClaimAll.getComponent(cc.Sprite).spriteFrame = this.claimAllBtnEnableFrame;
        } else {
            this.inboxNotify.active = false;
            this.btnClaimAll.interactable = false;
            this.btnClaimAll.getComponent(cc.Sprite).spriteFrame = this.allBtnDisableFrame;
        }

        if (this.items.length > 0) {
            this.items.forEach((p) => p.refresh());
            this.btnDeleteAll.interactable = true;
            this.btnDeleteAll.getComponent(cc.Sprite).spriteFrame = this.deleteAllBtnEnableFrame;
        } else {
            this.btnDeleteAll.interactable = false;
            this.btnDeleteAll.getComponent(cc.Sprite).spriteFrame = this.allBtnDisableFrame;
        }

    }

    show(callback: Function = null) {
        Utils.fadeIn(this.node, () => {
            if (callback) {
                callback();
            }
        })
    }

    hide(callback: Function = null) {
        Utils.fadeOut(this.node, () => {
            if (callback) {
                callback();
            }
        })
    }


}
