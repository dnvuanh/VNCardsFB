cc.Class({
    extends: cc.Component,

    properties: {
        avatar: cc.Sprite,
        displayName: cc.Label
    },

    display(userId, photo, name, callback)
    {
        this.userId = userId;
        this.displayName.string = name;
        if (photo != "default")
        {
            ImageCache.loadAvatar(userId, photo, (imgSprite)=>{
                if (imgSprite)
                {
                    this.avatar.spriteFrame = imgSprite;
                }
                else
                {
                    console.log("Error while loading user avatar " + userId);
                }
                callback();
            });
        }
        else
        {
            callback();
        }
    },
});
