
var MenuScene = require("MenuScene");

cc.Class({
    extends: MenuScene,

    properties: {
        onlineList: require("OnlineList")
    },

    addPlayer(player)
    {
        this.onlineList.addPlayer(player);
    },

    removePlayer(player)
    {
        this.onlineList.removePlayer(player);
    },

    requestSeat(sender, seat)
    {
        console.log("request Seat");
        GSMgr.instance.requestSeat(parseInt(seat));
    }
});
