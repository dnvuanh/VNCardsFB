cc.Class({
    extends: cc.Component,

    properties: {

    },

    Show()
    {
        this.node.active = true;
    },

    Hide()
    {
        this.node.active = false;
    }
});
