import Color from "./Color";
import Easing from "./Easing";

export default class Utils {

    public static hoursToMiliseconds(hours: number): number {
        return 1000 * 60 * 60 * hours;
    }

    public static minutesToMiliseconds(minutes: number): number {
        return 1000 * 60 * minutes;
    }

    /**
         * min (inclusive) and max (inclusive)
    */
    public static randomRangeInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static shuffle(arr: any) {
        for (let i = arr.length - 1; i > 0; i--) {
            let j = this.randomRangeInt(0, i);
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    public static convert2UnitMoney(num: number, digits: number = 1) {
        var si = [
            { value: 1, symbol: "" },
            { value: 1E3, symbol: "K" },
            { value: 1E6, symbol: "M" },
            { value: 1E9, symbol: "B" },
        ];
        var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value) {
                break;
            }
        }
        return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    }

    public static moveTo(target: cc.Node, start: cc.Node, end: cc.Node, duration: number, callback: Function = null, offset: cc.Vec2 = null, easing: string = Easing.sineInOut, delay: number = 0): cc.Tween {
        Utils.SetNodePositionFromNode(target, start);

        let endPos = end.getPosition();
        let targetParent = target.parent;
        let endParent = end.parent;

        if (targetParent !== endParent) {
            let w = endParent.convertToWorldSpaceAR(endPos);
            endPos = targetParent.convertToNodeSpaceAR(w);
        }

        if (offset) {
            endPos.x += offset.x;
            endPos.y += offset.y;
        }

        return cc.tween(target)
            .delay(delay)
            .to(duration, { position: cc.v3(endPos) }, { easing: easing })
            .call(callback).start();
    }

    public static flashingOpacity(node: cc.Node, repeat: number, cycleTime: number, callback: Function = null): cc.Tween {
        node.active = true;
        let tween = cc.tween(node)
            .repeat(repeat, cc.tween()
                .to(cycleTime / 2, { opacity: 255 })
                .to(cycleTime / 2, { opacity: 0 }))
            .call(() => {
                node.opacity = 255;
                node.color = cc.Color.WHITE;
                if (callback)
                    callback();
            })
            .start()
        return tween;
    }

    public static scaleInOut(node: cc.Node, repeat: number, cycleTime: number, margin: number, callback: Function = null): cc.Tween {
        node.active = true;
        let current = node.scale;
        let tween = cc.tween(node)
            .repeat(repeat, cc.tween()
                .to(cycleTime / 2, { scale: current + margin })
                .to(cycleTime / 2, { scale: current - margin }))
            .call(() => {
                node.scale = current;
                if (callback)
                    callback();
            })
            .start()
        return tween;
    }

    public static floatUpEntrance(node: cc.Node, callback: Function = null): cc.Tween {
        node.active = true;
        let tween = cc.tween(node)
            .set({ position: cc.v3(node.position.x, node.position.y - node.height, 0), opacity: 0 })
            .to(0.25, { position: cc.v3(node.position.x, node.position.y, 0), opacity: 255 }, { easing: "backOut" })
            .call(() => {
                if (callback) {
                    callback();
                }
            })
            .start()
        return tween;
    }

    public static sinkDownExit(node: cc.Node, duration: number = 0.25, callback: Function = null): cc.Tween {
        node.active = true;
        let tempY = node.position.y;
        let tween = cc.tween(node)
            .to(duration, { position: cc.v3(node.position.x, node.position.y - node.height, 0), opacity: 0 }, { easing: "backIn" })
            .call(() => {
                if (callback) {
                    node.position.y = tempY;
                    node.opacity = 255;
                    node.active = false;
                    callback();
                }
            })
            .start()
        return tween;
    }

    public static fadeIn(node: cc.Node, callback: Function = null, delay: number = 0, duration: number = 0.25): cc.Tween {
        node.active = true;
        //node.opacity = 0;
        let tween = cc.tween(node)
            .delay(delay)
            .to(duration, { opacity: 255 }, { easing: "smooth" })
            .call(() => {
                if (callback) {
                    callback();
                }
            })
            .start()
        return tween;
    }

