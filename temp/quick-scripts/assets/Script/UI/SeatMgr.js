(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/SeatMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '74de1Lk4mZPVZQQT0cxQyC0', 'SeatMgr', __filename);
// Script/UI/SeatMgr.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        SeatPrefab: cc.Prefab
    },

    onLoad: function onLoad() {
        this.cachedPlayersPos = [];
        this.Seats = [];

        for (var i = 0; i < this.node.children.length; i++) {
            this.cachedPlayersPos[i] = this.node.children[i].position;
            this.Seats[i] = cc.instantiate(this.SeatPrefab).getComponent("SeatDisplay");
            this.node.children[i].active = false;
            this.Seats[i].onInit(i, this.cachedPlayersPos[i]);
        }
        for (var _i = 0; _i < 4; _i++) {
            this.node.addChild(this.Seats[_i].node);
        }
        this.seatOffset = 0;
    },
    refreshSeats: function refreshSeats(Seats) {
        for (var seat in Seats) {
            var playerId = Seats[seat];
            if (playerId) {
                var playerInfo = GameMgr.instance.getPlayer(playerId);
                this.onPlayerEnter(playerInfo, seat);
            }
        }
        var host = GameMgr.instance.getHost();
        if (host) this.setHost(host);
    },
    onPlayerEnter: function onPlayerEnter(playerInfo, seat) {
        if (seat < this.Seats.length) {
            var seatDisplay = this.Seats[seat];
            seatDisplay.display(playerInfo);
        }
        if (GameMgr.instance.IsMyId(playerInfo.id)) {
            this.RotateSeats(seat);
        }
    },
    RotateSeats: function RotateSeats(mySeat) {
        Notification.instance.add("Moving Player Position");
        for (var i = 0; i < this.Seats.length; i++) {
            var offset = i - mySeat >= 0 ? i - mySeat : i - mySeat + 4;
            /*let fadeOut = cc.fadeOut(0.2);
            let movePosition = cc.callFunc(() => this.Seats[i].node.position = this.cachedPlayersPos[offset]);
            let fadeIn = cc.fadeIn(0.2);
            this.Seats[i].node.runAction(cc.sequence(fadeOut, cc.delayTime(0.1), movePosition, fadeIn));*/
            var movePosition = cc.moveTo(0.5, this.cachedPlayersPos[offset]);
            this.Seats[i].node.runAction(movePosition);
            this.Seats[i].setPositionAfterRotate(offset);
        }
    },
    onPlayerLeave: function onPlayerLeave(seat) {
        if (seat < this.Seats.length) {
            var seatDisplay = this.Seats[seat];
            seatDisplay.remove();
        }
    },
    setHost: function setHost(playerId) {
        for (var i = 0; i < this.Seats.length; i++) {
            var seatDisplay = this.Seats[i];
            if (seatDisplay && seatDisplay.getPlayerId() == playerId) {
                seatDisplay.setHost(true);
            } else {
                seatDisplay && seatDisplay.setHost(false);
            }
        }
    },
    onTurnChange: function onTurnChange(playerId, startTime, timeout) {
        for (var i = 0; i < this.Seats.length; i++) {
            var seatDisplay = this.Seats[i];
            if (seatDisplay && seatDisplay.getPlayerId() == playerId) {
                seatDisplay.displayTurn(startTime, timeout);
            } else {
                seatDisplay.disableCountDown();
            }
        }
    },
    stopAllTurn: function stopAllTurn() {
        for (var i = 0; i < this.Seats.length; i++) {
            var seatDisplay = this.Seats[i];
            seatDisplay.disableCountDown();
        }
    },
    onPlayerReady: function onPlayerReady(playerId, isReady) {
        for (var i = 0; i < this.Seats.length; i++) {
            var seatDisplay = this.Seats[i];
            if (seatDisplay && seatDisplay.getPlayerId() == playerId) {
                seatDisplay.setReady(isReady);
            }
        }
    },
    getPlayerSeat: function getPlayerSeat(playerId) {
        for (var i = 0; i < this.Seats.length; i++) {
            var seatDisplay = this.Seats[i];
            if (seatDisplay && seatDisplay.getPlayerId() == playerId) {
                return seatDisplay.getPositionAfterRotate();
            }
        }
        return -1;
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
        //# sourceMappingURL=SeatMgr.js.map
        