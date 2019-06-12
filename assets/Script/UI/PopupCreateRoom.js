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
        let roomId = isPrivate ? "PR" : "PU" + this.RoomId.string;
        let roomType = isPrivate ? "Kill_13_Pri":"Kill_13_Pub";

        GSMgr.instance.enterRoomRequest(roomType, roomId, this.onCreateRoomResponse.bind(this));
    },

    onCreateRoomResponse()
    {
        this.Close();
        UIManager.instance.showMenu("MenuGame", false);
    },
})
