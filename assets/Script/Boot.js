cc.Class({
    extends: cc.Component,

    properties: {
        loadingBar: cc.ProgressBar,
        username: cc.EditBox,
        login: cc.Button,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.userId = '';
        if(FBInstantHelper.isReady()) {
            this.login.node.active = false;
            this.username.node.active = false;
            this.startLoading();
        }
    },

    loginButtonClick() {
        this.startLoading();
    },

    quickLoginButtonClick(sender, id) {
        this.startLoading();
        this.userId = id;
    },

    startLoading()
    {
        this.loadResource();
    },

    loadResource()
    {
        ImageCache.Init(this.InitGameSpark.bind(this));
    },

    InitGameSpark()
    {
        GSMgr.instance.Init(this.LoginServer.bind(this));
        this.loadingBar.progress = 0.6;
    },

    LoginServer()
    {      
        if(FBInstantHelper.isReady()) {
            this.userId = FBInstantHelper.getPlayerID();
        } else {
            if(this.userId == '') {
                this.userId = this.username.string;
            }
        }
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
            this.WaitMatchData();
        }
    },

    WaitMatchData() //it's sent automatically when user enter room
    {
        GameMgr.instance.onMatchLoaded(this.LoadGameScene.bind(this));
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
