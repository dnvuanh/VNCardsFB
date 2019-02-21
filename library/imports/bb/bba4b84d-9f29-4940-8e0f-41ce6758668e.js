"use strict";
cc._RF.push(module, 'bba4bhNnylJQI4PQc5nWGaO', 'Loading');
// Script/Loading.js

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
        loadingTimeout: 20
    },

    start: function start() {
        this.timeout = 0;
    },
    show: function show() {
        this.node.active = true;
        this.timeout = this.loadingTimeout;
    },
    hide: function hide() {
        this.timeout = 0;
        this.node.active = false;
    },
    update: function update(dt) {
        if (this.timeout > 0) {
            this.timeout -= dt;
        } else {
            this.hide();
        }
    }
});

cc._RF.pop();