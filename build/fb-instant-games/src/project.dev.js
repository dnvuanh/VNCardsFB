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
        this.InitGameSpark();
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
        response.error || this.LoadGameScene();
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
        id: "1594416347337301"
      },
      player: {
        name: "Mayb",
        id: "TestUser02",
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
          this.startRTSession(accessToken, host, port);
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
        cc.log("onPacketReceived", res);
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
      },
      OnMatchFound: function OnMatchFound(message) {
        console.log("Game on match found " + JSON.stringify(message));
        this.onlineList = message.participants;
      },
      OnMatchUpdate: function OnMatchUpdate(message) {
        console.log("Game on match update " + JSON.stringify(message));
        this.onlineList = message.participants.filter(function(player) {
          return player.online;
        });
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
      getOnlineList: function getOnlineList() {
        return this.onlineList;
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
    cc._RF.pop();
  }, {
    Config: "Config",
    FBInstantHelper: "FBInstantHelper",
    ServerCode: "ServerCode"
  } ],
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
  }, {
    MenuScene: "MenuScene",
    OnlineList: "OnlineList"
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
        var playerNode = cc.instantiate(this.onlinePlayer);
        playerNode.getComponent("OnlinePlayer").display(player.id, player.scriptData.Photo, player.displayName);
        playerNode.parent = this.listNode;
        playerNode.name = player.id;
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
      display: function display(userId, photo, name) {
        var _this = this;
        this.userId = userId;
        "default" != photo && cc.loader.load(photo, function(err, img) {
          if (err) {
            cc.error(err);
            return;
          }
          _this.avatar.spriteFrame = new cc.SpriteFrame(img);
        }.bind(this));
        this.displayName.string = name;
      }
    });
    cc._RF.pop();
  }, {} ],
  ServerCode: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "098f25tA1lNC7hv0OFUcAve", "ServerCode");
    "use strict";
    var ServerCode = {
      RQ_ENTER_SEAT: 1e3,
      RP_ENTER_SEAT: 2e3
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
      enterRoom: function enterRoom(roomName) {
        showMenu("MenuMatchRoom");
      }
    });
    cc._RF.pop();
  }, {
    Loading: "Loading",
    MenuGame: "MenuGame"
  } ]
}, {}, [ "Boot", "Config", "FBInstantHelper", "GameMgr", "Global", "Loading", "GSMgr", "UIManager", "MenuGame", "MenuScene", "OnlineList", "OnlinePlayer", "ServerCode" ]);
//# sourceMappingURL=project.dev.js.map