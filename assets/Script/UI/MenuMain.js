var MenuScene = require("MenuScene");

cc.Class({
    extends: MenuScene,

    properties: {
        
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
        GSMgr.instance.enterRoomRequest("Kill_13_Pri", roomId, this.onEnterRoomResponse.bind(this));
    },

    onCreateRoomPressed()
    {
        UIManager.instance.showMenu("PopupCreateRoom", false);
    },

    onJoinRoomPressed()
    {
        UIManager.instance.showMenu("PopupJoinRoom", false);
    },

    onFindMatchPressed()
    {
        let roomId = "PU" + parseInt(Date.now()%1000000);
        GSMgr.instance.findRoomRequest("Kill_13_Pub", roomId, this.onEnterRoomResponse.bind(this));
    },

    onEnterRoomResponse()
    {
        UIManager.instance.showMenu("MenuGame", false);
    }
});
