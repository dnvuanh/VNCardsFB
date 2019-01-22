"use strict";
cc._RF.push(module, '80631w+RZ5H+7f9tY+E1ACU', 'Boot');
// Script/Boot.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        loadingBar: cc.ProgressBar
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {
        this.startLoading();
    },
    startLoading: function startLoading() {
        this.InitGameSpark();
    },
    InitGameSpark: function InitGameSpark() {
        GSMgr.instance.Init(this.LoginServer.bind(this));
        this.loadingBar.progress = 0.6;
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
        } else {
            this.EnterRoom();
        }
    },
    OnTryRegister: function OnTryRegister(response) {
        if (!response.error) {
            this.EnterRoom();
        } else {
            //pop up error
        }
    },
    EnterRoom: function EnterRoom() {
        var groupId = FBInstantHelper.getContextID();
        GSMgr.instance.enterRoomRequest("Kill_13", groupId, this.onEnterRoomResponse.bind(this));
    },
    onEnterRoomResponse: function onEnterRoomResponse(response) {
        console.log(response);
        if (!response.error) {
            this.LoadGameScene();
        }
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