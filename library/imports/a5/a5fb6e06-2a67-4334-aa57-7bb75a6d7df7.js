"use strict";
cc._RF.push(module, 'a5fb64GKmdDNKpXe7dabX33', 'GameMgr');
// Script/GameMgr.js

"use strict";

var GameMgr = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null
    },

    onLoad: function onLoad() {
        GameMgr.instance = this;
        cc.game.addPersistRootNode(this.node);
    },
    OnMatchFound: function OnMatchFound(message) {
        console.log("Game on match found " + JSON.stringify(message));
        //this.onlineList = message.participants.filter(player=>player.online);
        this.onlineList = message.participants;
    },
    OnMatchUpdate: function OnMatchUpdate(message) {
        console.log("Game on match update " + JSON.stringify(message));
        this.onlineList = message.participants;
        if (message.hasOwnProperty("addedPlayers")) {
            var player = this.onlineList.filter(function (player) {
                return player.id == message.addedPlayers;
            })[0];
            UIManager.instance.addPlayer(player);
        }
        if (message.hasOwnProperty("removedPlayers")) {
            var _player = message.removedPlayers[0];
            UIManager.instance.removePlayer(_player);
        }
    },
    getOnlineList: function getOnlineList() {
        return this.onlineList;
    }
});

cc._RF.pop();