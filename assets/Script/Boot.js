cc.Class({
    extends: cc.Component,

    properties: {
        loadingBar: cc.ProgressBar,
        username: cc.EditBox,
        quickLogin: cc.Node,
        loginBox: cc.Node,
        transitionFrame: cc.Node
    },

    onLoad () {
        this.quickLogin.active = false;
        this.loadingBar.node.active = false;
    },

    start () {
        if(FBInstantHelper.isReady()) {
            this.userId = FBInstantHelper.getPlayerID();
            this.startLoading();
        }
        else
        {
            if (cc.sys.platform == cc.sys.DESKTOP_BROWSER)
                this.username.string = Utils.generateId(window, screen, navigator);
        }
        this.progressPercent = 0;
        this.nextProgressPercent = 0;
    },

    loginButtonClick() {
        this.userId = this.username.string;
        this.startLoading();
    },

    quickLoginButtonClick(sender, id) {
        this.userId = id;
        this.startLoading();
    },

    startLoading()
    {
        this.loginBox.active = false;
        this.quickLogin.active = false;
        this.loadingBar.node.active = true;
        this.loadResource();
    },

    loadResource()
    {
        ImageCache.Init(this.LoadSoundGame.bind(this));
        this.nextProgressPercent = 0.3;
    },

    LoadSoundGame()
    {
        SoundMgr.instance.preload(this.LoadGameScene.bind(this));
        this.nextProgressPercent = 0.5;
    },

    LoadGameScene()
    {
        cc.director.preloadScene("Game", this.InitGameSpark.bind(this));
        this.nextProgressPercent = 0.8;
    },

    InitGameSpark()
    {
        this.nextProgressPercent = 1;
        GSMgr.instance.Init(this.LoginServer.bind(this));
    },

    LoginServer()
    {      
        GSMgr.instance.authenticationRequest(this.userId, this.userId, this.OnTryLogin.bind(this), this.onPlayerLoad.bind(this));
    },

    OnTryLogin(response)
    {
        if (response.error)
        {
            let playerName = FBInstantHelper.getPlayerName();
            let playerPhoto = FBInstantHelper.getPlayerPhoto();
            if(playerName == "Mayc") 
            {
                playerName = this.userId;
            }
            GSMgr.instance.registrationRequest(playerName, this.userId, this.userId, playerPhoto, this.OnTryRegister.bind(this));
        }
        else
        {
            this.waitForUserProfile();
        }
    },

    onPlayerLoad()
    {
        this.onPlayerLoaded = true;
    },

    waitForUserProfile()
    {
        if (this.onPlayerLoaded)
        {
            this.Finished();
        }
    },

    OnTryRegister(response)
    {
        if (!response.error)
        {
            this.Finished();
        }
        else
        {
            //pop up error
        }
    },

    Finished()
    {
        let switchScene = cc.sequence(cc.callFunc(()=>{
                                        this.transitionFrame.runAction(cc.fadeIn(0.2));
                                      }), 
                                      cc.delayTime(0.2), 
                                      cc.callFunc(()=>{
                                        cc.director.loadScene("Game");
                                      }));
                                      
        this.node.runAction(switchScene);
    },

    update(dt)
    {
        if (this.progressPercent < this.nextProgressPercent)
        {
            this.progressPercent += dt;
            this.loadingBar.progress = this.progressPercent;
        }
    }
});
