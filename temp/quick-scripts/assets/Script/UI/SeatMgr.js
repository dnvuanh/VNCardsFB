(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/SeatMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '74de1Lk4mZPVZQQT0cxQyC0', 'SeatMgr', __filename);
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
    onPlayerFinished: function onPlayerFinished(playerId) {
        for (var i = 0; i < this.node.children.length; i++) {
            var seatDisplay = this.node.children[i].getComponent("SeatDisplay");
            if (seatDisplay && seatDisplay.getPlayerId() == playerId) {
                seatDisplay.onPlayerFinished();
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
        