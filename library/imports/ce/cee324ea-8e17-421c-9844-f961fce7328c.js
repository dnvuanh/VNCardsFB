"use strict";
cc._RF.push(module, 'cee32TqjhdCHJhE+WH85zKM', 'ObjectPool');
// Script/ObjectPool.js

"use strict";

var ObjectPool = cc.Class({
    extends: cc.Component,

    properties: {
        Card: cc.Prefab
    },

    statics: {
        instance: null
    },

    onLoad: function onLoad() {
        ObjectPool.instance = this;
    },
    start: function start() {
        this.InitPool();
    },
    InitPool: function InitPool() {
        this.InitPoolCard();
    },
    InitPoolCard: function InitPoolCard() {
        for (var i = 0; i < 52; i++) {
            var card = cc.instantiate(this.Card).getComponent("Card");
            card.setCard(i + 12);
            card.node.setParent(this.node);
            card.node.active = false;
        }
    },
    getCard: function getCard(value) {
        var card = this.node.getChildByName("Card_" + value);
        if (card) {
            card.active = true;
            return card;
        } else return null;
    },
    recall: function recall(obj) {
        obj.setParent(this.node);
        obj.active = false;
    }
});

cc._RF.pop();