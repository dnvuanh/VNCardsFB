"use strict";
cc._RF.push(module, '3da6c2KFnVCRYg4359XJTFF', 'MenuGame');
// Script/UI/MenuGame.js

"use strict";

var MenuScene = require("MenuScene");

cc.Class({
    extends: MenuScene,

    properties: {
        onlineList: require("OnlineList"),
        SeatMgr: require("SeatMgr"),
        ButtonLeave: cc.Node,
        ButtonStart: cc.Node,
        InGameButtons: cc.Node
    },

    start: function start() {
        this.ButtonLeave.active = false;
        this.ButtonStart.active = false;
        this.InGameButtons.active = false;
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
    },
    playerEnterSeat: function playerEnterSeat(playerInfo, seat) {
        this.SeatMgr.onPlayerEnter(playerInfo, seat);
    },
    playerLeaveSeat: function playerLeaveSeat(seat) {
        this.SeatMgr.onPlayerLeave(seat);
    },
    setHost: function setHost(playerId) {
        this.SeatMgr.setHost(playerId);
    },
    setEnableStartButton: function setEnableStartButton(enable) {
        this.ButtonStart.node.active = enable;
    }
});

cc._RF.pop();