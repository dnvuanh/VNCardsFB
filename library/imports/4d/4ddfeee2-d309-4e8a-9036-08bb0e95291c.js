"use strict";
cc._RF.push(module, '4ddfe7i0wlOipA2CLsOlSkc', 'SeatDisplay');
// Script/UI/SeatDisplay.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        displayNode: cc.Node,
        avatar: cc.Sprite,
        userName: cc.Label,
        money: cc.Label,
        hostIcon: cc.Node
    },

    onLoad: function onLoad() {
        this.displayNode.active = false;
        this.hostIcon.active = false;
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
    }
});

cc._RF.pop();