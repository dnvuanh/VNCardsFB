window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  Boot: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "80631w+RZ5H+7f9tY+E1ACU", "Boot");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        loadingBar: cc.ProgressBar
      },
      start: function start() {
        this.startLoading();
      },
      startLoading: function startLoading() {
        this.loadResource();
      },
      loadResource: function loadResource() {
        ImageCache.Init(this.InitGameSpark.bind(this));
      },
      InitGameSpark: function InitGameSpark() {
        GSMgr.instance.Init(this.LoginServer.bind(this));
        this.loadingBar.progress = .6;
      },
      LoginServer: function LoginServer() {
        this.userId = FBInstantHelper.getPlayerID();
        GSMgr.instance.authenticationRequest(this.userId, this.userId, this.OnTryLogin.bind(this));
      },
      OnTryLogin: function OnTryLogin(response) {
        if (response.error) {
          var playerName = FBInstantHelper.getPlayerName();
          var playerPhoto = FBInstantHelper.getPlayerPhoto();
          GSMgr.instance.registrationRequest(playerName, this.userId, this.userId, playerPhoto, this.OnTryRegister.bind(this));
        } else this.EnterRoom();
      },
      OnTryRegister: function OnTryRegister(response) {
        response.error || this.EnterRoom();
      },
      EnterRoom: function EnterRoom() {
        var groupId = FBInstantHelper.getContextID();
        GSMgr.instance.enterRoomRequest("Kill_13", groupId, this.onEnterRoomResponse.bind(this));
      },
      onEnterRoomResponse: function onEnterRoomResponse(response) {
        console.log(response);
        response.error || this.WaitMatchData();
      },
      WaitMatchData: function WaitMatchData() {
        GameMgr.instance.onMatchLoaded(this.LoadGameScene.bind(this));
      },
      LoadGameScene: function LoadGameScene() {
        cc.director.preloadScene("Game", this.Finished);
        this.loadingBar.progress = 1;
      },
      Finished: function Finished() {
        cc.director.loadScene("Game");
      }
    });
    cc._RF.pop();
  }, {} ],
  Config: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "89824K5fONC+5oD6NoAkjc8", "Config");
    "use strict";
    var Config = {
      API_Key: "j356603E53FA",
      API_Secret: "SCWcCimJ27E9MWBwAXn2kJ9lKes90KiC"
    };
    module.exports = Config;
    cc._RF.pop();
  }, {} ],
  FBInstantHelper: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5ed8fWDHDFIy6C45JGovLW5", "FBInstantHelper");
    "use strict";
    var FBFakeData = {
      context: {
        id: "1991595654288655"
      },
      player: {
        name: "Mayc",
        id: "TestUser03",
        photo: "default"
      }
    };
    var FBInstantHelper = cc.Class({
      isReady: function isReady() {
        return "undefined" !== typeof FBInstant;
      },
      onPause: function onPause(callback) {
        this.isReady() && FBInstant.onPause(callback);
      },
      onQuitGame: function onQuitGame() {
        if ("undefined" === typeof FBInstant) return;
        FBInstant.quit();
      },
      onShareGame: function onShareGame() {
        if ("undefined" === typeof FBInstant) return;
        FBInstant.shareAsync({
          intent: "SHARE",
          image: this.getImgBase64(),
          text: "X is asking for your help!",
          data: {
            myReplayData: "..."
          }
        }).then(function() {});
      },
      getContextID: function getContextID() {
        if ("undefined" !== typeof FBInstant) return FBInstant.context.getID();
        return FBFakeData.context.id;
      },
      getPlayerID: function getPlayerID() {
        if ("undefined" !== typeof FBInstant) return FBInstant.player.getID();
        return FBFakeData.player.id;
      },
      getPlayerName: function getPlayerName() {
        if ("undefined" !== typeof FBInstant) return FBInstant.player.getName();
        return FBFakeData.player.name;
      },
      getPlayerPhoto: function getPlayerPhoto() {
        if ("undefined" !== typeof FBInstant) return FBInstant.player.getPhoto();
        return FBFakeData.player.photo;
      },
      logEventTracking: function logEventTracking(eventName, valueToSum, param) {
        if ("undefined" === typeof FBInstant) return;
        return FBInstant.logEvent(eventName, valueToSum, param);
      }
    });
    module.exports = new FBInstantHelper();
    cc._RF.pop();
  }, {} ],
  GSMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7cd406IC5ZDRI6eEwFTyXcS", "GSMgr");
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
          this.myTimer && clearTimeout(this.myTimer);
          this.myTimer = setInterval(this.mainRTLoop.bind(this), 10);
          this.myRTSession.start(accessToken, host, port);
          break;

         case ".MatchUpdatedMessage":
          GameMgr.instance.OnMatchUpdate(message);
        }
      },
      registrationRequest: function registrationRequest(displayName, username, password, photo, onResponse) {
        var request = {};
        request["displayName"] = displayName;
        request["userName"] = username;
        request["password"] = password;
        request["scriptData"] = {
          InstantID: username,
          Photo: photo
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
        theHost = index > 0 ? host.slice(0, index) : host;
        console.log(theHost + " : " + port);
        this.myRTSession.session = GameSparksRT.getSession(connectToken, theHost, port, this.myRTSession);
        if (null != this.myRTSession.session) {
          this.myRTSession.started = true;
          this.myRTSession.session.start();
        } else this.myRTSession.started = false;
      },
      stopRTSession: function stopRTSession() {
        this.myRTSession.started = false;
        null != this.myRTSession.session && this.myRTSession.session.stop();
      },
      log: function log(message) {
        var peers = "|";
        for (var index in this.myRTSession.session.activePeers) peers = peers + this.myRTSession.session.activePeers[index] + "|";
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
        this.RTMessagesListeners[opCode] || (this.RTMessagesListeners[opCode] = []);
        this.RTMessagesListeners[opCode].push(callback);
      },
      triggerCallback: function triggerCallback(opCode, data) {
        var listeners = this.RTMessagesListeners[opCode];
        if (listeners) for (var i in listeners) listeners[i](data);
      },
      sendRTData: function sendRTData(code, data) {
        this.myRTSession.session.sendRTData(code, GameSparksRT.deliveryIntent.RELIABLE, data, [ 0 ]);
      },
      requestSeat: function requestSeat(seat) {
        var data = RTData.get();
        data.setLong(1, seat);
        this.sendRTData(ServerCode.RQ_ENTER_SEAT, data);
      }
    });
    cc._RF.pop();
  }, {} ],
  GameMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a5fb64GKmdDNKpXe7dabX33", "GameMgr");
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
      },
      start: function start() {
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_ENTER_SEAT, this.onPlayerEnterSeat.bind(this));
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_LEAVE_SEAT, this.onPlayerLeaveSeat.bind(this));
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_LOAD_MATCH, this.onMatchLoad.bind(this));
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_HOST_CHANGE, this.onHostChange.bind(this));
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
          var player = this.onlineList.filter(function(player) {
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
        this.onMatchLoadedCb && this.onMatchLoadedCb();
      },
      getCurrentSeats: function getCurrentSeats() {
        if (this.matchData) return this.matchData.Seats;
        return {};
      },
      getPlayer: function getPlayer(id) {
        return this.onlineList.filter(function(player) {
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
      }
    });
    cc._RF.pop();
  }, {} ],
  Global: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9601fdsuddIcYjtdkvZwanV", "Global");
    "use strict";
    window.FBInstantHelper = require("FBInstantHelper");
    window.Config = require("Config");
    window.GSMgr = new require("GSMgr");
    window.GameMgr = new require("GameMgr");
    window.UIManager = new require("UIManager");
    window.ServerCode = require("ServerCode");
    window.ImageCache = require("ImageCache");
    cc._RF.pop();
  }, {
    Config: "Config",
    FBInstantHelper: "FBInstantHelper",
    ImageCache: "ImageCache",
    ServerCode: "ServerCode"
  } ],
  ImageCache: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "858216Ov8NPy70BXz0rki8i", "ImageCache");
    "use strict";
    var ImageCache = cc.Class({
      ctor: function ctor() {
        this.cachedImages = {};
      },
      Init: function Init(callback) {
        this.addRes("default", "Texture/default");
        callback();
      },
      addRes: function addRes(id, path) {
        var _this = this;
        if (!this.cachedImages[id]) {
          this.cachedImages[id] = path;
          cc.loader.loadRes(path, function(err, img) {
            if (err) {
              cc.error(err);
              return;
            }
            _this.cachedImages[id] = img;
          }.bind(this));
        }
      },
      load: function load(id, URL) {
        var _this2 = this;
        if (!this.cachedImages[id]) {
          this.cachedImages[id] = URL;
          cc.loader.load(URL, function(err, img) {
            if (err) {
              cc.error(err);
              return;
            }
            _this2.cachedImages[id] = img;
          }.bind(this));
        }
      },
      addImage: function addImage(id, img) {
        this.cachedImages[id] ? console.warn("image with id " + id + " is already in cached list") : this.cachedImages[id] = img;
      },
      getImage: function getImage(id) {
        if (!this.cachedImages[id]) {
          console.error("Image id: " + id + " was not added to cached list");
          id = "default";
        }
        return this.cachedImages[id];
      },
      loadAvatar: function loadAvatar(userId, photo, callback) {
        var _this3 = this;
        "default" == photo ? callback(new cc.SpriteFrame(this.cachedImages[photo])) : this.cachedImages[userId] ? callback(new cc.SpriteFrame(this.cachedImages[userId])) : cc.loader.load(photo, function(err, img) {
          err && callback(null);
          _this3.cachedImages[userId] = img;
          callback(new cc.SpriteFrame(_this3.cachedImages[userId]));
        }.bind(this));
      },
      getSprite: function getSprite(id) {
        return new cc.SpriteFrame(this.getImage(id));
      }
    });
    module.exports = new ImageCache();
    cc._RF.pop();
  }, {} ],
  Loading: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bba4bhNnylJQI4PQc5nWGaO", "Loading");
    "use strict";
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
        this.timeout > 0 ? this.timeout -= dt : this.hide();
      }
    });
    cc._RF.pop();
  }, {} ],
  MenuGame: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3da6c2KFnVCRYg4359XJTFF", "MenuGame");
    "use strict";
    var MenuScene = require("MenuScene");
    cc.Class({
      extends: MenuScene,
      properties: {
        onlineList: require("OnlineList"),
        SeatMgr: require("SeatMgr")
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
      }
    });
    cc._RF.pop();
  }, {
    MenuScene: "MenuScene",
    OnlineList: "OnlineList",
    SeatMgr: "SeatMgr"
  } ],
  MenuScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c5a69Hks0tOc6g23ZU/RhsF", "MenuScene");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {}
    });
    cc._RF.pop();
  }, {} ],
  OnlineList: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d40495QQd5JxZ/RsnyKE6qY", "OnlineList");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        listNode: cc.Node,
        onlinePlayer: cc.Prefab
      },
      start: function start() {
        this.Init();
      },
      Init: function Init() {
        var _this = this;
        var list = GameMgr.instance.getOnlineList();
        list.forEach(function(it) {
          _this.addPlayer(it);
        });
      },
      addPlayer: function addPlayer(player) {
        var _this2 = this;
        var playerNode = cc.instantiate(this.onlinePlayer);
        playerNode.getComponent("OnlinePlayer").display(player.id, player.scriptData.Photo, player.displayName, function() {
          playerNode.parent = _this2.listNode;
          playerNode.name = player.id;
        });
      },
      removePlayer: function removePlayer(player) {
        var playerNode = this.listNode.getChildByName(player);
        playerNode && playerNode.destroy();
      }
    });
    cc._RF.pop();
  }, {} ],
  OnlinePlayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8d713FALlRLVrvU+8BCpXSL", "OnlinePlayer");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        avatar: cc.Sprite,
        displayName: cc.Label
      },
      display: function display(userId, photo, name, callback) {
        var _this = this;
        this.userId = userId;
        this.displayName.string = name;
        "default" != photo ? ImageCache.loadAvatar(userId, photo, function(imgSprite) {
          imgSprite ? _this.avatar.spriteFrame = imgSprite : console.log("Error while loading user avatar " + userId);
          callback();
        }) : callback();
      }
    });
    cc._RF.pop();
  }, {} ],
  SeatDisplay: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4ddfe7i0wlOipA2CLsOlSkc", "SeatDisplay");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        displayNode: cc.Node,
        avatar: cc.Sprite,
        userName: cc.Label,
        money: cc.Label,
        hostIcon: cc.Node
      },
      onLoad: function onLoad() {
        this.displayNode.active = false;
        this.hostIcon.active = false;
      },
      display: function display(playerInfo) {
        var _this = this;
        this.playerId = playerInfo.id;
        var photo = playerInfo.scriptData.Photo;
        var displayName = playerInfo.displayName;
        ImageCache.loadAvatar(this.playerId, photo, function(imgSprite) {
          imgSprite ? _this.avatar.spriteFrame = imgSprite : console.log("Error while loading user avatar " + _this.playerId);
          _this.userName.string = displayName;
          _this.displayNode.active = true;
        });
      },
      getPlayerId: function getPlayerId() {
        return this.playerId;
      },
      remove: function remove() {
        this.playerId = null;
        this.hostIcon.active = false;
        this.displayNode.active = false;
      },
      setHost: function setHost(isHost) {
        this.hostIcon.active = isHost;
      }
    });
    cc._RF.pop();
  }, {} ],
  SeatMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "74de1Lk4mZPVZQQT0cxQyC0", "SeatMgr");
    "use strict";
    cc.Class({
      extends: cc.Component,
      start: function start() {
        var seats = GameMgr.instance.getCurrentSeats();
        for (var seat in seats) {
          var playerId = seats[seat];
          if (playerId) {
            var playerInfo = GameMgr.instance.getPlayer(playerId);
            this.onPlayerEnter(playerInfo, seat);
          }
        }
        var host = GameMgr.instance.getHost();
        host && this.setHost(host);
      },
      onPlayerEnter: function onPlayerEnter(playerInfo, seat) {
        if (seat < this.node.children.length) {
          var seatDisplay = this.node.children[seat].getComponent("SeatDisplay");
          seatDisplay.display(playerInfo);
        }
      },
      onPlayerLeave: function onPlayerLeave(seat) {
        if (seat < this.node.children.length) {
          var seatDisplay = this.node.children[seat].getComponent("SeatDisplay");
          seatDisplay.remove();
        }
      },
      setHost: function setHost(playerId) {
        for (var i = 0; i < this.node.children.length; i++) {
          var seatDisplay = this.node.children[i].getComponent("SeatDisplay");
          seatDisplay && seatDisplay.getPlayerId() == playerId ? seatDisplay.setHost(true) : seatDisplay && seatDisplay.setHost(false);
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  ServerCode: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "098f25tA1lNC7hv0OFUcAve", "ServerCode");
    "use strict";
    var ServerCode = {
      RQ_LOAD_MATCH: 999,
      RQ_ENTER_SEAT: 1e3,
      RQ_LEAVE_SEAT: 1001,
      RP_LOAD_MATCH: 1999,
      RP_ENTER_SEAT: 2e3,
      RP_LEAVE_SEAT: 2001,
      RP_HOST_CHANGE: 2100,
      RP_REQUEST_ERROR: 5e3,
      ERROR_DUPLICATED_SEAT: 5001
    };
    module.exports = ServerCode;
    cc._RF.pop();
  }, {} ],
  UIManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6fdc0OYmpFA16vQr4DRUDer", "UIManager");
    "use strict";
    var Loading = require("Loading");
    var UIManager = cc.Class({
      extends: cc.Component,
      properties: {
        loadingscreen: Loading,
        MenuGame: require("MenuGame")
      },
      statics: {
        instance: null
      },
      onLoad: function onLoad() {
        UIManager.instance = this;
        this.MenuStack = [];
        this.CurrentMenu = null;
      },
      start: function start() {
        GameMgr.instance.onInit();
      },
      showLoading: function showLoading(display) {
        display ? this.loadingscreen.show() : this.loadingscreen.hide();
      },
      showMenu: function showMenu(menuName) {
        var closeCurrent = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        var menu = this.node.getChildByName(menuName);
        if (null != menu) {
          menu.active = true;
          this.MenuStack.push(menuName);
          this.CurrentMenu = menuName;
        }
        if (this.MenuStack.length > 1) {
          var lastMenu = this.node.getChildByName(this.MenuStack[this.MenuStack.length - 2]);
          lastMenu.active = false;
          closeCurrent && this.MenuStack.splice(this.MenuStack.length - 2, 1);
        }
        return menu;
      },
      closeCurrentMenu: function closeCurrentMenu() {
        if (this.MenuStack.length > 1) {
          var nextMenu = this.node.getChildByName(this.MenuStack[this.MenuStack.length - 2]);
          nextMenu.active = true;
        }
        var menu = this.node.getChildByName(this.CurrentMenu);
        menu.active = false;
        this.MenuStack.splice(this.MenuStack.length - 1, 1);
        this.CurrentMenu = this.MenuStack[this.MenuStack.length];
      },
      closeAllMenu: function closeAllMenu() {
        var childs = this.node.children;
        childs.forEach(function(element) {
          element.active = false;
        });
      },
      initOnlineList: function initOnlineList() {
        this.onlineList.Init();
      },
      addPlayer: function addPlayer(player) {
        this.MenuGame.addPlayer(player);
      },
      removePlayer: function removePlayer(player) {
        console.log(player);
        this.MenuGame.removePlayer(player);
      },
      playerEnterSeat: function playerEnterSeat(playerInfo, seat) {
        this.MenuGame.playerEnterSeat(playerInfo, seat);
      },
      playerLeaveSeat: function playerLeaveSeat(seat) {
        this.MenuGame.playerLeaveSeat(seat);
      },
      setHost: function setHost(playerId) {
        this.MenuGame.setHost(playerId);
      }
    });
    cc._RF.pop();
  }, {
    Loading: "Loading",
    MenuGame: "MenuGame"
  } ]
}, {}, [ "Boot", "Config", "Global", "ServerCode", "GameMgr", "Loading", "GSMgr", "UIManager", "ImageCache", "MenuGame", "MenuScene", "OnlineList", "OnlinePlayer", "SeatDisplay", "SeatMgr", "FBInstantHelper" ]);
//# sourceMappingURL=project.dev.js.map