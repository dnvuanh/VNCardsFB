cc.Class({
    extends: cc.Component,

    properties: {
        loadingBar: cc.ProgressBar,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.startLoading();
    },

    startLoading()
    {
        this.InitGameSpark();
    },

    InitGameSpark()
    {
        GSMgr.instance.Init(this.LoginServer.bind(this));
        this.loadingBar.progress = 0.6;
    },

    LoginServer()
    {
        this.userId = FBInstantHelper.getPlayerID();
        GSMgr.instance.authenticationRequest(this.userId, this.userId, this.OnTryLogin.bind(this));
    },

    OnTryLogin(response)
    {
        if (response.error)
        {
            let playerName = FBInstantHelper.getPlayerName();
            let playerPhoto = FBInstantHelper.getPlayerPhoto();
            GSMgr.instance.registrationRequest(playerName, this.userId, this.userId, playerPhoto, this.OnTryRegister.bind(this));
        }
        else
        {
            this.EnterRoom();
        }
    },

    OnTryRegister(response)
    {
        if (!response.error)
        {
            this.EnterRoom();
        }
        else
        {
            //pop up error
        }
    },

    EnterRoom()
    {
        var groupId = FBInstantHelper.getContextID();
        GSMgr.instance.enterRoomRequest("Kill_13", groupId, this.onEnterRoomResponse.bind(this));
    },

    onEnterRoomResponse(response)
    {
        console.log(response);
        if (!response.error)
        {
            this.LoadGameScene();
        }
    },

    LoadGameScene()
    {
        cc.director.preloadScene("Game", this.Finished);
        this.loadingBar.progress = 1;
    },

    Finished()
    {
        cc.director.loadScene("Game");
    }
});
