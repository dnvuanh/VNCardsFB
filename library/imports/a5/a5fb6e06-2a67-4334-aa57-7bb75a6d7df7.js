"use strict";
cc._RF.push(module, 'a5fb64GKmdDNKpXe7dabX33', 'GameMgr');
// Script/Game/GameMgr.js

"use strict";

var GameMgr = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null
    },

    onLoad: function onLoad() {
        GameMgr.instance = this;
        cc.game.addPersistRootNode(this.node);
        this.matchData = {};
        this.RegisterLeave = 0;
        this.myCards = null;
        //this.matchData.PlayerReady = [];
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
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_GAME_RESULT, this.onGameResult.bind(this));
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_REGISTER_LEAVE, this.onPlayerRegisterLeave.bind(this));
        //GSMgr.instance.registerOpCodeCallback(ServerCode.RP_PLAYER_READY, this.onPlayerReady.bind(this));
        //remove design ready
    },
    onInit: function onInit() {
        this.startGameScene = true;
        //this.matchData.Host && UIManager.instance.setHost(this.matchData.Host);
        this.matchData.Seats && UIManager.instance.refreshSeats(this.matchData.Seats);
        this.myCards && UIManager.instance.onCardsReceived(this.myCards, false);
        this.matchData.TurnKeeper && UIManager.instance.onTurnChange(this.matchData.TurnKeeper, this.matchData.TimeBeginTurn, this.matchData.Timeout);
        this.matchData.CurrentCards && UIManager.instance.onThrowSuccess(this.matchData.PreviousThrowPlayerId, this.matchData.CurrentCards);
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
    getMycards: function getMycards() {
        return this.myCards;
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
    IsMeHost: function IsMeHost() {
        return this.userId == this.matchData.Host || this.matchData.Host == null;
    },
    IsHost: function IsHost(playerId) {
        return playerId == this.matchData.Host || this.matchData.Host == null;
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
    getOnlineSeatCount: function getOnlineSeatCount() {
        return Object.keys(this.matchData.Seats).length;
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
    onPlayerReady: function onPlayerReady(message) {
        var playerId = message.getString(1);
        var isReady = message.getLong(2);
        if (isReady) {
            this.matchData.PlayerReady.push(playerId);
        } else {
            var index = this.matchData.PlayerReady.indexOf(playerId);
            this.matchData.PlayerReady.splice(index, 1);
        }
        UIManager.instance.onPlayerReady(playerId, isReady);
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
        UIManager.instance.setHost(this.matchData.Host);
    },
    onGameStateUpdate: function onGameStateUpdate(message) {
        this.matchData.State = message.getLong(1);
        console.log('GameState Change ' + this.matchData.State);
        switch (this.matchData.State) {
            case Define.GameState.WAITING:
                this.onGameStateWaiting();
                break;

            case Define.GameState.READY:
                var timeStamp = message.getLong(2);
                this.onGameStateReady(timeStamp);
                break;

            case Define.GameState.GAMEOVER:
                this.onGameOver();
                break;

            case Define.GameState.STARTED:
                this.onGameStart();
                break;
        }
    },
    onGameStateWaiting: function onGameStateWaiting() {
        UIManager.instance.onGameWaiting();
    },
    onGameStateReady: function onGameStateReady(timeStamp) {
        UIManager.instance.onGameStateReady(timeStamp);
    },
    onGameOver: function onGameOver() {
        UIManager.instance.onGameOver();
    },
    onCardsReceived: function onCardsReceived(message) {
        var cards = JSON.parse(message.getString(1));
        cards.sort(function (a, b) {
            return a - b;
        });
        this.myCards = cards;
        UIManager.instance && UIManager.instance.onCardsReceived(this.myCards, true);
    },
    onTurnChange: function onTurnChange(message) {
        this.matchData.TurnKeeper = message.getString(1);
        this.matchData.TimeBeginTurn = message.getLong(2);
        this.matchData.Timeout = message.getLong(3);
        UIManager.instance.onTurnChange(this.matchData.TurnKeeper, this.matchData.TimeBeginTurn, this.matchData.Timeout);
    },
    onThrowSuccess: function onThrowSuccess(message) {
        this.matchData.PreviousThrowPlayerId = message.getString(1);
        this.matchData.CurrentCards = JSON.parse(message.getString(2));
        UIManager.instance.onThrowSuccess(this.matchData.PreviousThrowPlayerId, this.matchData.CurrentCards);
    },
    onGameResult: function onGameResult(message) {
        var scores = JSON.parse(message.getString(1));
        var playerWinId = message.getString(2);
        var playersCards = {};
        for (var i = 0, seats = this.getOnlineSeatCount(); i < seats; i++) {
            var playerId = message.getString(3 + i * 2);
            var cards = JSON.parse(message.getString(3 + i * 2 + 1));
            playersCards[playerId] = cards;
        }
        UIManager.instance.displayResult(scores, playerWinId, playersCards);
    },
    onPlayerRegisterLeave: function onPlayerRegisterLeave(message) {
        var isLeave = message.getLong(1);
        this.RegisterLeave = isLeave;
        UIManager.instance.onPlayerRegisterLeave(isLeave);
    },
    IsRegisterLeave: function IsRegisterLeave() {
        return this.RegisterLeave;
    },
    onGameStart: function onGameStart() {
        UIManager.instance.onGameStart();
    }
});

cc._RF.pop();