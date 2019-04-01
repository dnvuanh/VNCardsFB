"use strict";
cc._RF.push(module, '3da6c2KFnVCRYg4359XJTFF', 'MenuGame');
// Script/UI/MenuGame.js

"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
        showRightLabel: cc.Label,
        throwButton: cc.Button,
        skipButton: cc.Button,
        playZoneNode: cc.Node,
        countDown: require("CountDown")
    },

    start: function start() {
        this.ButtonLeave.active = false;
        this.ButtonStart.active = false;
        this.ButtonReady.active = false;
        this.PlayingButtons.active = false;
        this.onlineList.node.active = true;
        this.chatBox.node.active = false;
        this.seatOccupied = [false, false, false, false];
    },
    addPlayer: function addPlayer(player) {
        this.onlineList.addPlayer(player);
    },
    removePlayer: function removePlayer(player) {
        this.onlineList.removePlayer(player);
    },
    requestSeat: function requestSeat(sender, seat) {
        console.log("request Seat");
        GSMgr.instance.requestSeat(parseInt(seat));
    },
    requestLeaveSeat: function requestLeaveSeat() {
        GSMgr.instance.leaveSeat(1 - GameMgr.instance.IsRegisterLeave());
    },
    playerEnterSeat: function playerEnterSeat(playerInfo, seat) {
        this.seatOccupied[seat] = true;
        this.SeatMgr.onPlayerEnter(playerInfo, seat);
        if (GameMgr.instance.IsMyId(playerInfo.id)) {
            this.ButtonLeave.active = true;
            //this.ButtonReady.active = !GameMgr.instance.IsHost(playerInfo.id);
        }
    },
    playerLeaveSeat: function playerLeaveSeat(seat) {
        if (GameMgr.instance.getMySeat() == seat) {
            this.ButtonLeave.active = false;
            this.enableStartButton(false);
        }
        this.SeatMgr.onPlayerLeave(seat);
    },
    setHost: function setHost(playerId) {
        this.SeatMgr.setHost(playerId);
    },
    enableStartButton: function enableStartButton(enable) {
        this.ButtonStart.active = enable;
    },
    chatBoxClick: function chatBoxClick() {
        this.onlineList.node.active = false;
        this.chatBox.node.active = true;
    },
    onlineClick: function onlineClick() {
        this.onlineList.node.active = true;
        this.chatBox.node.active = false;
    },
    onStartGameClick: function onStartGameClick() {
        GSMgr.instance.startGame();
        this.friendCardNode.children.forEach(function (it) {
            return it.active = false;
        });
    },
    beginNewGame: function beginNewGame() {
        this.SeatMgr.hideResultIcon();
        this.PlayingButtons.active = true;
        this.previousCards = null;
        this.previousThrowPlayer = null;
        var myid = GameMgr.instance.getMyId();
        this.CardsOnHand = _defineProperty({}, myid, 13);
    },
    onCardsReceived: function onCardsReceived(cards) {
        var _this = this;

        this.beginNewGame();
        this.ButtonStart.active = false;
        var cardCount = 0;
        this.DealCards.startAnim(function () {
            var card = ObjectPool.instance.getCard(cards[cardCount]);
            card.setParent(_this.myCardNode);
            if (cardCount == 0) {
                _this.friendCardNode.children.forEach(function (it) {
                    return it.active = true;
                });
            }
            cardCount += 1;
        });
    },
    onShowRightMenuClick: function onShowRightMenuClick() {
        var position = this.showRightButton.node.getPosition();
        if (this.rightPanelNode.active == true) {
            this.rightPanelNode.active = false;
            this.showRightLabel.string = "<<";
            return;
        }
        this.rightPanelNode.active = true;
        this.showRightLabel.string = ">>";
    },
    getSelectedCards: function getSelectedCards() {
        var SelectedCards = [];
        var cardList = this.myCardNode.getComponentsInChildren("Card");
        cardList.forEach(function (card) {
            if (card.IsSelected()) SelectedCards.push(card.getCard());
        });
        return SelectedCards;
    },
    throwCards: function throwCards() {
        var cards = this.getSelectedCards();
        GSMgr.instance.throwCards(cards);
    },
    skipTurn: function skipTurn() {
        GSMgr.instance.skipTurn();
    },
    onTurnChange: function onTurnChange(playerId, startTime, timeout) {
        this.SeatMgr.onTurnChange(playerId, startTime, timeout);
        this.PlayingButtons.active = GameMgr.instance.IsMyId(playerId);
        this.checkThrowable();
        this.skipButton.interactable = true;
        if (this.previousThrowPlayer == playerId) {
            this.beginNewWave();
        }
    },
    beginNewWave: function beginNewWave() {
        this.previousCards = null;
        this.skipButton.interactable = false;
        var cardList = this.playZoneNode.getComponentsInChildren("Card");
        cardList.forEach(function (card) {
            card.node.active = false;
        });
    },
    checkThrowable: function checkThrowable() {
        this.throwButton.interactable = GameHelper.validTurn(this.previousCards, this.getSelectedCards());
    },
    onThrowSuccess: function onThrowSuccess(playerId, cards) {
        var MAX_CARD_ON_HAND = 13;
        this.previousCards = GameHelper.parseCards(cards);
        this.removeCardsFromHand(playerId, cards);
        this.previousThrowPlayer = playerId;
        if (this.CardsOnHand.hasOwnProperty(playerId)) {
            this.CardsOnHand[playerId] -= cards.length;
        } else {
            this.CardsOnHand[playerId] = MAX_CARD_ON_HAND - cards.length;
        }
        if (this.CardsOnHand[playerId] == 0) {
            this.SeatMgr.onPlayerFinished(playerId);
            this.friendCardNode.children.forEach(function (it) {
                return it.active = false;
            });
        }
    },
    removeCardsFromHand: function removeCardsFromHand(playerId, cards) {
        var _this2 = this;

        var idx = 0;
        var OFFSET = 50;
        cards.sort(function (a, b) {
            return a - b;
        });
        if (GameMgr.instance.IsMyId(playerId)) {
            cards.forEach(function (it) {
                var card = _this2.myCardNode.getChildByName("Card_" + it);
                card.getComponent("Card").onDeselect();
                card.setParent(_this2.playZoneNode);
                card.x = idx++ * OFFSET;
            });
        } else {
            cards.forEach(function (it) {
                var card = ObjectPool.instance.getCard(it);
                card.setParent(_this2.playZoneNode);
                card.x = idx++ * OFFSET;
            });
        }
    },
    onGameWaiting: function onGameWaiting() {
        if (GameMgr.instance.IsMeHost()) this.enableStartButton(false);

        this.countDown.hide();
        while (this.myCardNode.children.length > 0) {
            this.myCardNode.children[0].setPosition(0, 0);
            ObjectPool.instance.recall(this.myCardNode.children[0]);
        }

        while (this.playZoneNode.children.length > 0) {
            this.playZoneNode.children[0].setPosition(0, 0);
            ObjectPool.instance.recall(this.playZoneNode.children[0]);
        }

        this.friendCardNode.children.forEach(function (it) {
            return it.active = false;
        });
    },
    onGameOver: function onGameOver() {
        this.SeatMgr.stopAllTurn();
        this.PlayingButtons.active = false;
        this.previousCards = null;
    },
    displayResult: function displayResult(scores) {
        console.log(scores);
    },
    onPlayerReady: function onPlayerReady(playerId, isReady) {
        this.SeatMgr.onPlayerReady(playerId, isReady);
        if (GameMgr.instance.IsMyId(playerId)) {
            this.ButtonReady.active = !isReady;
        }
    },
    onReadyPressed: function onReadyPressed() {
        GSMgr.instance.requestPlayerReady(true);
    },
    onPlayerRegisterLeave: function onPlayerRegisterLeave(isLeave) {
        if (isLeave) this.ButtonLeave.getComponentInChildren(cc.Label).string = "Unleave";else this.ButtonLeave.getComponentInChildren(cc.Label).string = "Leave";
    },
    onGameStateReady: function onGameStateReady(timeStamp) {
        if (GameMgr.instance.IsMeHost()) {
            this.enableStartButton(true);
        }
        this.countDown.node.active = true;
        this.countDown.show(timeStamp, Define.TIME_FORCE_START);
    },
    onGameStart: function onGameStart() {
        this.ButtonStart.active = false;
        this.ButtonReady.active = false;
        this.countDown.hide();
    }
});

cc._RF.pop();