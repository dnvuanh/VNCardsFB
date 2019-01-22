"use strict";
cc._RF.push(module, '8d713FALlRLVrvU+8BCpXSL', 'OnlinePlayer');
// Script/OnlinePlayer.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        avatar: cc.Sprite,
        displayName: cc.Label
    },

    display: function display(userId, photo, name) {
        var _this = this;

        this.userId = userId;
        if (photo != "default") {
            cc.loader.load(photo, function (err, img) {
                if (err) {
                    cc.error(err);
                    return;
                }
                _this.avatar.spriteFrame = new cc.SpriteFrame(img);
            }.bind(this));
        }
        this.displayName.string = name;
    }
});

cc._RF.pop();