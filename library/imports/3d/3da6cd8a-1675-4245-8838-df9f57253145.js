"use strict";
cc._RF.push(module, '3da6c2KFnVCRYg4359XJTFF', 'MenuGame');
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
        ButtonLeave: cc.Node,
        ButtonStart: cc.Node,
        InGameButtons: cc.Node,
        myCardNode: cc.Node,
        rightPanelNode: cc.Node,
        showRightButton: cc.Button,
        showRightLabel: cc.Label,
        throwButton: cc.Button
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
    },
    onCardsReceived: function onCardsReceived(cards) {
        console.log("on Card Receive " + cards);
        for (var i = 0; i < cards.length; i++) {
            var card = ObjectPool.instance.getCard(cards[i]);
            card.setParent(this.myCardNode);
        }
        this.InGameButtons.active = true;
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
    enableThrowButton: function enableThrowButton(enable) {
        this.throwButton.node.active = enable;
    },
    throwButtonClick: function throwButtonClick() {
        GSMgr.instance.throwCards(GameMgr.instance.getSetCards());
    }
});

cc._RF.pop();