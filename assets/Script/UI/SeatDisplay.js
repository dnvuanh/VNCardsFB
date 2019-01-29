cc.Class({
    extends: cc.Component,

    properties: {
        displayNode: cc.Node,
        avatar: cc.Sprite,
        userName: cc.Label,
        money: cc.Label,
        hostIcon: cc.Node,
    },

    onLoad()
    {
        this.displayNode.active = false;
        this.hostIcon.active = false;
    },

    display(playerInfo)
    {
        this.playerId = playerInfo.id;
        let photo = playerInfo.scriptData.Photo;
        let displayName = playerInfo.displayName;

        ImageCache.loadAvatar(this.playerId, photo, (imgSprite)=>{
            if (imgSprite)
            {
                this.avatar.spriteFrame = imgSprite;
            }
            else
            {
                console.log("Error while loading user avatar " + this.playerId);
            }
            this.userName.string = displayName;
            this.displayNode.active = true;
        });
    },

    getPlayerId()
    {
        return this.playerId;
    },

    remove()
    {
        this.playerId = null;
        this.hostIcon.active = false;
        this.displayNode.active = false;
    },

    setHost(isHost)
    {
        this.hostIcon.active = isHost;
    }
});
