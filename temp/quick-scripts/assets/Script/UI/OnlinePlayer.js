(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/OnlinePlayer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8d713FALlRLVrvU+8BCpXSL', 'OnlinePlayer', __filename);
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
        //# sourceMappingURL=OnlinePlayer.js.map
        