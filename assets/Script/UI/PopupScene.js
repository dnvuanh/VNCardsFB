var MenuScene = require("MenuScene");
cc.Class({
    extends: MenuScene,

    properties: {

    },

    onLoad()
    {
        this._super();
    },

    Close()
    {
        SoundMgr.instance.play("buttonClick");
        UIManager.instance.closeCurrentPopup();
        //action && action();
    },

    IsPopup()
    {
        return true;
    },
});
