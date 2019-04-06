"use strict";
cc._RF.push(module, '7cd406IC5ZDRI6eEwFTyXcS', 'GSMgr');
// Script/Manager/GSMgr.js

"use strict";

var GSMgr = cc.Class({
    extends: cc.Component,

    properties: {
        APIKey: cc.String,
        Secret: cc.String
    },

    statics: {
        instance: null
    },

    ctor: function ctor() {},

    onLoad: function onLoad() {
        GSMgr.instance = this;
        cc.game.addPersistRootNode(this.node);
        this.RTMessagesListeners = {};
    },
    Init: function Init(callback) {
        this.Inited = false;
        this.GameSparks = new GameSparks();
        this.callbackInit = callback;

        this.GameSparks.initPreview({
            key: this.APIKey,
            secret: this.Secret,
            credential: "",
            onNonce: this.onNonce.bind(this),
            onInit: this.onInit.bind(this),
            onMessage: this.onMessage.bind(this),
            logger: console.log
        });
        this.initRTSession();
    },
    onNonce: function onNonce(nonce) {
        return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(nonce, this.Secret));
    },
    onInit: function onInit() {
        this.Inited = true;
        this.callbackInit();
    },
    onMessage: function onMessage(message) {
        switch (message["@class"]) {
            case ".MatchFoundMessage":
                GameMgr.instance.OnMatchFound(message);
                var accessToken = message["accessToken"];
                var host = message["host"];
                var port = message["port"];
                this.myRTSession.stop();
                if (this.myTimer) {
                    clearTimeout(this.myTimer);
                }
                this.myTimer = setInterval(this.mainRTLoop.bind(this), 10);
                this.myRTSession.start(accessToken, host, port);
                break;

            case ".MatchUpdatedMessage":
                GameMgr.instance.OnMatchUpdate(message);
                break;
            case ".AuthenticationResponse":
                GameMgr.instance.UpdateUserInfo(message);
                break;
        }
    },
    registrationRequest: function registrationRequest(displayName, username, password, photo, onResponse) {
        var request = {};
        request["displayName"] = displayName;
        request["userName"] = username;
        request["password"] = password;
        request["scriptData"] = {
            "InstantID": username,
            "Photo": photo
        };
        this.GameSparks.sendWithData("RegistrationRequest", request, onResponse);
    },
    authenticationRequest: function authenticationRequest(username, password, onResponse) {
        var request = {};
        request["userName"] = username;
        request["password"] = password;

        this.GameSparks.sendWithData("AuthenticationRequest", request, onResponse);
    },
    enterRoomRequest: function enterRoomRequest(gameType, groupName, onResponse) {
        var request = {};
        request["matchShortCode"] = gameType;
        request["matchGroup"] = groupName;
        request["skill"] = 0;

        this.GameSparks.sendWithData("MatchmakingRequest", request, onResponse);
    },
    createChallengeRequest: function createChallengeRequest(shortCode, minPlayers, maxPlayers, onResponse) {
        var request = {};
        request["challengeShortCode"] = shortCode;
        request["maxPlayers"] = maxPlayers;
        request["minPlayers"] = minPlayers;
        request["accessType"] = "PUBLIC";
        request["endTime"] = "2030-07-24T00:53Z";

        this.GameSparks.sendWithData("CreateChallengeRequest", request, onResponse);
    },
    initRTSession: function initRTSession() {
        this.myTimer = null;
        this.numCycles = 0;
        this.myRTSession = {
            started: false,
            onPlayerConnect: this.onPlayerConnected.bind(this),
            onPlayerDisconnect: this.onPlayerDisconnected.bind(this),
            onReady: this.onSessionReady.bind(this),
            onPacket: this.onPacketReceived.bind(this),
            session: null,
            start: this.startRTSession.bind(this),
            stop: this.stopRTSession.bind(this),
            log: this.log.bind(this)
        };
    },
    onPlayerConnected: function onPlayerConnected(res) {
        console.log("onPlayerConnectedCB", res);
    },
    onPlayerDisconnected: function onPlayerDisconnected(res) {
        console.log("onPlayerDisconnected", res);
    },
    onSessionReady: function onSessionReady(res) {
        cc.log("onSessionReady", res);
    },
    onPacketReceived: function onPacketReceived(res) {
        this.triggerCallback(res.opCode, res.data);
    },
    startRTSession: function startRTSession(connectToken, host, port) {
        var index = host.indexOf(":");
        var theHost;

        if (index > 0) {
            theHost = host.slice(0, index);
        } else {
            theHost = host;
        }

        console.log(theHost + " : " + port);

        this.myRTSession.session = GameSparksRT.getSession(connectToken, theHost, port, this.myRTSession);
        if (this.myRTSession.session != null) {
            this.myRTSession.started = true;

            this.myRTSession.session.start();
        } else {
            this.myRTSession.started = false;
        }
    },
    stopRTSession: function stopRTSession() {
        this.myRTSession.started = false;

        if (this.myRTSession.session != null) {
            this.myRTSession.session.stop();
        }
    },
    log: function log(message) {
        var peers = "|";

        for (var index in this.myRTSession.session.activePeers) {
            peers = peers + this.myRTSession.session.activePeers[index] + "|";
        }

        console.log(this.myRTSession.session.peerId + ": " + message + " peers:" + peers);
    },
    mainRTLoop: function mainRTLoop() {
        if (this.myRTSession.started) {
            this.myRTSession.session.update();

            var data = RTData.get();

            data.setLong(1, this.numCycles);

            this.myRTSession.session.sendRTData(1, GameSparksRT.deliveryIntent.RELIABLE, data, []);

            this.numCycles++;
        }
    },
    registerOpCodeCallback: function registerOpCodeCallback(opCode, callback) {
        if (!this.RTMessagesListeners[opCode]) {
            this.RTMessagesListeners[opCode] = [];
        }
        this.RTMessagesListeners[opCode].push(callback);
    },
    triggerCallback: function triggerCallback(opCode, data) {
        var listeners = this.RTMessagesListeners[opCode];
        if (listeners) {
            for (var i in listeners) {
                listeners[i](data);
            }
        }
    },
    sendRTData: function sendRTData(code, data) {
        this.myRTSession.session.sendRTData(code, GameSparksRT.deliveryIntent.RELIABLE, data, [0]);
    },


    //game
    requestSeat: function requestSeat(seat) {
        var data = RTData.get();
        data.setLong(1, seat);

        this.sendRTData(ServerCode.RQ_ENTER_SEAT, data);
    },
    requestPlayerReady: function requestPlayerReady(isReady) {
        var data = RTData.get();
        data.setLong(1, isReady ? 1 : 0);

        this.sendRTData(ServerCode.RQ_PLAYER_READY, data);
    },
    leaveSeat: function leaveSeat(isLeave) {
        var data = RTData.get();
        data.setLong(1, isLeave);

        this.sendRTData(ServerCode.RQ_LEAVE_SEAT, data);
    },
    startGame: function startGame() {
        var data = RTData.get();
        data.setLong(1, 102);
        this.sendRTData(ServerCode.RQ_START_GAME, data);
    },
    throwCards: function throwCards(cards) {
        var cardString = JSON.stringify(cards);
        var data = RTData.get();
        data.setString(1, cardString);
        this.sendRTData(ServerCode.RQ_THROW_CARDS, data);
    },
    skipTurn: function skipTurn() {
        var data = RTData.get();
        data.setLong(1, 1);
        this.sendRTData(ServerCode.RQ_SKIP_TURN, data);
    }
});

cc._RF.pop();