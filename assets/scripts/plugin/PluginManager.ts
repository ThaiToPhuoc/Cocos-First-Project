import DataManager from "../data/DataManager";
import Utils from "../utils/Utils";
import Leaderboard from "../views/Leaderboard/Leaderboard";
import LeaderboardView from "../views/Leaderboard/LeaderboardView";
import RewardView from "../views/Reward/RewardView";
import ShopView from "../views/Shop/ShopView";
import UserInfoView from "../views/UserInfo/UserInfoView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PluginManager extends cc.Component {

    public static instance: PluginManager = null;

    ADS_FREE_CHIP = 'free_chip';
    ADS_DAILY_REWARD = 'daily_reward';
    ADS_LUCKY_SPIN = 'lucky_spin';

    userID: any = null;
    rewardAdsCallback: Function = null;
    onLoad() {
        cc.game.addPersistRootNode(this.node);
        PluginManager.instance = this;
        this.initPlugin();
    }

    initPlugin() {
        if(this.SDKBOX_CHECK) {
            this.initIAP();
            this.initSdkboxAds();
            this.initSdkboxPlay();
            this.initPluginReview();
            //this.initOneSignal();
            this.initFirebase();
        }
    }


    public get SDKBOX_CHECK(): boolean {
        if ('undefined' == typeof sdkbox) {
            return false;
        }
        return true;
    }

    //Ads

    initSdkboxAds() {
        if ('undefined' == typeof sdkbox.PluginSdkboxAds) {
            console.log('sdkbox.PluginSdkboxAds is undefined');
            return;
        }

        let self = this;
        sdkbox.PluginSdkboxAds.setListener({
            onAdAction(ad_unit_id, zone_location_place_you_name_it, action_type) {
                console.log("onAdAction:" + String(ad_unit_id) + ":" + String(zone_location_place_you_name_it) + ":" + String(action_type));
                if (Number(action_type) == 8) {
                    if (self.rewardAdsCallback) {
                        self.rewardAdsCallback();
                    } else {
                        console.log("rewardAdsCallback = null");
                    }
                }
            },
            onRewardAction(ad_unit_id, zone_id, reward_amount, reward_succeed) {
                console.log("onRewardAction:" + String(ad_unit_id) + ":" + String(zone_id) + ":" + String(reward_amount) + ":" + String(reward_succeed));
            }
        });
        sdkbox.PluginSdkboxAds.init();
    }

    showRewardAds(name: string, callback: Function) {
        if (PluginManager.instance.SDKBOX_CHECK) {
            if (sdkbox.PluginSdkboxAds.isAvailable(name)) {
                sdkbox.PluginSdkboxAds.placement(name);
                this.rewardAdsCallback = callback;
            }
        }
    }

    checkRewardAds(name: string): boolean {
        if (PluginManager.instance.SDKBOX_CHECK) {
            if (sdkbox.PluginSdkboxAds.isAvailable(name)) {
                return true;
            }
            return false;
        }
    }

    //IAP
    initIAP() {
        if ('undefined' == typeof sdkbox.IAP) {
            console.log('sdkbox.IAP is undefined');
            return;
        }
        sdkbox.IAP.setListener({
            onSuccess(product) {
                //Purchase success
                console.log("Purchase successful: " + product.name);
                let reward = 0;
                switch (product.name) {
                    case 'chip01':
                        reward = 100000;
                        break;
                    case 'chip05':
                        reward = 700000;
                        break;
                    case 'chip10':
                        reward = 1600000;
                        break;
                    case 'chip20':
                        reward = 4000000;
                        break;
                    case 'chip50':
                        reward = 14000000;
                        break;
                    case 'chip100':
                        reward = 38000000;
                        break;
                    case 'offer01':
                        reward = 1000000;
                        DataManager.instance.RECOMMEND_OFFER_BUY = true;
                        Utils.fadeOut(ShopView.instance.recommendOffer.node, () => {
                            Utils.fadeIn(ShopView.instance.dailyOffer.node);
                        });
                        break;
                    case 'daily01':
                        reward = 500000;
                        DataManager.instance.DAILY_OFFER_BUY = true;
                        DataManager.instance.DAILY_OFFER_BUY_TIME = Date.now();
                        ShopView.instance.dailyOffer.btnBuy.interactable = false;
                        ShopView.instance.dailyOffer.sprLock.node.active = true;
                        break;
                }
                RewardView.instance.show(reward);
                UserInfoView.instance.addBalance(reward);
            },
            onFailure(product, msg) {
                //Purchase failed
                //msg is the error message
                console.log("Purchase failed: " + product.name + " error: " + msg);

            },
            onCanceled(product) {
                //Purchase was canceled by user
                console.log("Purchase canceled: " + product.name);
            },
            onRestored(product) {
                //Purchase restored
                console.log("Restored: " + product.name);
            },
            onProductRequestSuccess(products) {
                //Returns you the data for all the iap products
                //You can get each item using following method
                for (var i = 0; i < products.length; i++) {
                    console.log(`onProductRequestSuccess: + ${products[i].name}-${products[i].price}`);
                }
            },
            onProductRequestFailure(msg) {
                //When product refresh request fails.
                console.log("Failed to get products");
            },
            onShouldAddStorePayment(productId) {
                console.log("onShouldAddStorePayment:" + productId);
                return true;
            },
            onFetchStorePromotionOrder(productIds, error) {
                console.log("onFetchStorePromotionOrder:" + " " + " e:" + error);
            },
            onFetchStorePromotionVisibility(productId, visibility, error) {
                console.log("onFetchStorePromotionVisibility:" + productId + " v:" + visibility + " e:" + error);
            },
            onUpdateStorePromotionOrder(error) {
                console.log("onUpdateStorePromotionOrder:" + error);
            },
            onUpdateStorePromotionVisibility(error) {
                console.log("onUpdateStorePromotionVisibility:" + error);
            }
        });
        sdkbox.IAP.init();
    }

    onPurchase(item: string) {
        if(this.SDKBOX_CHECK) {
            sdkbox.IAP.purchase(item);
        }
    }

    //sdkbox play 
    initSdkboxPlay() {
        if ('undefined' == typeof sdkbox.PluginSdkboxPlay) {
            console.log('sdkbox.PluginSdkboxPlay is undefined');
            return;
        }
        let self = this;
        sdkbox.PluginSdkboxPlay.setListener({
            onConnectionStatusChanged(connection_status) {
                console.log("onConnectionStatusChanged: " + connection_status);
                if (connection_status == 1000) {
                    let avatar = sdkbox.PluginSdkboxPlay.getPlayerAccountField("icon_image_uri");
                    console.log('Sign in success...');
                    console.log('Player id: ' + sdkbox.PluginSdkboxPlay.getPlayerId());
                    console.log('display_name: ' + sdkbox.PluginSdkboxPlay.getPlayerAccountField("display_name"));
                    console.log('icon_image_uri: ' + avatar);
                    console.log('hires_image_uri: ' + sdkbox.PluginSdkboxPlay.getPlayerAccountField("hires_image_uri"));
                    DataManager.instance.DISPLAY_NAME = sdkbox.PluginSdkboxPlay.getPlayerAccountField("display_name");
                    self.sendScores();
                    //jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "saveAvatar", "(Ljava/lang/String;)V", avatar);
                }
            },
            onScoreSubmitted(leaderboard_name, score, maxScoreAllTime, maxScoreWeek, maxScoreToday) {
                console.log('onScoreSubmitted' + leaderboard_name + ':' + score + ':' + maxScoreAllTime + ':' + maxScoreWeek + ':' + maxScoreToday);
            },
            onMyScore(leaderboard_name, time_span, collection_type, score) {
                console.log('onMyScore:' + leaderboard_name + ':' + time_span + ':' + collection_type + ':' + score);
            },
            onMyScoreError(leaderboard_name, time_span, collection_type, error_code, error_description) {
                console.log('onMyScoreError:' + leaderboard_name + ':' + time_span + ':' + collection_type + ':' + error_code + ':' + error_description);
            },
            onPlayerCenteredScores(leaderboard_name, time_span, collection_type, json_with_score_entries) {
                console.log('onPlayerCenteredScores:' + leaderboard_name + ':' + time_span + ':' + collection_type + ':' + json_with_score_entries);
                switch (leaderboard_name) {
                    case Leaderboard.BLACKJACK:
                        LeaderboardView.instance.ldbData[0] = json_with_score_entries;
                        break;
                    case Leaderboard.RANKING:
                        LeaderboardView.instance.ldbData[1] = json_with_score_entries;
                        break;
                    case Leaderboard.LEVEL:
                        LeaderboardView.instance.ldbData[2] = json_with_score_entries;
                        break;
                    case Leaderboard.BANKROLL:
                        LeaderboardView.instance.ldbData[3] = json_with_score_entries;
                        break;
                    default:
                        console.log("Leaderboard unknown");
                        break;
                }
            },
            onPlayerCenteredScoresError(leaderboard_name, time_span, collection_type, error_code, error_description) {
                console.log('onPlayerCenteredScoresError:' + leaderboard_name + ':' + time_span + ':' + collection_type + ':' + error_code + ':' + error_description);
            },
            onIncrementalAchievementUnlocked(achievement_name) {
                console.log("onIncrementalAchievementUnlocked:" + achievement_name);
            },
            onIncrementalAchievementStep(achievement_name, step) {
                console.log("onIncrementalAchievementStep:" + achievement_name + ":" + step);
            },
            onIncrementalAchievementStepError(name, steps, error_code, error_description) {
                console.log('onIncrementalAchievementStepError:' + name + ':' + steps + ':' + error_code + ':' + error_description);
            },
            onAchievementUnlocked(achievement_name, newlyUnlocked) {
                console.log('onAchievementUnlocked:' + achievement_name + ':' + newlyUnlocked);
            },
            onAchievementUnlockError(achievement_name, error_code, error_description) {
                console.log('onAchievementUnlockError:' + achievement_name + ':' + error_code + ':' + error_description);
            },
            onAchievementsLoaded(reload_forced, json_achievements_info) {
                console.log('onAchievementsLoaded:' + reload_forced + ':' + json_achievements_info);
            },
            onSetSteps(name, steps) {
                console.log('onSetSteps:' + name + ':' + steps);
            },
            onSetStepsError(name, steps, error_code, error_description) {
                console.log('onSetStepsError:' + name + ':' + steps + ':' + error_code + ':' + error_description);
            },
            onReveal(name) {
                console.log('onReveal:' + name);
            },
            onRevealError(name, error_code, error_description) {
                console.log('onRevealError:' + name + ':' + error_code + ':' + error_description);
            },
            onGameData(action, name, data, error) {
                if (error) {
                    // failed
                    console.log('onGameData failed:' + error);
                } else {
                    //success
                    if ('load' == action) {
                        console.log('onGameData load:' + name + ':' + data);
                    } else if ('save' == action) {
                        console.log('onGameData save:' + name + ':' + data);
                    } else {
                        console.log('onGameData unknown action:' + action);
                    }
                }
            },
            onSaveGameData(success, error) {
                if (error) {
                    // failed
                    console.log('onSaveGameData failed:' + error);
                } else {
                    //success
                    console.log('onSaveGameData success');
                }
            },
            onLoadGameData(savedData, error) {
                if (error) {
                    // failed
                    console.log('onLoadGameData failed:' + error);
                } else {
                    //success
                    if (savedData) {
                        // map["name"]
                        // map["data"] = cocos2d::Value((char*)gameData->data);
                        // map["dataLength"] = cocos2d::Value(gameData->dataLength);
                        // map["lastModifiedTimestamp"] = cocos2d::Value((double)gameData->lastModifiedTimestamp);
                        // map["deviceName"]

                        console.log(JSON.stringify(savedData));
                        console.log('onLoadGameData:' + savedData.name);
                    } else {
                        console.log('Load Game Data Finish');
                    }
                }
            },
            onGameDataNames(names, error) {
                if (error) {
                    // failed
                    console.log('onGameDataNames failed:' + error);
                } else {
                    //success
                    console.log(JSON.stringify(names));
                    console.log('onGameDataNames count:' + names.length);
                }
            }
        });
        sdkbox.PluginSdkboxPlay.init();
        this.onSignIn();
        //this.schedule(this.sendScores, 20);
    }

    onSignIn() {
        if (this.SDKBOX_CHECK) {
            if (!sdkbox.PluginSdkboxPlay.isSignedIn()) {
                console.log('onSignIn...');
                sdkbox.PluginSdkboxPlay.signin(false);
            }
        }       
    }

    sendScores() {
        if(this.SDKBOX_CHECK && sdkbox.PluginSdkboxPlay.isSignedIn()) {
            console.log('sendScore...');
            sdkbox.PluginSdkboxPlay.submitScore(Leaderboard.BLACKJACK, DataManager.instance.BLACKJACK_TIMES);
            sdkbox.PluginSdkboxPlay.submitScore(Leaderboard.RANKING, DataManager.instance.RANK_POINT);
            sdkbox.PluginSdkboxPlay.submitScore(Leaderboard.LEVEL, DataManager.instance.LEVEL);
            sdkbox.PluginSdkboxPlay.submitScore(Leaderboard.BANKROLL, DataManager.instance.BALANCE);
        }
    }

    onSaveGame() {
        if (sdkbox.PluginSdkboxPlay.isSignedIn()) {
            console.log('to save game data...');
            sdkbox.PluginSdkboxPlay.saveGameData("key1", "data");
        } else {
            console.log('need signin..');
        }
    }

    onLoadGame() {
        if (sdkbox.PluginSdkboxPlay.isSignedIn()) {
            sdkbox.PluginSdkboxPlay.loadAllGameData();
        } else {
            console.log('need signin...');
        }
    }

    //onesignal
    initOneSignal() {
        if ('undefined' == typeof sdkbox.PluginOneSignal) {
            console.log('sdkbox.PluginOneSignal is undefined');
            return;
        }
        let self = this;
        sdkbox.PluginOneSignal.setListener({
            onSendTag(success, key, message) {
                console.log('onSendTag:' + success + ':' + key + ':' + message);
            },
            onGetTags(jsonString) {
                console.log("onGetTags:" + jsonString);
            },
            onIdsAvailable(userId, pushToken) {
                console.log("onIdsAvailable:" + userId + ':' + pushToken);
                self.userID = userId;
            },
            onPostNotification(success, message) {
                console.log("onPostNotification:" + success);
                console.log(message);
            },
            onNotification(isActive, message, additionalData) {
                console.log("onNotification" + ':' + isActive);
                console.log(message);
                console.log(additionalData);
            }
        });
        sdkbox.PluginOneSignal.init();
    }

    //review
    initPluginReview() {
        if ('undefined' == typeof sdkbox.PluginReview) {
            console.log('sdkbox.PluginReview is undefined');
            return;
        }
        sdkbox.PluginReview.setListener({
            onDisplayAlert(data) {
                console.log("didDisplayAlert");
            },
            onDeclineToRate(data) {
                console.log("didDeclineToRate");
            },
            onRate(data) {
                console.log("didToRate");
            },
            onRemindLater(data) {
                console.log("didToRemindLater");
            }
        });
        sdkbox.PluginReview.init();
    }

    showReview() {
        if(this.SDKBOX_CHECK) {
            sdkbox.PluginReview.show(true);
        }
    }

    //firebase
    initFirebase() {
        sdkbox.firebase.Analytics.init();
        console.log('initFirebase');
    }

    logEvent(name: string, param: any = null) {
        if (PluginManager.instance.SDKBOX_CHECK) {
            let map: Map<string, string>;
            if (param) {
                map = new Map(Object.entries(param));

            } else {
                map = new Map();
            }
            sdkbox.firebase.Analytics.logEvent(name, map);
            console.log('firebase logEvent');
        }
    }
}
export class RewardAds {
    public static readonly FREE_CHIP = "free_chip";
    public static readonly DAILY_REWARD = "daily_reward";
    public static readonly LUCKY_SPIN = "lucky_spin";
}
