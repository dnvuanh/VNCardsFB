var PopupScene = require("PopupScene");

cc.Class({
    extends: PopupScene,

    properties: {
        Private: cc.Toggle,
        RoomId: cc.EditBox,
    },

    OnJoinButtonPressed()
    {
        SoundMgr.instance.play("buttonClick");
        let roomId = this.RoomId.string;
        GSMgr.instance.enterRoomRequest(roomId, this.onJoinRoomResponse.bind(this));
    },

    onJoinRoomResponse()
    {
        UIManager.instance.closeCurrentPopup();
        UIManager.instance.showMenu("MenuGame", false);
    }
});
