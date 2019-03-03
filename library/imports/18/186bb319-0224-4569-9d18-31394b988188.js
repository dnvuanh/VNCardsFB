"use strict";
cc._RF.push(module, '186bbMZAiRFaZ0YMTlLmIGI', 'FlyingCard');
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