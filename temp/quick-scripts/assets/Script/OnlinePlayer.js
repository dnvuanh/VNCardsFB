(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/OnlinePlayer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8d713FALlRLVrvU+8BCpXSL', 'OnlinePlayer', __filename);
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
        