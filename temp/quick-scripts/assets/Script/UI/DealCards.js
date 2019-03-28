(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/DealCards.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c4fdcVzLaRN2r9MSMRp5F9v', 'DealCards', __filename);
// Script/UI/DealCards.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        cardsOfEach: 13,
        flyingTime: 0.2,
        delayTime: 0.1,
        destination: [cc.Node]
    },

    startAnim: function startAnim(callbackEveryTurn) {
        this.deliveryCount = 0;
        this.startFlying = true;
        this.callbackEveryTurn = callbackEveryTurn;
        for (var i = 0; i < this.node.children.length; i++) {
            var cardOrder = i / this.destination.length;
            var position = this.destination[i % this.destination.length].position;
            var delayTime = new cc.DelayTime(cardOrder * this.delayTime);
            var moveTo = new cc.MoveTo(this.flyingTime, position);
            var finish = new cc.callFunc(this.onCardDelivery, this, this.node.children[i]);
            var sequence = new cc.Sequence(delayTime, moveTo, finish);
            this.node.children[i].active = true;
            this.node.children[i].runAction(sequence);
        }
    },
    onCardDelivery: function onCardDelivery(card) {
        this.deliveryCount += 1;
        card.setPosition(0, 0);
        card.active = false;
        if (this.deliveryCount % this.destination.length == 0) {
            this.callbackEveryTurn();
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
        //# sourceMappingURL=DealCards.js.map
        