    public static fadeOut(node: cc.Node, callback: Function = null, delay: number = 0, duration: number = 0.25): cc.Tween {
        //node.opacity = 255;
        let tween = cc.tween(node)
            .delay(delay)
            .to(duration, { opacity: 0 }, { easing: "smooth" })
            .call(() => {
                node.active = false;
                node.opacity = 255;
                if (callback) {
                    callback();
                }
            })
            .start()
        return tween;
    }

    public static scaleTo(node: cc.Node, value: number, duration: number = 0.25, delay: number = 0, callback: Function = null): cc.Tween {
        let tween = cc.tween(node)
            .delay(delay)
            .to(duration, { scale: value }, { easing: "smooth" })
            .call(() => {
                if (callback) {
                    callback();
                }
            })
            .start()
        return tween;
    }

    public static rotateTo(node: cc.Node, value: number, duration: number = 0.25, delay: number = 0, callback: Function = null): cc.Tween {
        let tween = cc.tween(node)
            .delay(delay)
            .to(duration, { angle: value }, { easing: "smooth" })
            .call(() => {
                if (callback) {
                    callback();
                }
            })
            .start()
        return tween;
    }

    public static tweenNumberX(duration: number, from: number, to: number, onProgress?: (progress: number) => void, onFinish?: () => void): cc.Tween {
        return cc.tween(new TweenNumberObject(from))
            .to(duration, { val: to }, {
                progress: (start, end, current, ratio) => {
                    let value = start + (end - start) * ratio;
                    if (!!onProgress) onProgress(value);
                    return value;
                }
            })
            .call(onFinish)
    }

    /**
     * Hàm này convert vị trí của fromThis sang NodeSpace của toThis
     * @param convertThis sẽ convert Node này
     * @param toThis sang NodeSpace của Node này
     */
    public static GetConvertedNodePosition(convertThis: cc.Node, toThis: cc.Node): cc.Vec3 {
        let w = convertThis.parent.convertToWorldSpaceAR(convertThis.getPosition());
        return cc.v3(toThis.parent.convertToNodeSpaceAR(w).x, toThis.parent.convertToNodeSpaceAR(w).y, 0);
    }

    /**
     * Hàm này sẽ set vị trí của Node moveThis sang vị trí của Node toThis
     * @param moveThis Node cần set vị trí
     * @param toThis Node cần lấy vị trí
     */
    public static SetNodePositionFromNode(moveThis: cc.Node, toThis: cc.Node) {
        // Lấy ra vị trí của ToThis là bao nhiêu khi so với moveThis
        let newPos = this.GetConvertedNodePosition(toThis, moveThis);

        // Gán vị trí đó cho moveThis
        moveThis.setPosition(newPos);
    }

    /* public static moveToPosition(moveThis: cc.Node, duration: number,
        toPosition: cc.Vec2, callback: Function = null): cc.Tween {
        return cc.tween(moveThis)
            .to(duration, { position: toPosition }).call(callback);
    } */

    public static moveToPosition(moveThis: cc.Node, toPosition: cc.Vec3, delay: number, duration: number, offset: cc.Vec2 = cc.Vec2.ZERO, easing: string = "", callback: Function = null): cc.Tween {
        toPosition.x += offset.x;
        toPosition.y += offset.y;
        return cc.tween(moveThis)
            .delay(delay)
            .to(duration, { position: toPosition }, { easing: easing })
            .call(callback)
            .start();
    }


