(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/MenuGame.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3da6c2KFnVCRYg4359XJTFF', 'MenuGame', __filename);
// Script/MenuGame.js

"use strict";

var MenuScene = require("MenuScene");

cc.Class({
    extends: MenuScene,

    properties: {
        onlineList: require("OnlineList")
    },

    addPlayer: function addPlayer(player) {
        this.onlineList.addPlayer(player);
    },
    removePlayer: function removePlayer(player) {
        this.onlineList.removePlayer(player);
    },
    requestSeat: function requestSeat(sender, seat) {
        console.log("request Seat");
        GSMgr.instance.requestSeat(parseInt(seat));
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
        //# sourceMappingURL=MenuGame.js.map
        