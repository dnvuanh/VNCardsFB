(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/OnlineList.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd40495QQd5JxZ/RsnyKE6qY', 'OnlineList', __filename);
// Script/OnlineList.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        listNode: cc.Node,
        onlinePlayer: cc.Prefab
    },

    start: function start() {
        this.Init();
    },
    Init: function Init() {
        var _this = this;

        var list = GameMgr.instance.getOnlineList();
        list.forEach(function (it) {
            _this.addPlayer(it);
        });
    },
    addPlayer: function addPlayer(player) {
        var _this2 = this;

        var playerNode = cc.instantiate(this.onlinePlayer);
        playerNode.getComponent("OnlinePlayer").display(player.id, player.scriptData.Photo, player.displayName, function () {
            playerNode.parent = _this2.listNode;
            playerNode.name = player.id;
        });
    },
    removePlayer: function removePlayer(player) {
        var playerNode = this.listNode.getChildByName(player);
        if (playerNode) {
            playerNode.destroy();
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
        //# sourceMappingURL=OnlineList.js.map
        