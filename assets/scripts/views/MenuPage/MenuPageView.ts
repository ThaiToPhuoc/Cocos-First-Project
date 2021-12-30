const { ccclass, property } = cc._decorator;

@ccclass
export default class MenuPageView extends cc.Component {

    public static instance: MenuPageView = null;

    @property(cc.PageView)
    pageView: cc.PageView = null;

    /* @property(cc.Node)
    background: cc.Node = null; */

    /* backgroundTween: cc.Tween = null; */

    onLoad() {
        MenuPageView.instance = this;
    }

    start() {       
        this.setPage(2, 0);
    }

    setPage(page: number, time: number) {
        /* if (this.backgroundTween) {
            this.backgroundTween.stop();
            this.backgroundTween = null;
        }
        this.backgroundTween = cc.tween(this.background)
            .to(Config.BACKGROUND_SCROLL_TIME, { position: cc.v3(100 * (2 - page), this.background.position.y, 0)}, { easing: Easing.smooth })
            .start(); */
        this.pageView.scrollToPage(page, time);    
        
    }
}
