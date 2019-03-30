"use strict";
cc._RF.push(module, '50b4bfCRX5H3IKtw3hvKpaN', 'InputMgr');
// Script/Manager/InputMgr.js

"use strict";

var messageTest = ["This is a test message 1", "This is a test message 2", "This is a test message 3", "This is a test message 4", "This is a test message 5", "This is a test message 6"];
cc.Class({
    extends: cc.Component,

    properties: {},

    start: function start() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
            Notification.instance.add(messageTest[Math.floor(Math.random() * 6)]);
        });
    }
});

cc._RF.pop();