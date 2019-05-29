var MenuScene = require("MenuScene");

cc.Class({
    extends: MenuScene,

    properties: {
        
    },

    start()
    {
        if (GameMgr.instance.lastMatchInfo)
        {
            GSMgr.instance.enterRoomRequest("Kill_13", GameMgr.instance.lastMatchInfo, this.onEnterRoomResponse.bind(this));
            //console.log(GameMgr.instance.lastMatchInfo);
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
