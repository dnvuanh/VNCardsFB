var PopupScene = require("PopupScene");

cc.Class({
    extends: PopupScene,

    properties: {
        Private: cc.Toggle,
        RoomId: cc.EditBox,
    },

    OnJoinButtonPressed()
    {
        let roomId = this.RoomId.string;
        
        GSMgr.instance.enterRoomRequest(roomId, this.onJoinRoomResponse.bind(this));
    },

    onJoinRoomResponse()
    {
        UIManager.instance.closeCurrentPopup();
        UIManager.instance.showMenu("MenuGame", false);
    }
});
