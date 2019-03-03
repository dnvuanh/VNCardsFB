(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/FlyingCard.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '186bbMZAiRFaZ0YMTlLmIGI', 'FlyingCard', __filename);
// Script/UI/FlyingCard.js

"use strict";

cc.Class({
    extends: cc.Component,

    reset: function reset() {
        this.node.position = cc.Vector2.ZERO;
    },
    fly: function fly(destination, flyTime, startTime) {
        this.startTime = startTime;
        this.timeEnd = startTime + flyTime;
        this.startFlying = true;
    },
    update: function update(dt) {}
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
        //# sourceMappingURL=FlyingCard.js.map
        