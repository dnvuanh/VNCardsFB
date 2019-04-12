"use strict";
cc._RF.push(module, '6fdc0OYmpFA16vQr4DRUDer', 'UIManager');
// Script/Manager/UIManager.js

"use strict";

var Loading = require("Loading");
var UIManager = cc.Class({
    extends: cc.Component,

    properties: {
        loadingscreen: Loading,
        MenuGame: require("MenuGame")
    },

    statics: {
        instance: null
    },

    onLoad: function onLoad() {
        UIManager.instance = this;
        this.MenuStack = [];
        this.CurrentMenu = null;
    },
    start: function start() {
        GameMgr.instance.onInit();
    },
    showLoading: function showLoading(display) {
        if (display) this.loadingscreen.show();else this.loadingscreen.hide();
    },
    showMenu: function showMenu(menuName) {
        var closeCurrent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var menu = this.node.getChildByName(menuName);
        if (menu != null) {
            menu.active = true;
            this.MenuStack.push(menuName);
            this.CurrentMenu = menuName;
        }

        if (this.MenuStack.length > 1) {
            var lastMenu = this.node.getChildByName(this.MenuStack[this.MenuStack.length - 2]);
            lastMenu.active = false;

            if (closeCurrent) this.MenuStack.splice(this.MenuStack.length - 2, 1);
        }
        return menu;
    },
    closeCurrentMenu: function closeCurrentMenu() {
        if (this.MenuStack.length > 1) {
            var nextMenu = this.node.getChildByName(this.MenuStack[this.MenuStack.length - 2]);
            nextMenu.active = true;
        }

        var menu = this.node.getChildByName(this.CurrentMenu);
        menu.active = false;

        this.MenuStack.splice(this.MenuStack.length - 1, 1);
        this.CurrentMenu = this.MenuStack[this.MenuStack.length];
    },
    closeAllMenu: function closeAllMenu() {
        var childs = this.node.children;
        childs.forEach(function (element) {
            element.active = false;
        });
    },
    initOnlineList: function initOnlineList() {
        this.onlineList.Init();
    },
    addPlayer: function addPlayer(player) {
        this.MenuGame.addPlayer(player);
    },
    removePlayer: function removePlayer(player) {
        console.log(player);
        this.MenuGame.removePlayer(player);
    },
    playerEnterSeat: function playerEnterSeat(playerInfo, seat) {
        this.MenuGame.playerEnterSeat(playerInfo, seat);
    },
    playerLeaveSeat: function playerLeaveSeat(seat) {
        this.MenuGame.playerLeaveSeat(seat);
    },
    setHost: function setHost(playerId) {
        this.MenuGame.setHost(playerId);
    },
    enableStartButton: function enableStartButton(enable) {
        this.MenuGame.enableStartButton(enable);
    },
    onCardsReceived: function onCardsReceived(cards, playAnim) {
        this.MenuGame.onCardsReceived(cards, playAnim);
    },
    getSelectedCards: function getSelectedCards() {
        return this.MenuGame.getSelectedCards();
    },
    onTurnChange: function onTurnChange(playerId, startTime, timeout) {
        this.MenuGame.onTurnChange(playerId, startTime, timeout);
    },
    checkThrowable: function checkThrowable() {
        this.MenuGame.checkThrowable();
    },
    onThrowSuccess: function onThrowSuccess(playerId, cards) {
        this.MenuGame.onThrowSuccess(playerId, cards);
    },
    onGameWaiting: function onGameWaiting() {
        this.MenuGame.onGameWaiting();
    },
    onGameOver: function onGameOver() {
        this.MenuGame.onGameOver();
    },
    displayResult: function displayResult(scores, playerWinId, playersCards) {
        this.MenuGame.displayResult(scores, playerWinId, playersCards);
    },
    onPlayerReady: function onPlayerReady(playerId, isReady) {
        this.MenuGame.onPlayerReady(playerId, isReady);
    },
    onPlayerRegisterLeave: function onPlayerRegisterLeave(isLeave) {
        this.MenuGame.onPlayerRegisterLeave(isLeave);
    },
    onGameStateReady: function onGameStateReady(timeStamp) {
        this.MenuGame.onGameStateReady(timeStamp);
    },
    onGameStart: function onGameStart() {
        this.MenuGame.onGameStart();
    },
    refreshSeats: function refreshSeats(Seats) {
        this.MenuGame.refreshSeats(Seats);
    },
    getPlayerSeat: function getPlayerSeat(playerId) {
        return this.MenuGame.getPlayerSeat(playerId);
    }
});

cc._RF.pop();