var MenuScene = require("MenuScene");

cc.Class({
    extends: MenuScene,

    properties: {
        
    },

    start()
    {
        if (GameMgr.instance.lastMatchInfo)
        {
            GSMgr.instance.onMessage(GameMgr.instance.lastMatchInfo);
            this.onEnterRoomResponse();
        }
    },

    onPlayMessengerPressed()
    {
        var groupId = FBInstantHelper.getContextID();
        GSMgr.instance.enterRoomRequest("Kill_13", groupId, this.onEnterRoomResponse.bind(this));
    },

    onCreateRoomPressed()
    {

    },

    onJoinRoomPressed()
    {

    },

    onFindMatchPressed()
    {

    },

    onEnterRoomResponse()
    {
        UIManager.instance.showMenu("MenuGame", true);
    }
});
