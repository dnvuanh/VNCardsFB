"use strict";
cc._RF.push(module, 'a5fb64GKmdDNKpXe7dabX33', 'GameMgr');
// Script/Game/GameMgr.js

"use strict";

var Define = require("Define");
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
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_STATE_UPDATE, this.onGameStateUpdate.bind(this));
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_GET_CARDS, this.onCardsReceived.bind(this));
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_TURN_CHANGE, this.onTurnChange.bind(this));
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_THROW_SUCCESS, this.onThrowSuccess.bind(this));
    },
    onInit: function onInit() {
        this.startGameScene = true;
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
    UpdateUserInfo: function UpdateUserInfo(message) {
        this.userId = message.userId;
    },
    getMyId: function getMyId() {
        return this.userId;
    },
    getMySeat: function getMySeat() {
        return this.MySeat;
    },
    IsMyId: function IsMyId(id) {
        return this.userId == id;
    },
    onPlayerEnterSeat: function onPlayerEnterSeat(message) {
        var playerId = message.getString(1);
        var seat = message.getLong(2);
        this.matchData.Seats[seat] = playerId;
        UIManager.instance.playerEnterSeat(this.getPlayer(playerId), seat);

        if (this.IsMyId(playerId)) {
            this.MySeat = seat;
        }
    },
    onPlayerLeaveSeat: function onPlayerLeaveSeat(message) {
        var playerId = message.getString(1);
        var seat = message.getLong(2);
        this.matchData.Seats[seat] = null;
        UIManager.instance.playerLeaveSeat(seat);

        if (this.IsMyId(playerId)) {
            this.MySeat = null;
        }
    },
    onHostChange: function onHostChange(message) {
        var playerId = message.getString(1);
        this.matchData.Host = playerId;
        UIManager.instance.setHost(playerId);
    },
    onGameStateUpdate: function onGameStateUpdate(message) {
        cc.log("onGameStateUpdate");
        this.matchData.State = message.getLong(1);
        switch (this.matchData.State) {
            case Define.GameState.WAITING:
                this.onGameStateWaiting();
                break;

            case Define.GameState.READY:
                this.onGameStateReady();
                break;
        }
    },
    onGameStateWaiting: function onGameStateWaiting() {
        if (this.IsMyId(this.matchData.Host)) UIManager.instance.enableStartButton(false);
    },
    onGameStateReady: function onGameStateReady() {
        if (this.IsMyId(this.matchData.Host)) UIManager.instance.enableStartButton(true);
    },
    onCardsReceived: function onCardsReceived(message) {
        var cards = JSON.parse(message.getString(1));
        cards.sort(function (a, b) {
            return a - b;
        });
        UIManager.instance.onCardsReceived(cards);
    },
    onTurnChange: function onTurnChange(message) {
        var playerId = message.getString(1);
        var startTime = message.getLong(2);
        var timeout = message.getLong(3);
        this.matchData.TurnKeeper = playerId;
        this.matchData.TimeBeginTurn = startTime;
        UIManager.instance.onTurnChange(playerId, startTime, timeout);
    },
    onThrowSuccess: function onThrowSuccess(message) {
        var playerId = message.getString(1);
        var cards = JSON.parse(message.getString(2));
        cc.log("THROW SUCCESS!" + cards);
        UIManager.instance.onThrowSuccess(playerId, cards);
    }
});

cc._RF.pop();