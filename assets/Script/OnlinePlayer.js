cc.Class({
    extends: cc.Component,

    properties: {
        avatar: cc.Sprite,
        displayName: cc.Label
    },

    display(userId, photo, name)
    {
        this.userId = userId;
        if (photo != "default")
        {
            cc.loader.load(photo, ((err, img) => {
                if (err)
                {
                    cc.error(err);
                    return;
                }
                this.avatar.spriteFrame = new cc.SpriteFrame(img);
            }).bind(this));
        }
        this.displayName.string = name;
    },
});
