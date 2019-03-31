(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Manager/InputMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '50b4bfCRX5H3IKtw3hvKpaN', 'InputMgr', __filename);
// Script/Manager/InputMgr.js

"use strict";

var messageTest = ["This is a test message 1", "This is a test message 2", "This is a test message 3", "This is a test message 4", "This is a test message 5", "This is a test message 6"];
cc.Class({
    extends: cc.Component,

    properties: {},

    start: function start() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
            if (event.keyCode == 32) Notification.instance.add(messageTest[Math.floor(Math.random() * 6)]);
        });
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
        //# sourceMappingURL=InputMgr.js.map
        