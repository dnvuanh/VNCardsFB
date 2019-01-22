cc.Class({
    extends: cc.Component,

    properties: {
        listNode: cc.Node,
        onlinePlayer: cc.Prefab
    },

    start()
    {
        this.Init();
    },

    Init()
    {
        let list = GameMgr.instance.getOnlineList();
        list.forEach(it => {
            this.addPlayer(it);
        });
    },

    addPlayer(player)
    {
        let playerNode = cc.instantiate(this.onlinePlayer);
            playerNode.getComponent("OnlinePlayer").display(player.id, player.scriptData.Photo, player.displayName);
            playerNode.parent = this.listNode;
            playerNode.name = player.id;
    },

    removePlayer(player)
    {
        let playerNode = this.listNode.getChildByName(player);
        if (playerNode)
        {
            playerNode.destroy();
        }
    }
});
