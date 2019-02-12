
var MenuScene = require("MenuScene");

cc.Class({
    extends: MenuScene,

    properties: {
        onlineList: require("OnlineList"),
        chatBox: require("ChatBox"),
        SeatMgr: require("SeatMgr"),
        ButtonLeave: cc.Node,
        ButtonStart: cc.Node,
        InGameButtons: cc.Node,
        cardPrefab: cc.Prefab,
    },

    start()
    {
        this.ButtonLeave.active = false;
        this.ButtonStart.active = false;
        this.InGameButtons.active = false;
        this.onlineList.node.active = true;
        this.chatBox.node.active = false;
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
        const CARD_WIDTH = 168;
        for(var i = 0; i < cards.length; i++)    {
            var card = new cc.instantiate(this.cardPrefab).getComponent("Card"); 
            card.init(cards[i]);
            card.node.setPosition(-1000 + CARD_WIDTH * i, -300);
            this.node.addChild(card.node);
        }
    }
});
