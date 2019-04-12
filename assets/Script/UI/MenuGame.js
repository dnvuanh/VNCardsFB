
var MenuScene = require("MenuScene");
var ObjectPool = require("ObjectPool");

cc.Class({
    extends: MenuScene,

    properties: {
        onlineList: require("OnlineList"),
        chatBox: require("ChatBox"),
        SeatMgr: require("SeatMgr"),
        DealCards: require("DealCards"),
        ButtonLeave: cc.Node,
        ButtonStart: cc.Node,
        ButtonReady: cc.Node,
        PlayingButtons: cc.Node,
        myCardNode: cc.Node,
        friendCardNode: cc.Node,
        rightPanelNode: cc.Node,
        showRightButton: cc.Button,
        throwButton: cc.Button,
        skipButton: cc.Button,
        playZoneNode: cc.Node,
        countDown: require("CountDown"),
    },

    onLoad()
    {
        this.ButtonLeave.active = false;
        this.ButtonStart.active = false;
        this.ButtonReady.active = false;
        this.PlayingButtons.active = false;
        this.onlineList.node.active = true;
        this.chatBox.node.active = false;
        //this.seatOccupied = [false, false, false, false];
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
        GSMgr.instance.leaveSeat(1 - GameMgr.instance.IsRegisterLeave());
    },

    playerEnterSeat(playerInfo, seat)
    {
        //this.seatOccupied[seat] = true;
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
            this.enableStartButton(false);
        }
        this.SeatMgr.onPlayerLeave(seat);
    },

    setHost(playerId)
    {
        this.SeatMgr.setHost(playerId);
    },

    enableStartButton(enable) {
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
        this.friendCardNode.children.forEach(it => it.active = false);
    },

    beginNewGame()
    {
        this.SeatMgr.hideResultIcon();
        this.PlayingButtons.active = true;
        this.previousCards = null;
        this.previousThrowPlayer = null;
        var myid = GameMgr.instance.getMyId();
    },

    PlayDealCardAnim(cards)
    {
        let cardCount = 0;
        this.DealCards.startAnim(()=>{
            let card = ObjectPool.instance.getCard(cards[cardCount]);
                card && card.setParent(this.myCardNode);
            if (cardCount == 0)
            {
                this.friendCardNode.children.forEach(it => it.active = true);
            }
            cardCount += 1;
        });
    },

    onCardsReceived(cards, playAnim)
    {
        this.beginNewGame();
        this.ButtonStart.active = false;
        if (playAnim)
            this.PlayDealCardAnim(cards);
        else
        {
            for (let i=0; i<cards.length; i++)
            {
                let card = ObjectPool.instance.getCard(cards[i]);
                    card && card.setParent(this.myCardNode);
            }
        }
    },

    onShowRightMenuClick()
    {
        var position = this.showRightButton.node.getPosition();
        if (this.rightPanelNode.active == true) {
            this.rightPanelNode.active = false;
            //this.showRightLabel.string = "<<";
            return;
        }
        this.rightPanelNode.active = true;
        //this.showRightLabel.string = ">>";
    },

    getSelectedCards()
    {
        var SelectedCards = [];
        let cardList = this.myCardNode.getComponentsInChildren("Card");
            cardList.forEach(card => {
                if (card.IsSelected())
                SelectedCards.push(card.getCard());
            })
        return SelectedCards;
    },

    throwCards()
    {
        let cards = this.getSelectedCards();
        GSMgr.instance.throwCards(cards);
    },

    skipTurn()
    {
        GSMgr.instance.skipTurn();
    },

    onTurnChange(playerId, startTime, timeout)
    {
        this.SeatMgr.onTurnChange(playerId, startTime, timeout);
        this.PlayingButtons.active = GameMgr.instance.IsMyId(playerId);
        this.checkThrowable();
        this.skipButton.interactable = true;
        if(this.previousThrowPlayer == playerId)
        {
            this.beginNewWave();
        }
    },

    beginNewWave()
    {
        this.previousCards = null;
        this.skipButton.interactable = false;
        let cardList = this.playZoneNode.getComponentsInChildren("Card");
            cardList.forEach(card => {
                card.node.active = false;
            });
    },

    checkThrowable()
    {
        this.throwButton.interactable = GameHelper.validTurn(this.previousCards, this.getSelectedCards());
    },

    onThrowSuccess(playerId, cards)
    {
        const MAX_CARD_ON_HAND = 13;
        this.previousCards = GameHelper.parseCards(cards);
        this.removeCardsFromHand(playerId, cards);
        this.previousThrowPlayer = playerId;
    },

    removeCardsFromHand(playerId, cards)
    {
        let cardList = this.playZoneNode.getComponentsInChildren("Card");
            cardList.forEach(card => {
                card.node.active = false;
            });
            
        cards.sort((a,b) => a - b);
        if(GameMgr.instance.IsMyId(playerId)) {
            cards.forEach(it => {
                let card = this.myCardNode.getChildByName("Card_" + it);
                card.getComponent("Card").onDeselect();
                card.setParent(this.playZoneNode);
                card.setPosition(0, 0);
            });
        } else {
            cards.forEach(it => {
                let card = ObjectPool.instance.getCard(it);
                card.setParent(this.playZoneNode);
                card.setPosition(0, 0);
            });
        }
    },

    onGameWaiting()
    {
        if (GameMgr.instance.IsMeHost())
            this.enableStartButton(false);
        
        this.countDown.hide();
        while (this.myCardNode.children.length > 0)
        {
            this.myCardNode.children[0].setPosition(0,0);
            ObjectPool.instance.recall(this.myCardNode.children[0]);
        }

        while (this.playZoneNode.children.length > 0)
        {
            this.playZoneNode.children[0].setPosition(0,0);
            ObjectPool.instance.recall(this.playZoneNode.children[0]);
        }

        this.friendCardNode.children.forEach(it => it.active = false);
    },

    onGameOver()
    {
        this.SeatMgr.stopAllTurn();
        this.PlayingButtons.active = false;
        this.previousCards = null;
    },

    displayResult(scores, playerWinId, playersCards)
    {
        // if(playersCards[playerWinId].length == 13)
        // {
        //     this.PlayDealCardAnim(playersCards[GameMgr.instance.getMyId()]);
        // }
        console.log(scores);
        this.friendCardNode.children.forEach(it => it.active = false);
        this.SeatMgr.displayResult(playerWinId, playersCards);
    },

    onPlayerReady(playerId, isReady)
    {
        this.SeatMgr.onPlayerReady(playerId, isReady);
        if (GameMgr.instance.IsMyId(playerId))
        {
            this.ButtonReady.active = !isReady;
        }
    },

    onReadyPressed()
    {
        GSMgr.instance.requestPlayerReady(true);
    },

    onPlayerRegisterLeave(isLeave)
    {
        if (isLeave)
            this.ButtonLeave.getComponentInChildren(cc.Label).string = "Unleave";
        else
            this.ButtonLeave.getComponentInChildren(cc.Label).string = "Leave";
    },

    onGameStateReady(timeStamp)
    {
        if (GameMgr.instance.IsMeHost())
        {
            this.enableStartButton(true);
        }
        this.countDown.node.active = true;
        this.countDown.show(timeStamp, Define.TIME_FORCE_START);
    },

    onGameStart()
    {
        this.ButtonStart.active = false;
        this.ButtonReady.active = false;
        this.countDown.hide();
    },

    refreshSeats(Seats)
    {
        this.SeatMgr.refreshSeats(Seats);
    }
});
