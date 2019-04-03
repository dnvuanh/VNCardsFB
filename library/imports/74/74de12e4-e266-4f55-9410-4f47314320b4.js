"use strict";
cc._RF.push(module, '74de1Lk4mZPVZQQT0cxQyC0', 'SeatMgr');
// Script/UI/SeatMgr.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    start: function start() {
        var seats = GameMgr.instance.getCurrentSeats();
        for (var seat in seats) {
            var playerId = seats[seat];
            if (playerId) {
                var playerInfo = GameMgr.instance.getPlayer(playerId);
                this.onPlayerEnter(playerInfo, seat);
            }
        }
        var host = GameMgr.instance.getHost();
        if (host) this.setHost(host);

        this.cachedPlayersPos = [];
        for (var i = 0; i < this.node.children.length; i++) {
            this.cachedPlayersPos[i] = this.node.children[i].position;
        }
    },
    onPlayerEnter: function onPlayerEnter(playerInfo, seat) {
        if (seat < this.node.children.length) {
            var seatDisplay = this.node.children[seat].getComponent("SeatDisplay");
            seatDisplay.display(playerInfo);
        }
        if (GameMgr.instance.IsMyId(playerInfo.id)) {
            this.RotateSeats(seat);
        }
    },
    RotateSeats: function RotateSeats(mySeat) {
        var _this = this;

        var _loop = function _loop(i) {
            var offset = i - mySeat >= 0 ? i - mySeat : i - mySeat + 4;
            var fadeOut = cc.fadeOut(0.2);
            var movePosition = cc.callFunc(function () {
                return _this.node.children[i].position = _this.cachedPlayersPos[offset];
            });
            var fadeIn = cc.fadeIn(0.2);
            _this.node.children[i].runAction(cc.sequence(fadeOut, cc.delayTime(0.1), movePosition, fadeIn));
            /*var movePosition = cc.moveTo(0.2,this.cachedPlayersPos[offset]);
            this.node.children[i].runAction(movePosition);*/
        };

        for (var i = 0; i < this.node.children.length; i++) {
            _loop(i);
        }
    },
    onPlayerLeave: function onPlayerLeave(seat) {
        if (seat < this.node.children.length) {
            var seatDisplay = this.node.children[seat].getComponent("SeatDisplay");
            seatDisplay.remove();
        }
    },
    setHost: function setHost(playerId) {
        for (var i = 0; i < this.node.children.length; i++) {
            var seatDisplay = this.node.children[i].getComponent("SeatDisplay");
            if (seatDisplay && seatDisplay.getPlayerId() == playerId) {
                seatDisplay.setHost(true);
            } else {
                seatDisplay && seatDisplay.setHost(false);
            }
        }
    },
    onTurnChange: function onTurnChange(playerId, startTime, timeout) {
        for (var i = 0; i < this.node.children.length; i++) {
            var seatDisplay = this.node.children[i].getComponent("SeatDisplay");
            if (seatDisplay && seatDisplay.getPlayerId() == playerId) {
                seatDisplay.displayTurn(startTime, timeout);
            } else {
                seatDisplay.disableCountDown();
            }
        }
    },
    stopAllTurn: function stopAllTurn() {
        for (var i = 0; i < this.node.children.length; i++) {
            var seatDisplay = this.node.children[i].getComponent("SeatDisplay");
            seatDisplay.disableCountDown();
        }
    },
    displayResult: function displayResult(playerWinId, playersCards) {
        for (var i = 0; i < this.node.children.length; i++) {
            var seatDisplay = this.node.children[i].getComponent("SeatDisplay");
            if (seatDisplay && seatDisplay.getPlayerId() != null) {
                seatDisplay.displayCards(playersCards[seatDisplay.getPlayerId()]);
                if (seatDisplay.getPlayerId() == playerWinId) {
                    cc.log(seatDisplay.getPlayerId());
                    seatDisplay.enableResultIcon(true);
                }
            }
        }
    },
    hideResultIcon: function hideResultIcon() {
        for (var i = 0; i < this.node.children.length; i++) {
            var seatDisplay = this.node.children[i].getComponent("SeatDisplay");
            seatDisplay.enableResultIcon(false);
            if (seatDisplay && seatDisplay.getPlayerId() != null) {
                seatDisplay.RecallCards();
            }
        }
    },
    onPlayerReady: function onPlayerReady(playerId, isReady) {
        for (var i = 0; i < this.node.children.length; i++) {
            var seatDisplay = this.node.children[i].getComponent("SeatDisplay");
            if (seatDisplay && seatDisplay.getPlayerId() == playerId) {
                seatDisplay.setReady(isReady);
            }
        }
    }
});

cc._RF.pop();