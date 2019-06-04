cc.Class({
    extends: cc.Component,

    properties: {

    },

    Show()
    {
        console.log("Popup " + this.node.name + " show");
        this.node.active = true;
    },

    Hide()
    {
        console.log("Popup " + this.node.name + " hide");
        this.node.active = false;
    },
});
