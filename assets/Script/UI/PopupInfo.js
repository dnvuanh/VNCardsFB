var PopupScene = require("PopupScene")

cc.Class({
    extends: PopupScene,

    properties: {
        title: cc.Label,
        description: cc.Label
    },

    display(title, description, closeAction)
    {
        this.title.string = title;
        this.description.string = description;
        this.closeAction = closeAction;
    },

    OnOKPressed()
    {
        SoundMgr.instance.play("buttonClick");
        this.Close(this.closeAction);
    }
});
