
var MenuScene = require("MenuScene");

cc.Class({
    extends: MenuScene,

    properties: {
        onlineList: require("OnlineList"),
        SeatMgr: require("SeatMgr"),
        ButtonLeave: cc.Node,
        ButtonStart: cc.Node,
        InGameButtons: cc.Node,
    },

    start()
    {
        this.ButtonLeave.active = false;
        this.ButtonStart.active = false;
        this.InGameButtons.active = false;
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
    },

    playerEnterSeat(playerInfo, seat)
    {
        this.SeatMgr.onPlayerEnter(playerInfo, seat);
    },

    playerLeaveSeat(seat)
    {
        this.SeatMgr.onPlayerLeave(seat);
    },

    setHost(playerId)
    {
        this.SeatMgr.setHost(playerId);
    }
});
