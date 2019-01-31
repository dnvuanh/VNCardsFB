var GSMgr = cc.Class({
    extends: cc.Component,

    properties: {
        APIKey: cc.String,
        Secret: cc.String,
    },
    
    statics:
    {
        instance: null,
    },

    ctor: function () {
        
    },
    
    onLoad()
    {
        GSMgr.instance = this;
        cc.game.addPersistRootNode(this.node);
        this.RTMessagesListeners = {};
    },

    Init (callback) {
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
			logger: console.log,
        });
        this.initRTSession();
    },
        
    onNonce(nonce)
    {
        return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(nonce, this.Secret));
    },
    
    onInit()
    {
        this.Inited = true;
        this.callbackInit();
    },
    
    onMessage(message)
    {
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

    registrationRequest(displayName, username, password, photo, onResponse)
    {
        var request = {};
            request["displayName"] = displayName;
            request["userName"] = username;
            request["password"] = password;
            request["scriptData"] = {
                "InstantID":username,
                "Photo":photo
            }
        this.GameSparks.sendWithData("RegistrationRequest", request, onResponse);
    },

    authenticationRequest(username, password, onResponse)
    {
        var request = {};
            request["userName"] = username;
            request["password"] = password;
        
        this.GameSparks.sendWithData("AuthenticationRequest", request, onResponse);
    },

    enterRoomRequest(gameType, groupName, onResponse)
    {
        var request = {};
            request["matchShortCode"] = gameType;
            request["matchGroup"] = groupName;
            request["skill"] = 0;
        
        this.GameSparks.sendWithData("MatchmakingRequest", request, onResponse);
    },

    createChallengeRequest(shortCode, minPlayers, maxPlayers, onResponse)
    {
        var request = {};
            request["challengeShortCode"] = shortCode;
            request["maxPlayers"] = maxPlayers;
            request["minPlayers"] = minPlayers;
            request["accessType"] = "PUBLIC";
            request["endTime"] = "2030-07-24T00:53Z";

        this.GameSparks.sendWithData("CreateChallengeRequest", request, onResponse);
    },

    initRTSession() {
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
        }
    },

    onPlayerConnected(res) {
        console.log("onPlayerConnectedCB", res);
    },

    onPlayerDisconnected(res) {
        console.log("onPlayerDisconnected", res);
    },

    onSessionReady(res) {
        cc.log("onSessionReady", res);
    },

    onPacketReceived(res) {
        this.triggerCallback(res.opCode, res.data);
    },

    startRTSession(connectToken, host, port) {
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

    stopRTSession() {
        this.myRTSession.started = false;

        if (this.myRTSession.session != null) {
            this.myRTSession.session.stop();
        }
    },

    log(message) {
        let peers = "|";

        for (var index in this.myRTSession.session.activePeers) {
            peers = peers + this.myRTSession.session.activePeers[index] + "|";
        }

        console.log(this.myRTSession.session.peerId + ": " + message + " peers:" + peers);
    },

    mainRTLoop()
    {
        if (this.myRTSession.started) {
			this.myRTSession.session.update();

			var data = RTData.get();

			data.setLong(1, this.numCycles);

            this.myRTSession.session.sendRTData(1, GameSparksRT.deliveryIntent.RELIABLE, data, []);

			this.numCycles ++;
		}
    },

    registerOpCodeCallback(opCode, callback) {
        if (!this.RTMessagesListeners[opCode]) {
            this.RTMessagesListeners[opCode] = [];
        }
        this.RTMessagesListeners[opCode].push(callback);
    },

    triggerCallback(opCode, data) {
        let listeners = this.RTMessagesListeners[opCode];
        if (listeners) {
            for (let i in listeners) {
                listeners[i](data);
            }
        }
    },

    sendRTData(code, data)
    {
        this.myRTSession.session.sendRTData(code, GameSparksRT.deliveryIntent.RELIABLE, data, [0]);
    },

    //game
    requestSeat(seat)
    {
        let data = RTData.get();
            data.setLong(1, seat);

        this.sendRTData(ServerCode.RQ_ENTER_SEAT, data);
    },

    startGame(){
        let data = RTData.get();
            data.setLong(1, 0);
        this.sendRTData(ServerCode.RQ_START_GAME, data);
    },
});