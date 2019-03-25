(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/MenuGame.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3da6c2KFnVCRYg4359XJTFF', 'MenuGame', __filename);
// Script/UI/MenuGame.js

"use strict";

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
        InGameButtons: cc.Node,
        myCardNode: cc.Node,
        friendCardNode: cc.Node,
        rightPanelNode: cc.Node,
        showRightButton: cc.Button,
        showRightLabel: cc.Label,
        throwButton: cc.Button,
        playZoneNode: cc.Node
    },

    start: function start() {
        this.ButtonLeave.active = false;
        this.ButtonStart.active = false;
        this.InGameButtons.active = false;
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
        GSMgr.instance.leaveSeat(GameMgr.instance.getMySeat());
    },
    playerEnterSeat: function playerEnterSeat(playerInfo, seat) {
        this.seatOccupied[seat] = true;
        this.SeatMgr.onPlayerEnter(playerInfo, seat);
        if (GameMgr.instance.IsMyId(playerInfo.id)) {
            this.ButtonLeave.active = true;
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
        this.ButtonStart.active = false;
        this.friendCardNode.children.forEach(function (it) {
            return it.active = false;
        });
    },
    onCardsReceived: function onCardsReceived(cards) {
        var _this = this;

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
        this.InGameButtons.active = true;
        this.previousCards = null;
        this.previousThrowPlayer = null;
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
        if (GameMgr.instance.IsMyId(playerId)) {
            this.InGameButtons.active = true;
        } else {
            this.InGameButtons.active = false;
        }
        this.throwButton.interactable = false;
        if (this.previousThrowPlayer == playerId) {
            this.previousCards = null;
        }
    },
    checkThrowable: function checkThrowable(enable) {
        if (GameHelper.validTurn(this.previousCards, this.getSelectedCards())) {
            this.throwButton.interactable = true;
        } else {
            this.throwButton.interactable = false;
        }
    },
    onThrowSuccess: function onThrowSuccess(playerId, cards) {
        this.previousCards = GameHelper.parseCards(cards);
        this.removeCardsFromHand(playerId, cards);
        this.previousThrowPlayer = playerId;
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
    onGameOver: function onGameOver() {
        this.SeatMgr.stopAllTurn();
    },
    displayResult: function displayResult(scores) {
        console.log(scores);
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=MenuGame.js.map
        