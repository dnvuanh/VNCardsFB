"use strict";
cc._RF.push(module, '4ddfe7i0wlOipA2CLsOlSkc', 'SeatDisplay');
// Script/UI/SeatDisplay.js

"use strict";

var ObjectPool = require("ObjectPool");

cc.Class({
    extends: cc.Component,

    properties: {
        displayNode: cc.Node,
        avatar: cc.Sprite,
        userName: cc.Label,
        money: cc.Label,
        hostIcon: cc.Node,
        turnCountDown: cc.ProgressBar,
        resultIcon: cc.Node,
        cardsNode: cc.Node
    },

    onLoad: function onLoad() {
        this.displayNode.active = false;
        this.hostIcon.active = false;
        this.turnCountDown.node.active = false;
        this.IsMyTurn = false;
        this.resultIcon.active = false;
        this.resultIcon = this.resultIcon.getComponent("ResultIcon");
        this.cardsNode.active = false;
    },
    display: function display(playerInfo) {
        var _this = this;

        this.playerId = playerInfo.id;
        var photo = playerInfo.scriptData.Photo;
        var displayName = playerInfo.displayName;

        ImageCache.loadAvatar(this.playerId, photo, function (imgSprite) {
            if (imgSprite) {
                _this.avatar.spriteFrame = imgSprite;
            } else {
                console.log("Error while loading user avatar " + _this.playerId);
            }
            _this.userName.string = displayName;
            _this.displayNode.active = true;
        });
    },
    getPlayerId: function getPlayerId() {
        return this.playerId;
    },
    remove: function remove() {
        this.playerId = null;
        this.hostIcon.active = false;
        this.displayNode.active = false;
    },
    setHost: function setHost(isHost) {
        this.hostIcon.active = isHost;
    },
    displayTurn: function displayTurn(startTime, timeout) {
        this.turnCountDown.node.active = true;
        this.timeStartTurn = startTime;
        this.timeoutTurnMill = timeout * 1000;
        this.timeEndTurn = this.timeStartTurn + this.timeoutTurnMill;
        this.IsMyTurn = true;
    },
    disableCountDown: function disableCountDown() {
        this.IsMyTurn = false;
        this.turnCountDown.node.active = false;
    },
    hideResultIcon: function hideResultIcon() {
        this.resultIcon.hide();
    },
    displayWinResult: function displayWinResult(bInstantWin, cards) {
        if (bInstantWin) {
            this.displayCards(cards);
            this.resultIcon.display(Define.RESULT.INSTANT);
        } else {
            this.resultIcon.display(Define.RESULT.WIN);
        }
    },
    displayLoseResult: function displayLoseResult(bInstantWin, cards) {
        this.displayCards(cards);
        var resultType = GameHelper.getLoseResultType(bInstantWin, cards);
        this.resultIcon.display(resultType);
    },
    displayCards: function displayCards(cards) {
        var _this2 = this;

        var idx = 0;
        this.cardsNode.active = true;
        cards.forEach(function (it) {
            var card = ObjectPool.instance.getCard(it);
            if (card != null) {
                card.setParent(_this2.cardsNode);
                card.setScale(0.5, 0.5);
                card.setPosition(0, 0);
            }
        });
    },
    RecallCards: function RecallCards() {
        while (this.cardsNode.children.length > 0) {
            this.cardsNode.children[0].setPosition(0, 0);
            this.cardsNode.children[0].setScale(1, 1);
            ObjectPool.instance.recall(this.cardsNode.children[0]);
        }
        this.cardsNode.active = false;
    },
    update: function update(dt) {
        if (this.IsMyTurn) {
            var timeNow = Date.now();
            var percent = (this.timeEndTurn - timeNow) / this.timeoutTurnMill;
            if (percent > 0) {
                this.turnCountDown.progress = percent;
            } else {
                this.IsMyTurn = false;
                this.turnCountDown.progress = 0;
                this.turnCountDown.node.active = false;
            }
        }
    },
    setReady: function setReady(isReady) {
        if (isReady) {
            this.node.opacity = 255;
        } else {
            this.node.opacity = 125;
        }
    }
});

cc._RF.pop();