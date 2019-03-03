(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Card.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '257e3vfW8JA44fFKlDmsOe6', 'Card', __filename);
// Script/Card.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        display: cc.Sprite
    },

    setCard: function setCard(value) {
        this.cardValue = value;
        this.display.spriteFrame = ImageCache.getSprite("Card_" + value);
        this.node.name = "Card_" + value;
        this.up = false;
    },
    getCard: function getCard() {
        return this.cardValue;
    },
    onClick: function onClick() {
        var position = this.node.getPosition();
        if (!this.up) {
            this.node.setPosition(position.x, position.y + 50);
            this.up = true;
            GameMgr.instance.pushCard(this.getCard());
        } else {
            this.node.setPosition(position.x, position.y - 50);
            this.up = false;
            GameMgr.instance.popCard(this.getCard());
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
        //# sourceMappingURL=Card.js.map
        