    public static setActive(button: cc.Button) {
        let sprites = button.node.getComponentsInChildren(cc.Sprite);
        let labels = button.node.getComponentsInChildren(cc.Label);
        if (!button.node.active) {
            Utils.fadeIn(button.node, () => {
                button.interactable = true;
                button.node.color = Color.White;
                if(sprites) {
                    sprites.forEach(spr => spr.node.color == Color.White);
                }
                /* if(labels) {
                    labels.forEach(lb => lb.node.color == Color.White);
                } */
            }, 0, 0.25);
        } else {
            button.interactable = true;
            button.node.color = Color.White;
            sprites = button.node.getComponentsInChildren(cc.Sprite);
            if(sprites) {
                sprites.forEach(spr => spr.node.color = Color.White);
            }
            /* if(labels) {
                labels.forEach(lb => lb.node.color = Color.White);
            } */
        }

    }

    public static setDeactive(button: cc.Button) {
        button.node.color = Color.DimGray;
        button.interactable = false;
        let sprites = button.node.getComponentsInChildren(cc.Sprite);
        let labels = button.node.getComponentsInChildren(cc.Label);
        if(sprites) {        
            sprites.forEach(spr => spr.node.color = Color.DimGray);
            //console.log("setDeactive sprites");
        }
        /* if(labels) {
            labels.forEach(lb => lb.node.color = Color.DimGray);
            //console.log("setDeactive labels");
        } */
    }

    public static autoAlignHorizontal(arrayNode: Array<cc.Node> = [], callback: Function = null, duration: number = 0.25, padding: number = 20) {
        let activeItems = arrayNode.filter((p) => p.active);
        if (activeItems.length == 0) return;
        let itemWidth = activeItems[0].width * activeItems[0].scaleX;
        let totalWidth = itemWidth * activeItems.length + padding * (activeItems.length - 1);
        let x = -540 + (1080 - totalWidth) / 2 + itemWidth / 2;
        for (let i = 0; i < activeItems.length; i++) {
            let item = activeItems[i];
            cc.tween(item)
                .to(duration, { position: cc.v3(x, activeItems[0].y, 0) })
                .call(() => {
                    if (i == activeItems.length - 1) {
                        if (callback) {
                            callback();
                        }
                    }
                })
                .start();
            x += itemWidth;
            if (i < activeItems.length) {
                x += padding;
            }
        }
    }

    public static tweenNumber(target: TweenNumberObject, duration: number, to: number, onProgress?: (progress: number) => void, onFinish?: () => void): cc.Tween {
        return cc.tween(target)
            .to(duration, { val: to }, {
                progress: (start, end, current, ratio) => {
                    let value = start + (end - start) * ratio;
                    if (!!onProgress) onProgress(value);
                    return value;
                }
            })
            .call(onFinish)
            .start();
    }

    public static normalized(current: number, min: number, max: number): number {
        return (current - min) / (max - min);
    }

    public static numberWithCommas(x, fixedPoint?) {
        fixedPoint = fixedPoint || 0;
        var parts = x.toString().split('.');
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] && fixedPoint >= 0 ? "." + (fixedPoint >= 0 ? parseFloat(parts[1]).toFixed(fixedPoint) : parts[1]) : '');
    }

    public static uuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    public static timeHHMMSS(milliseconds: number): string {
        var millisecondsPerDay = 24 * 60 * 60 * 1000;
        var millisecondsPerHour = 60 * 60 * 1000;
        var millisecondsPerMinute = 60 * 1000;
        var days = Math.floor(milliseconds / millisecondsPerDay);
        var hours = Math.floor((milliseconds - days * millisecondsPerDay) / millisecondsPerHour);
        var minutes = Math.floor((milliseconds - days * millisecondsPerDay - hours * millisecondsPerHour) / millisecondsPerMinute);
        var seconds = Math.floor((milliseconds - days * millisecondsPerDay - hours * millisecondsPerHour - minutes * millisecondsPerMinute) / 1000);
        return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

}
export class TweenNumberObject extends cc.Object {
    _val: number = 0;
    constructor(from: number) {
        super();
        this.val = from;
    }

    get val() {
        return this._val;
    }

    set val(v) {
        this._val = v;
    }
}
