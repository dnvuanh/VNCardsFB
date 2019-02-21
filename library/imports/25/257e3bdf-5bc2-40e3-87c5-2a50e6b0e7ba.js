"use strict";
cc._RF.push(module, '257e3vfW8JA44fFKlDmsOe6', 'Card');
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
    },
    getCard: function getCard() {
        return this.cardValue;
    }
});

cc._RF.pop();