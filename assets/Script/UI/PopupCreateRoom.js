var PopupScene = require("PopupScene");
cc.Class({
    extends: PopupScene,

    properties: {
        Private: cc.Toggle,
        RoomId: cc.EditBox,
    },

    onCreate()
    {
        console.log("RoomId " + this.RoomId.string);
        if (this.Private.isChecked)
        {
            console.log("Create private room");
        }
    }
})
