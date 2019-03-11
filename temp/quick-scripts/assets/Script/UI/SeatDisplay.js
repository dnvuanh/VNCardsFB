(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/SeatDisplay.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4ddfe7i0wlOipA2CLsOlSkc', 'SeatDisplay', __filename);
// Script/UI/SeatDisplay.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        displayNode: cc.Node,
        avatar: cc.Sprite,
        userName: cc.Label,
        money: cc.Label,
        hostIcon: cc.Node,
        turnCountDown: cc.ProgressBar
    },

    onLoad: function onLoad() {
        this.displayNode.active = false;
        this.hostIcon.active = false;
        this.turnCountDown.node.active = false;
        this.IsMyTurn = false;
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
        //# sourceMappingURL=SeatDisplay.js.map
        