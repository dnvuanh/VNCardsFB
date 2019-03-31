(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/CountDown.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f1a42FDouFKUreEY+CCng3/', 'CountDown', __filename);
// Script/CountDown.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        secondString: cc.Label
    },

    start: function start() {
        this.node.active = false;
    },
    show: function show(timeStart, totalSecond) {
        this.secondString.node.display = true;
        this.timeStart = timeStart;
        this.secondString.string = totalSecond;
        this.currentDisplay = totalSecond;
        this.totalSecond = totalSecond;
    },
    hide: function hide() {
        this.node.active = false;
    },
    update: function update(dt) {
        var timeNow = Date.now();
        var remainSecond = this.totalSecond - Math.floor((timeNow - this.timeStart) / 1000);
        if (remainSecond > 0) {
            if (remainSecond != this.currentDisplay) {
                this.secondString.string = remainSecond;
                this.currentDisplay = remainSecond;
            }
        } else {
            this.hide();
        }
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=CountDown.js.map
        