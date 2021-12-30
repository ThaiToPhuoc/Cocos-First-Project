import Scene from "../../components/scene/Scene";
import DataManager from "../../data/DataManager";
import Dialog from "../../components/dialog/Dialog";
import DialogManager from "../../components/dialog/DialogManager";
import PoolManager from "../../components/pool/PoolManager";
import Config from "../../utils/Config";
import Utils, { TweenNumberObject } from "../../utils/Utils";
import MenuPageView from "../MenuPage/MenuPageView";
import SceneManager from "../../components/scene/SceneManager";
import { QuitGameDialogParam } from "../../dialogs/QuitGame/QuitGameDialog";
import RewardView from "../Reward/RewardView";
import PluginManager from "../../plugin/PluginManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UserInfoView extends cc.Component {

    public static instance: UserInfoView = null;

    SHOW: boolean = true;

    @property(cc.Node)
    body: cc.Node = null;

    //profile
    @property(cc.Label)
    lbBalance: cc.Label = null;
    @property(cc.Label)
    lbLevel: cc.Label = null;
    @property(cc.Label)
    lbName: cc.Label = null;
    @property(cc.Button)
    btnProfile: cc.Button = null;
    @property(cc.Button)
    btnLeave: cc.Button = null;

    //popup
    @property(cc.ProgressBar)
    pbPopupLevel: cc.ProgressBar = null;
    @property(cc.Label)
    lbPopupNextLevelTxt: cc.Label = null;
    @property(cc.Label)
    lbPopupNextLevelNum: cc.Label = null;
    @property(cc.Label)
    lbPopupNextLevelEXP: cc.Label = null;

    //rank
    @property(cc.Label)
    lbRankName: cc.Label = null;
    @property(cc.Sprite)
    sprRankIcon: cc.Sprite = null;
    @property(cc.SpriteAtlas)
    atlasRankIcon: cc.SpriteAtlas = null;

    ADD_TIME: number = 0.5;

    onLoad() {
        UserInfoView.instance = this;
    }

    start() {
        this.btnProfile.node.on("click", () => {
            DialogManager.showDialog(Dialog.PROFILE_DIALOG);
        });
        this.btnLeave.node.on("click", () => {
            let param: QuitGameDialogParam = new QuitGameDialogParam();
            let okCallback: Function;
            switch (cc.director.getScene().name) {
                case Scene.SCENE_MENU:
                    param.title = "QUIT";
                    param.message = "Quit Ace Blackjack?";
                    okCallback = () => {
                        cc.game.end();
                    }
                    break;
                case Scene.SCENE_GAME:
                    param.title = "BACK";
                    param.message = "Back to menu?";
                    okCallback = () => {
                        SceneManager.loadSceneAsync(Scene.SCENE_MENU, true, false);
                    }
                    break;
            }
            DialogManager.showDialog(Dialog.QUIT_GAME, param, null, okCallback);
        });
        this.body.active = true;
    }

    lastParticle: string = '';
    saveSiblingIndex: number = 0;

    addBalance(value: number, callback: Function = null, fxStart: cc.Node = null) {
        if (fxStart) {
            this.saveSiblingIndex = this.node.getSiblingIndex();
            this.node.setSiblingIndex(this.node.parent.childrenCount);
            this.show();
            let particle = PoolManager.getPool("ParticleChip").getComponent(cc.ParticleSystem);
            this.lastParticle = particle.uuid;
            particle.node.parent = cc.director.getScene().getChildByName('Canvas');
            Utils.SetNodePositionFromNode(particle.node, RewardView.instance.node);
            let start = fxStart;
            let end = UserInfoView.instance.lbBalance.node;
            let call = () => {
                particle.node.destroy();
                let tempBalance = DataManager.instance.BALANCE;
                DataManager.instance.BALANCE += value;
                Utils.tweenNumber(new TweenNumberObject(tempBalance), this.ADD_TIME, tempBalance + value, (progress) => {
                    UserInfoView.instance.lbBalance.string = "$" + Utils.numberWithCommas(Math.round(progress), 3);
                }, () => {
                    if (cc.director.getScene().name == Scene.SCENE_MENU) {
                        switch (MenuPageView.instance.pageView.getCurrentPageIndex()) {
                            case 0:
                            case 1:
                            case 3:
                            case 4:
                                if (this.lastParticle == particle.uuid) {
                                    this.hide();
                                }
                                break;
                            case 2:
                                if (this.lastParticle == particle.uuid) {
                                    this.node.setSiblingIndex(this.saveSiblingIndex);
                                }
                                break;
                        }
                    }
                    if (cc.director.getScene().name == Scene.SCENE_GAME) {
                        if (this.lastParticle == particle.uuid) {
                            this.node.setSiblingIndex(this.saveSiblingIndex);
                        }

                    }
                    if (callback) {
                        callback();
                    }
                    PluginManager.instance.sendScores();
                });
            };
            let offset = cc.v2(UserInfoView.instance.lbBalance.node.width / 2, 0);
            let reward = 0;
            reward = value;
            RewardView.instance.show(reward, () => {
                Utils.moveTo(particle.node, start, end, 0, call, offset);
            });
        } else {
            let tempBalance = DataManager.instance.BALANCE;
            DataManager.instance.BALANCE += value;
            Utils.tweenNumber(new TweenNumberObject(tempBalance), this.ADD_TIME, tempBalance + value, (progress) => {
                UserInfoView.instance.lbBalance.string = "$" + Utils.numberWithCommas(Math.round(progress), 3);
            }, () => {
                if (callback) {
                    callback();
                }
                PluginManager.instance.sendScores();
            });
        }
    }

    subBalance(value: number, callback: Function = null) {
        let tempBalance = DataManager.instance.BALANCE;
        DataManager.instance.BALANCE -= value;
        Utils.tweenNumber(new TweenNumberObject(tempBalance), 0.5, tempBalance - value, (progress) => {
            UserInfoView.instance.lbBalance.string = "$" + Utils.numberWithCommas(Math.round(progress), 3);
        }, () => {
            if (callback) {
                callback();
            }
            PluginManager.instance.sendScores();
        })
    }

    addEXP(exp: number = 0, callback: Function = null, fxStart: cc.Node = null) {
        if (fxStart) {
            let particle = PoolManager.getPool("ParticleChip").getComponent(cc.ParticleSystem);
            particle.node.parent = cc.director.getScene().getChildByName('Canvas');
            particle.stopSystem();
            Utils.SetNodePositionFromNode(particle.node, fxStart);

            let start = fxStart;
            let end = RewardView.instance.node;
            let call = () => {
                let tempEXP = 25;
                let p = () => {
                    if (DataManager.instance.EXP + tempEXP < DataManager.instance.EXP_MAX) {
                        DataManager.instance.EXP += tempEXP;
                    } else if (DataManager.instance.EXP + tempEXP == DataManager.instance.EXP_MAX) {
                        DataManager.instance.EXP_MIN = DataManager.instance.EXP_MAX;
                        DataManager.instance.EXP_MAX = 50 * DataManager.instance.LEVEL * DataManager.instance.LEVEL + DataManager.instance.EXP_MIN;
                        DataManager.instance.EXP += tempEXP;
                        DataManager.instance.LEVEL++;
                    } else {
                        let e = tempEXP - DataManager.instance.EXP_MAX;
                        DataManager.instance.EXP_MIN = DataManager.instance.EXP_MAX;
                        DataManager.instance.EXP_MAX = 50 * DataManager.instance.LEVEL * DataManager.instance.LEVEL + DataManager.instance.EXP_MIN;
                        DataManager.instance.EXP += e;
                        DataManager.instance.LEVEL++;
                        tempEXP -= e;
                        p();
                    }
                }
                p();
                particle.node.destroy();
                if (callback) {
                    callback();
                }
                PluginManager.instance.sendScores();
            };
            let reward = 0;
            reward = exp;
            RewardView.instance.show(reward, () => {
                Utils.moveTo(particle.node, start, end, 0, call);
            });
            
        } else {
            let tempEXP = 25;
            let p = () => {
                if (DataManager.instance.EXP + tempEXP < DataManager.instance.EXP_MAX) {
                    DataManager.instance.EXP += tempEXP;
                } else if (DataManager.instance.EXP + tempEXP == DataManager.instance.EXP_MAX) {
                    DataManager.instance.EXP_MIN = DataManager.instance.EXP_MAX;
                    DataManager.instance.EXP_MAX = 50 * DataManager.instance.LEVEL * DataManager.instance.LEVEL + DataManager.instance.EXP_MIN;
                    DataManager.instance.EXP += tempEXP;
                    DataManager.instance.LEVEL++;
                } else {
                    let e = tempEXP - DataManager.instance.EXP_MAX;
                    DataManager.instance.EXP_MIN = DataManager.instance.EXP_MAX;
                    DataManager.instance.EXP_MAX = 50 * DataManager.instance.LEVEL * DataManager.instance.LEVEL + DataManager.instance.EXP_MIN;
                    DataManager.instance.EXP += e;
                    DataManager.instance.LEVEL++;
                    tempEXP -= e;
                    p();
                }
            }
            p();
            if (callback) {
                callback();
            }
            PluginManager.instance.sendScores();
        }



    }

    show(callback: Function = null) {
        Utils.fadeIn(this.body, () => {
            if (callback) {
                callback();
            }
        })
    }

    hide(callback: Function = null) {
        if (!this.body.active) return;
        Utils.fadeOut(this.body, () => {
            if (callback) {
                callback();
            }
        })
    }


    f5Rank() {
        for (let i = 0; i < Config.RANK_NAME.length; i++) {
            if (DataManager.instance.RANK_POINT < Config.RANK_POINT[i]) {
                this.lbRankName.string = Config.RANK_NAME[i];
                this.sprRankIcon.spriteFrame = this.atlasRankIcon.getSpriteFrame(`${i}`);
                break;
            }
        }
    }

    f5View() {
        this.lbName.string = DataManager.instance.DISPLAY_NAME;
        this.lbBalance.string = "$" + Utils.numberWithCommas(DataManager.instance.BALANCE, 3);
        this.lbLevel.string = Utils.convert2UnitMoney(DataManager.instance.LEVEL, 3);

        this.lbPopupNextLevelTxt.string = "Level " + Utils.numberWithCommas(DataManager.instance.LEVEL + 1, 3);
        this.lbPopupNextLevelNum.string = Utils.convert2UnitMoney(DataManager.instance.LEVEL + 1, 3);
        this.lbPopupNextLevelEXP.string = `${Utils.convert2UnitMoney(DataManager.instance.EXP)}/${Utils.convert2UnitMoney(DataManager.instance.EXP_MAX)}`;

        this.pbPopupLevel.progress = Utils.normalized(DataManager.instance.EXP, DataManager.instance.EXP_MIN, DataManager.instance.EXP_MAX);

    }

    update() {
        this.f5Rank();
        this.f5View();
    }
}
