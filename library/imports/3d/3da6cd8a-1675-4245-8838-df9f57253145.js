"use strict";
cc._RF.push(module, '3da6c2KFnVCRYg4359XJTFF', 'MenuGame');
// Script/MenuGame.js

"use strict";

var MenuScene = require("MenuScene");

cc.Class({
    extends: MenuScene,

    properties: {
        onlineList: require("OnlineList")
    },

    addPlayer: function addPlayer(player) {
        this.onlineList.addPlayer(player);
    },
    removePlayer: function removePlayer(player) {
        this.onlineList.removePlayer(player);
    },
    requestSeat: function requestSeat(sender, seat) {
        console.log("request Seat");
        GSMgr.instance.requestSeat(parseInt(seat));
    }
});

cc._RF.pop();