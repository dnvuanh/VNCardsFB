
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
        const CARD_OFFSET = 130;
        const CARD_OFFSET2 = 40;
        const CARD_COUNT = 13;
        const CARD_BACK = 65;
        const SCALE = 0.5;
        const LEFT = -600;
        const BOTTOM_LEFT = -300;
        const BOTTOM = -300;
        const LEFT_TOP = -200;
        for(var i = 0; i < cards.length; i++)    {
            var card = new cc.instantiate(this.cardPrefab).getComponent("Card"); 
            card.init(cards[i]);
            card.node.setPosition(-1000 + CARD_OFFSET * i, -500);
            this.node.addChild(card.node, 2);
        }

        //TODO: should optimize 52 conditions to check card face up
        var mySeat = GameMgr.instance.getMySeat();
        for(var i = 0; i < CARD_COUNT; i++)    {
            if(this.seatOccupied[0]) {
                var card = new cc.instantiate(this.cardPrefab).getComponent("Card"); 
                card.init(mySeat == 0 ? cards[i] : CARD_BACK);
                card.node.setPosition(BOTTOM_LEFT + CARD_OFFSET2 * i, BOTTOM);
                card.node.setScale(SCALE, SCALE);
                this.node.addChild(card.node, 0);
            }
            if(this.seatOccupied[1]) {
                var card = new cc.instantiate(this.cardPrefab).getComponent("Card"); 
                card.init(mySeat == 1 ? cards[i] : CARD_BACK);
                card.node.setPosition(LEFT, LEFT_TOP + CARD_OFFSET2 * i);
                card.node.setScale(SCALE, SCALE);
                card.node.setRotation(270);
                this.node.addChild(card.node, 0);
            }
            if(this.seatOccupied[2]) {
                var card = new cc.instantiate(this.cardPrefab).getComponent("Card"); 
                card.init(mySeat == 2 ? cards[i] : CARD_BACK);
                card.node.setPosition(BOTTOM_LEFT + CARD_OFFSET2 * i, -BOTTOM);
                card.node.setScale(SCALE, SCALE);
                this.node.addChild(card.node, 0);
            }
            if(this.seatOccupied[3]) {
                var card = new cc.instantiate(this.cardPrefab).getComponent("Card"); 
                card.init(mySeat == 3 ? cards[i] : CARD_BACK);
                card.node.setPosition(-LEFT, LEFT_TOP + CARD_OFFSET2 * i);
                card.node.setScale(SCALE, SCALE);
                card.node.setRotation(270);
                this.node.addChild(card.node, 0);
            }
        }
    }
});
