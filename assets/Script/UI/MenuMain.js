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

    onPlayMessengerPressed()
    {
        var roomId = "PR" + FBInstantHelper.getContextID();
        GSMgr.instance.enterRoomRequest(roomId, this.onEnterRoomResponse.bind(this));
    },

    onCreateRoomPressed()
    {
        UIManager.instance.showPopup("PopupCreateRoom");
    },

    onJoinRoomPressed()
    {
        UIManager.instance.showPopup("PopupJoinRoom");
    },

    onFindMatchPressed()
    {
        GSMgr.instance.findRoomRequest(this.onEnterRoomResponse.bind(this));
    },

    onEnterRoomResponse()
    {
        UIManager.instance.showMenu("MenuGame", false);
    }
});
