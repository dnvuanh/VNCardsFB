var PopupScene = require("PopupScene")
var Define = require("Define")
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
        }, 3000);
    }
});
