var PopupScene = require("PopupScene");
cc.Class({
    extends: PopupScene,

    properties: {
        Private: cc.Toggle,
        RoomId: cc.EditBox,
    },

    onCreate()
    {
        let isPrivate = this.Private.isChecked;
        let roomId = (isPrivate ? "PR" : "PU") + this.RoomId.string;

        GSMgr.instance.createRoomRequest(roomId, this.onCreateRoomResponse.bind(this));
    },

    onCreateRoomResponse()
    {
        UIManager.instance.closeCurrentPopup();
        UIManager.instance.showMenu("MenuGame", false);
    },
})
