"use strict";
cc._RF.push(module, '8d713FALlRLVrvU+8BCpXSL', 'OnlinePlayer');
// Script/UI/OnlinePlayer.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        avatar: cc.Sprite,
        displayName: cc.Label
    },

    display: function display(userId, photo, name, callback) {
        var _this = this;

        this.userId = userId;
        this.displayName.string = name;
        if (photo != "default") {
            ImageCache.loadAvatar(userId, photo, function (imgSprite) {
                if (imgSprite) {
                    _this.avatar.spriteFrame = imgSprite;
                } else {
                    console.log("Error while loading user avatar " + userId);
                }
                callback();
            });
        } else {
            callback();
        }
    }
});

cc._RF.pop();