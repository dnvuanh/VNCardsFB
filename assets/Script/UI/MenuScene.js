cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad()
    {
        if (!this.Loaded)
        {
            this.node.active = false;
            this.Loaded = true;
        }
    },

    Show()
    {
        this.Loaded = true;
        this.node.active = true;
    },

    Hide()
    {
        this.node.active = false;
    },

    IsPopup()
    {
        return false;
    }
});
