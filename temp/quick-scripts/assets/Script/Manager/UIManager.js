(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Manager/UIManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6fdc0OYmpFA16vQr4DRUDer', 'UIManager', __filename);
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
    onCardsReceived: function onCardsReceived(cards) {
        this.MenuGame.onCardsReceived(cards);
    },
    getSelectedCards: function getSelectedCards() {
        return this.MenuGame.getSelectedCards();
    },
    onTurnChange: function onTurnChange(playerId, startTime, timeout) {
        this.MenuGame.onTurnChange(playerId, startTime, timeout);
    },
    checkThrowable: function checkThrowable(enable) {
        this.MenuGame.checkThrowable(enable);
    },
    onThrowSuccess: function onThrowSuccess(playerId, cards) {
        this.MenuGame.onThrowSuccess(playerId, cards);
    },
    onGameOver: function onGameOver() {
        this.MenuGame.onGameOver();
    },
    displayResult: function displayResult(scores) {
        this.MenuGame.displayResult(scores);
    },
    onPlayerReady: function onPlayerReady(playerId, isReady) {
        this.MenuGame.onPlayerReady(playerId, isReady);
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
        //# sourceMappingURL=UIManager.js.map
        