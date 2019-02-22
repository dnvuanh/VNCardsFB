
var MenuScene = require("MenuScene");
var ObjectPool = require("ObjectPool");

cc.Class({
    extends: MenuScene,

    properties: {
        onlineList: require("OnlineList"),
        chatBox: require("ChatBox"),
        SeatMgr: require("SeatMgr"),
        ButtonLeave: cc.Node,
        ButtonStart: cc.Node,
        InGameButtons: cc.Node,
        myCardNode: cc.Node,
        rightPanelNode: cc.Node,
        showRightButton: cc.Button,
        showRightLabel: cc.Label,
    },

    start()
    {
        this.ButtonLeave.active = false;
        this.ButtonStart.active = false;
        this.InGameButtons.active = false;
        this.onlineList.node.active = true;
        this.chatBox.node.active = false;
        this.seatOccupied = [false, false, false, false];
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

    requestLeaveSeat()
    {
        GSMgr.instance.leaveSeat(GameMgr.instance.getMySeat());
    },

    playerEnterSeat(playerInfo, seat)
    {
        this.seatOccupied[seat] = true;
        this.SeatMgr.onPlayerEnter(playerInfo, seat);
        if (GameMgr.instance.IsMyId(playerInfo.id))
        {
            this.ButtonLeave.active = true;
        }
    },

    playerLeaveSeat(seat)
    {
        if (GameMgr.instance.getMySeat() == seat)
        {
            this.ButtonLeave.active = false;
            this.setEnableStartButton(false);
        }
        this.SeatMgr.onPlayerLeave(seat);
    },

    setHost(playerId)
    {
        this.SeatMgr.setHost(playerId);
    },

    setEnableStartButton(enable) {
        this.ButtonStart.active = enable;
    },

    chatBoxClick()
    {
        this.onlineList.node.active = false;
        this.chatBox.node.active = true;
    },

    onlineClick()
    {
        this.onlineList.node.active = true;
        this.chatBox.node.active = false;
    },

    onStartGameClick()
    {
        GSMgr.instance.startGame();
        this.ButtonStart.active = false;
    },

    onCardsReceived(cards)
    {
        console.log("on Card Receive " + cards);
        for (var i=0; i<cards.length; i++)
        {
            let card = ObjectPool.instance.getCard(cards[i]);
                card.setParent(this.myCardNode);
        }
    },

    onShowRightMenuClick()
    {
        var position =  this.showRightButton.node.getPosition();
        if(this.rightPanelNode.active == true) {
            this.rightPanelNode.active = false;
            this.showRightLabel.string = "<<";
            return;
        }
        this.rightPanelNode.active = true;
        this.showRightLabel.string = ">>";
    }
});
