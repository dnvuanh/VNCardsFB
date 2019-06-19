var MenuScene = require("MenuScene");
cc.Class({
    extends: MenuScene,

    properties: {

    },

    onLoad()
    {
        this._super();
    },

    Close(action)
    {
        UIManager.instance.closeCurrentPopup();
        action && action();
    },

    IsPopup()
    {
        return true;
    },
});
