"use strict";
cc._RF.push(module, '81fccvWkIlHqK5sAkp8yQCD', 'Notification');
// Script/Manager/Notification.js

"use strict";

var Notification = cc.Class({
    extends: cc.Component,

    properties: {
        text: cc.Label,
        alpha: cc.Node,
        timeDisplay: 2,
        fadeDistance: 50
    },

    statics: {
        instance: null
    },

    onLoad: function onLoad() {
        this.queue = [];
        Notification.instance = this;
    },
    start: function start() {
        this.cachePosY = this.text.node.y;
        this.scrolling = false;
    },
    display: function display(text) {
        var _this = this;

        this.text.string = text;
        this.text.node.opacity = 0;
        this.text.node.y = this.cachePosY + this.fadeDistance;
        this.scrolling = true;
        var fadeIn = cc.spawn(cc.moveTo(0.2, cc.v2(0, this.cachePosY)), cc.fadeIn(0.2));

        var fadeOut = cc.spawn(cc.moveTo(0.2, cc.v2(0, this.cachePosY - this.fadeDistance)), cc.fadeOut(0.2));

        this.text.node.runAction(cc.sequence(fadeIn, cc.delayTime(1.6), fadeOut, cc.delayTime(0.1), cc.callFunc(function () {
            return _this.scrolling = false;
        })));
    },
    add: function add(text) {
        this.queue.push(text);
    },
    update: function update(dt) {
        if (this.queue.length > 0 && !this.scrolling) {
            this.display(this.queue[0]);
            this.queue.splice(0, 1);
        }
    }
});

cc._RF.pop();