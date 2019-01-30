(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Game/GameMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a5fb64GKmdDNKpXe7dabX33', 'GameMgr', __filename);
// Script/Game/GameMgr.js

"use strict";

var GameState = {
    PENDING: 0,
    WAIT: 1,
    STARTED: 2,
    OVER: 3
};

var GameMgr = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null
    },

    onLoad: function onLoad() {
        GameMgr.instance = this;
        cc.game.addPersistRootNode(this.node);
        this.matchData = {};
    },
    start: function start() {
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_ENTER_SEAT, this.onPlayerEnterSeat.bind(this));
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_LEAVE_SEAT, this.onPlayerLeaveSeat.bind(this));
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_LOAD_MATCH, this.onMatchLoad.bind(this));
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_HOST_CHANGE, this.onHostChange.bind(this));
    },
    onInit: function onInit() {
        this.startGameScene = true;
        this.state = GameState.PENDING;
    },
    OnMatchFound: function OnMatchFound(message) {
        console.log("Game on match found " + JSON.stringify(message));
        this.onlineList = message.participants;
    },
    OnMatchUpdate: function OnMatchUpdate(message) {
        console.log("Game on match update " + JSON.stringify(message));
        this.onlineList = message.participants;
        if (message.hasOwnProperty("addedPlayers")) {
            var player = this.onlineList.filter(function (player) {
                return player.id == message.addedPlayers;
            })[0];
            UIManager.instance.addPlayer(player);
        }
        if (message.hasOwnProperty("removedPlayers")) {
            var _player = message.removedPlayers[0];
            UIManager.instance.removePlayer(_player);
        }
    },
    onMatchLoaded: function onMatchLoaded(callback) {
        this.onMatchLoadedCb = callback;
    },
    onMatchLoad: function onMatchLoad(message) {
        this.matchData = JSON.parse(message.getString(1));
        if (this.onMatchLoadedCb) this.onMatchLoadedCb();
    },
    getCurrentSeats: function getCurrentSeats() {
        if (this.matchData) return this.matchData.Seats;
        return {};
    },
    getPlayer: function getPlayer(id) {
        return this.onlineList.filter(function (player) {
            return player.id == id;
        })[0];
    },
    getOnlineList: function getOnlineList() {
        return this.onlineList;
    },
    getHost: function getHost() {
        return this.matchData.Host;
    },
    onPlayerEnterSeat: function onPlayerEnterSeat(message) {
        var playerId = message.getString(1);
        var seat = message.getLong(2);
        this.matchData.Seats[seat] = playerId;
        UIManager.instance.playerEnterSeat(this.getPlayer(playerId), seat);
    },
    onPlayerLeaveSeat: function onPlayerLeaveSeat(message) {
        var playerId = message.getString(1);
        var seat = message.getLong(2);
        this.matchData.Seats[seat] = null;
        UIManager.instance.playerLeaveSeat(seat);
    },
    onHostChange: function onHostChange(message) {
        var playerId = message.getString(1);
        this.matchData.Host = playerId;
        UIManager.instance.setHost(playerId);
    },
    onGameStart: function onGameStart() {},
    onGameOver: function onGameOver() {}
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
        //# sourceMappingURL=GameMgr.js.map
        