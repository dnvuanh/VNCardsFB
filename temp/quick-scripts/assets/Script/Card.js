(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Card.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '257e3vfW8JA44fFKlDmsOe6', 'Card', __filename);
// Script/Card.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        display: cc.Sprite,
        selectedPosition: 0
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
    onSelect: function onSelect() {
        this.isSelected = true;
        this.node.y = this.selectedPosition;
    },
    onDeselect: function onDeselect() {
        this.isSelected = false;
        this.node.y = 0;
    },
    onClick: function onClick() {
        if (this.isSelected) {
            this.onDeselect();
        } else {
            this.onSelect();
        }
        UIManager.instance.checkThrowable();
    },
    IsSelected: function IsSelected() {
        return this.isSelected;
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
        