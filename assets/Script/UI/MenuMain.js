var MenuScene = require("MenuScene");

cc.Class({
    extends: MenuScene,

    properties: {
        playMessenger: cc.Node
    },

    onLoad()
    {
        this.playMessenger.active = FBInstantHelper.isReady();
    },

    start()
    {
        /*if (GameMgr.instance.lastMatchInfo)
        {
            GSMgr.instance.enterRoomRequest("Kill_13", GameMgr.instance.lastMatchInfo, this.onEnterRoomResponse.bind(this));
            //console.log(GameMgr.instance.lastMatchInfo);
        }*/
    },

    onEnable()
    {
        SoundMgr.instance.playMusic("music");
    },

    onPlayMessengerPressed()
    {
        SoundMgr.instance.play("buttonClick");
        var roomId = "PR" + FBInstantHelper.getContextID();
        GSMgr.instance.enterRoomRequest(roomId, this.onEnterRoomResponse.bind(this));
    },

    onCreateRoomPressed()
    {
        SoundMgr.instance.play("buttonClick");
        UIManager.instance.showPopup("PopupCreateRoom");
    },

    onJoinRoomPressed()
    {
        SoundMgr.instance.play("buttonClick");
        UIManager.instance.showPopup("PopupJoinRoom");
    },

    onFindMatchPressed()
    {
        SoundMgr.instance.play("buttonClick");
        GSMgr.instance.findRoomRequest(this.onEnterRoomResponse.bind(this));
    },

    onEnterRoomResponse()
    {
        UIManager.instance.showMenu("MenuGame", false);
    }
});
