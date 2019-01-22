var GameMgr = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null
    },

    onLoad()
    {
        GameMgr.instance = this;
        cc.game.addPersistRootNode(this.node);
    },

    OnMatchFound(message)
    {
        console.log("Game on match found " + JSON.stringify(message));
        //this.onlineList = message.participants.filter(player=>player.online);
        this.onlineList = message.participants;
    },

    OnMatchUpdate(message)
    {
        console.log("Game on match update " + JSON.stringify(message));
        this.onlineList = message.participants;
        if (message.hasOwnProperty("addedPlayers"))
        {
            let player = this.onlineList.filter(player => player.id == message.addedPlayers)[0];
                UIManager.instance.addPlayer(player);
        }
        if (message.hasOwnProperty("removedPlayers"))
        {
            let player = message.removedPlayers[0];
                UIManager.instance.removePlayer(player);
        }
    },

    getOnlineList()
    {
        return this.onlineList;
    },
});