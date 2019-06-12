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
        let roomType = (roomId.indexOf("PR") == 0) ? "Kill_13_Pri":"Kill_13_Pub";

        GSMgr.instance.enterRoomRequest(roomType, roomId, this.onJoinRoomResponse.bind(this));
    },

    onJoinRoomResponse()
    {
        this.Close();
        UIManager.instance.showMenu("MenuGame", false);
    }
});
