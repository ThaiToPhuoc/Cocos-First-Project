import DataManager from "../../data/DataManager";
import AnalyticEvent from "../../plugin/AnalyticEvent";
import PluginManager from "../../plugin/PluginManager";
import Utils from "../../utils/Utils";
import { Sound } from "../sound/Sound";
import SoundManager from "../sound/SoundManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneManager extends cc.Component {
	@property([cc.String])
	private scenes: string[] = [];
	@property(cc.Node)
	private overlay: cc.Node = null;
	@property(cc.Node)
	private blockEvent: cc.Node = null;
	@property(cc.Animation)
	private loadSceneAnim: cc.Animation = null;
	@property(cc.Boolean)
	private useAnim: boolean = true;
	@property(cc.Label)
	private lbVersion: cc.Label = null;

	@property(cc.Node)
	private spr_BGLeft: cc.Node = null;
	@property(cc.Node)
	private spr_BGRight: cc.Node = null;

	//loading
	@property(cc.Node)
	private loadingPanel: cc.Node = null;
	@property(cc.Sprite)
	private loadingProgress: cc.Sprite = null;
	@property(cc.Label)
	private loadingText: cc.Label = null;

	@property(cc.Label)
	lbLoading: cc.Label = null;

	@property(cc.Label)
	lbFps: cc.Label = null;

	private loadingScene: string = "";
	private loadedScene: string = "";
	private currentScene: string = "";
	private fadeInAction: cc.Tween = null;
	private fadeOutAction: cc.Tween = null;
	private autoHideOverlay: boolean = false;
	private progressTween: cc.Tween = null;

	fps: number = 0;

	public static instance: SceneManager = null;

	private static validateInstance() {
		return (!!SceneManager.instance && SceneManager.instance instanceof SceneManager);
	}

	public static loadSceneAsync(sceneName: string, autoHideOverlay: boolean = true, direct: boolean = false) {
		if (SceneManager.validateInstance()) {
			SceneManager.instance.loadSceneAsync(sceneName, autoHideOverlay, direct);
		}
	}

	public static async hideOverlay() {
		if (SceneManager.validateInstance()) {
			await SceneManager.instance.hideOverlay();
		}
	}

	onLoad() {
		//
		if (SceneManager.instance && this !== SceneManager.instance) {
			if (!CC_EDITOR) {
				cc.error("UIDialogManager was initialized!");
			}
			return;
		}
		cc.game.addPersistRootNode(this.node);
		SceneManager.instance = this;
		this.loadedScene = "";
		this.loadingScene = "";
		this.currentScene = "";
		this.overlay.active = this.useAnim;
		this.blockEvent.active = false;
		this.fadeInAction = cc.tween(this.overlay)
			.call(() => {
				if (!!this.overlay) {
					this.overlay.active = true;
					this.blockEvent.active = true;
				}
				this.overlay.opacity = 0;
			})
			.to(0.1, {
				opacity: 255
			})
			.call(() => {
				cc.director.loadScene(this.loadingScene, this.onLaunched.bind(this));
			});
		this.fadeOutAction = cc.tween(this.overlay)
			.call(() => {
				this.overlay.opacity = 255;
			})
			.to(0.2, {
				opacity: 0
			})
			.call(() => {
				if (!!this.overlay) {
					this.overlay.active = false;
					this.blockEvent.active = false;
				}
			});
		this.activeProgress(false, 0);

		this.loadSceneAnim.on("stop", ()=>{
			//console.log("stop" + this.loadSceneAnim.currentClip.name)
			switch (this.loadSceneAnim.currentClip.name) {
				case "scene_loading_open":
					this.loadSceneAnim.play("scene_loading_idle");
					break;			
				default:
					break;
			}
		});
		this.animLoadingText();
	}

	start() {
		this.preloadScene(this.getScene());

		this.schedule(this.showFps, 1);
	}

	getCurrentScene() {
		return this.currentScene;
	}

	async hideOverlay() {
		await this.closeSceneEffect();
	}

	animLoadingText() {
		this.lbLoading.node.active = true;
		let text = "...";
		let arr = text.split("");
		//console.log(arr);
		let txtIndex = 0;
		let load = ()=>{
			let txt = "LOADING";
			let max = txtIndex;
			if(max > arr.length) {
				max = arr.length;
			}
			for (let i = 0; i < max; i++) {
				txt += arr[i];				
			}
			this.lbLoading.string = txt;
			txtIndex++;
			if(txtIndex > arr.length + 3) {
				txtIndex = 0;
			}
		}
		this.schedule(load, 0.1);
	}

	loadSceneAsync(sceneName: string, autoHideOverlay: boolean = true, direct: boolean = false) {
		if (!!this.loadingScene || this.loadingScene === sceneName) {
			cc.error(`Scene ${sceneName} is loading!!`);
			return;
		}
		if (!sceneName || typeof sceneName !== "string") {
			cc.error("Cannot load empty scene!!");
			return;
		}
		this.currentScene = sceneName;
		this.loadingScene = sceneName;
		//reset
		this.blockEvent.active = true;
		if (!this.useAnim) {
			this.overlay.cleanup();
			this.overlay.active = true;
			this.overlay.opacity = 0;
		}
		if (direct) {
			cc.director.loadScene(this.loadingScene, this.onLaunched.bind(this));
		} else {
			this.openSceneEffect(() => cc.director.loadScene(this.loadingScene, this.onLaunched.bind(this)));
		}
		this.autoHideOverlay = autoHideOverlay;
	}

	onLaunched() {
		//console.log("onLaunched");
		PluginManager.instance.logEvent(AnalyticEvent.load_scene, { "scene_name": this.currentScene });
		this.loadedScene = this.loadingScene;
		this.loadingScene = "";
		this.lbLoading.node.active = false;
		if (this.autoHideOverlay) {
			this.scheduleOnce(()=>{
				this.closeSceneEffect();
			}, 0.1);
		}
	}

	preloadScene(generator: Generator) {
		let next: any = generator.next();
		if (!!next.done) return;
		let scene = next.value;
		cc.director.preloadScene(scene, (completeCount, totalCount, item) => {
		}, (err) => {
			this.preloadScene(generator);
		});
	}

	fixSizeSprite() {
		this.spr_BGLeft.width = cc.winSize.width / 2;
		this.spr_BGLeft.height = cc.winSize.height;
		this.spr_BGLeft.y = 0;

		this.spr_BGRight.width = cc.winSize.width / 2;
		this.spr_BGRight.height = cc.winSize.height;
		this.spr_BGRight.y = 0;

	}

	openSceneEffect(onFinished: Function = () => { }) {
		if (this.useAnim) {
			this.overlay.active = true;
			this.blockEvent.active = true;
			this.loadSceneAnim.off("finished");
			SoundManager.playEFSound(Sound.card_slide);
			this.loadSceneAnim.on("finished", () => {
				if (!!onFinished) {
					onFinished()
				}
			});
			this.loadSceneAnim.play("scene_loading_open");
		}
		else {
			this.fadeInAction.stop();
			this.fadeInAction.start();
		}
		this.lbVersion.string = DataManager.instance.VERSION;
	}

	async closeSceneEffect() {
		return new Promise((res:any, rej) => {
			if (this.useAnim) {
				this.loadSceneAnim.off("finished");
				SoundManager.playEFSound(Sound.card_slide);
				this.loadSceneAnim.on("finished", () => {
					res();
					if (!!this.overlay) {
						this.blockEvent.active = false;
					}
				});
				this.loadSceneAnim.play("scene_loading_close");
			}
			else {
				this.fadeOutAction.stop();
				this.fadeOutAction.call(() => {
					res();
				}).start();
			}
			this.lbVersion.string = "";
		});
	}

	*getScene() {
		if (!!this.scenes && this.scenes.length > 0) {
			for (let i = 0; i < this.scenes.length; i++) {
				const scene = this.scenes[i];
				yield scene;
			}
		}
	}

	public activeProgress(active: boolean = true, progress: number = 0) {
		progress = cc.misc.clamp01(progress);
		this.loadingPanel.active = active;
		this.loadingProgress.fillRange = progress;
		this.loadingText.string = `Loading ${Math.floor(progress * 100)}%`
	}

	public updateProgress(progress: number = 0, duration: number = 0.5, force: boolean = false, completed: () => void = () => { }) {
		progress = cc.misc.clamp01(progress);
		if (this.progressTween) {
			this.progressTween.stop();
			this.progressTween = null;
		}
		if (!!force) {
			this.loadingProgress.fillRange = progress;
			this.loadingText.string = `Loading ${Math.floor(progress * 100)}%`;
			completed();
		}
		else {
			let currentProgress = this.loadingProgress.fillRange;
			if (currentProgress > progress) {
				completed();
				return;
			}
			this.progressTween = Utils.tweenNumberX(duration, currentProgress, progress, (pr) => {
				pr = cc.misc.clamp01(pr);
				this.loadingProgress.fillRange = pr;
				this.loadingText.string = `Loading ${Math.floor(pr * 100)}%`
			}, () => {
				this.progressTween = null;
				completed();
			}).start();
		}
	}

	showFps() {
		this.lbFps.string = `${this.fps}`;
	}

	update(dt: number) {
		this.fps = Math.floor(1/dt);
	}
}