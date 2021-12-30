import Game from "../../Game";
import { Sound } from "../sound/Sound";
import SoundManager from "../sound/SoundManager";
import Color from "../../utils/Color";
import CardData from "./CardData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Card extends cc.Component {

    data: CardData = null;

    flipTween: cc.Tween = null;

    @property(cc.Sprite)
    sprite: cc.Sprite = null;


    flip(callback: Function = null, delay: number = 0) {
        SoundManager.playEFSound(Sound.SFX_CARD_FLIP);
        this.updateFrame();  
        let duration = 0.4;
        let scaleX = this.node.scaleX;
        if (this.flipTween) {
            this.flipTween.stop();
            this.flipTween = null;
        }
        this.flipTween = cc.tween(this.node)
            .delay(delay)
            .to(duration / 2.0, { scaleX: 0 })
            .call(() => {
                this.data.isBack = !this.data.isBack;  
                this.updateFrame();                             
            })
            .to(duration / 2.0, { scaleX: scaleX })
            .call(()=>{
                if (callback) {
                    callback();
                }
            })
            .start();
    }

    updateFrame() {
        this.node.color = Color.White;
        if(this.data){
            if(this.data.isBack){
                this.sprite.spriteFrame = Game.instance.sprBack;
            } else {
                //console.log(`${this.data.suit}-${this.data.rank}`);
                let frame = Game.instance.atlasFront.getSpriteFrame(`${this.data.suit}-${this.data.rank}`);
               //console.log(frame);
                this.sprite.spriteFrame = frame;     
            }  
        }
    }
}
