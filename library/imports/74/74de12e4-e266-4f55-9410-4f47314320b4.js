"use strict";
cc._RF.push(module, '74de1Lk4mZPVZQQT0cxQyC0', 'SeatMgr');
// Script/UI/SeatMgr.js

"use strict";

cc.Class({
    extends: cc.Component,

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
    },
    onPlayerEnter: function onPlayerEnter(playerInfo, seat) {
        if (seat < this.node.children.length) {
            var seatDisplay = this.node.children[seat].getComponent("SeatDisplay");
            seatDisplay.display(playerInfo);
            seatDisplay.setReady(GameMgr.instance.IsHost(playerInfo.id));
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