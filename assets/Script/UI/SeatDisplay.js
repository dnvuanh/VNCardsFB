cc.Class({
    extends: cc.Component,

    properties: {
        displayNode: cc.Node,
        avatar: cc.Sprite,
        userName: cc.Label,
        money: cc.Label,
        hostIcon: cc.Node,
        turnCountDown: cc.ProgressBar,
    },

    onLoad()
    {
        this.displayNode.active = false;
        this.hostIcon.active = false;
        this.turnCountDown.node.active = false;
        this.IsMyTurn = false;
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
    },

    displayTurn(startTime, timeout)
    {
        this.turnCountDown.node.active = true;
        this.timeStartTurn = startTime;
        this.timeoutTurnMill = timeout * 1000;
        this.timeEndTurn = this.timeStartTurn + this.timeoutTurnMill;
        this.IsMyTurn = true;
    },

    disableCountDown()
    {
        this.IsMyTurn = false;
        this.turnCountDown.node.active = false;
    },

    update(dt)
    {
        if (this.IsMyTurn)
        {
            let timeNow = Date.now();
            let percent = (this.timeEndTurn - timeNow) / this.timeoutTurnMill;
            if (percent > 0)
            {
                this.turnCountDown.progress = percent;
            }
            else
            {
                this.IsMyTurn = false;
                this.turnCountDown.progress = 0;
                this.turnCountDown.node.active = false;
            }
        }
    }
});
