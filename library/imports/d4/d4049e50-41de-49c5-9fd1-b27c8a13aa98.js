"use strict";
cc._RF.push(module, 'd40495QQd5JxZ/RsnyKE6qY', 'OnlineList');
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
        var playerNode = cc.instantiate(this.onlinePlayer);
        playerNode.getComponent("OnlinePlayer").display(player.id, player.scriptData.Photo, player.displayName);
        playerNode.parent = this.listNode;
        playerNode.name = player.id;
    },
    removePlayer: function removePlayer(player) {
        var playerNode = this.listNode.getChildByName(player);
        if (playerNode) {
            playerNode.destroy();
        }
    }
});

cc._RF.pop();