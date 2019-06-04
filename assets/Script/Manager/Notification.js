var Notification = cc.Class({
    extends: cc.Component,

    properties: {
        text: cc.Label,
        alpha: cc.Node,
        timeDisplay: 2,
        fadeDistance: 50,
    },

    statics: {
        instance: null
    },

    onLoad() {
        this.queue = [];
        Notification.instance = this;
    },

    start() {
        this.cachePosY = this.text.node.y;
        this.scrolling = false;
    },

    display(text) {
        this.text.string = text;
        this.text.node.opacity = 0;
        this.text.node.y = this.cachePosY + this.fadeDistance;
        this.text.node.active = true;
        this.scrolling = true;
        let fadeIn = cc.spawn(
            cc.moveTo(0.2, cc.v2(0, this.cachePosY)),
            cc.fadeIn(0.2));

        let fadeOut = cc.spawn(cc.moveTo(0.2,
            cc.v2(0, this.cachePosY - this.fadeDistance)),
            cc.fadeOut(0.2));

        this.text.node.runAction(cc.sequence(fadeIn,
                                 cc.delayTime(1.6),
                                 fadeOut,
                                 cc.delayTime(0.1),
                                 cc.callFunc(() => {
                                            this.text.node.active = false;
                                            this.scrolling = false;
                                        }
                                 )));
    },

    add(text) {
        this.queue.push(text);
    },

    update(dt) {
        if (this.queue.length > 0 && !this.scrolling) {
            this.display(this.queue[0]);
            this.queue.splice(0, 1);
        }
    },


    clearAll()
    {
        this.queue = [];
        this.text.node.stopAllActions();
        this.text.node.active = false;
        this.scrolling = false;
    }
});
