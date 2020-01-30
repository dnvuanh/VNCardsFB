var PopupScene = require("PopupScene")

cc.Class({
    extends: PopupScene,

    properties: {
        amount: cc.Label,
    },

    display(amount)
    {
        this.amount.string = "$" + amount;
        setTimeout(()=>{
            this.Close();
        }, Define.TIME_DISPLAY_RESULT * 1000);
    }
});
