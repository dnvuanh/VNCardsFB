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
        UIManager.instance.closeCurrentMenu();
    },

    IsPopup()
    {
        return true;
    }
});
