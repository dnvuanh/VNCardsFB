"use strict";
cc._RF.push(module, '80631w+RZ5H+7f9tY+E1ACU', 'Boot');
// Script/Boot.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        loadingBar: cc.ProgressBar,
        username: cc.EditBox,
        login: cc.Button
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {
        this.userId = '';
        if (FBInstantHelper.isReady()) {
            this.login.node.active = false;
            this.username.node.active = false;
            this.startLoading();
        }
    },
    loginButtonClick: function loginButtonClick() {
        this.startLoading();
    },
    quickLoginButtonClick: function quickLoginButtonClick(sender, id) {
        this.startLoading();
        this.userId = id;
    },
    startLoading: function startLoading() {
        this.loadResource();
    },
    loadResource: function loadResource() {
        ImageCache.Init(this.InitGameSpark.bind(this));
    },
    InitGameSpark: function InitGameSpark() {
        GSMgr.instance.Init(this.LoginServer.bind(this));
        this.loadingBar.progress = 0.6;
    },
    LoginServer: function LoginServer() {
        if (FBInstantHelper.isReady()) {
            this.userId = FBInstantHelper.getPlayerID();
        } else {
            if (this.userId == '') {
                this.userId = this.username.string;
            }
        }
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
            this.WaitMatchData();
        }
    },
    WaitMatchData: function WaitMatchData() //it's sent automatically when user enter room
    {
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