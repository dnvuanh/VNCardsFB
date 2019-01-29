var ImageCache = cc.Class({

    ctor() {
        this.cachedImages = {};
    },

    Init(callback)
    {
        this.addRes("default", "Texture/default");
        callback();
    },

    addRes(id, path) {
        if (!this.cachedImages[id]) {
            this.cachedImages[id] = path;
            cc.loader.loadRes(path, ((err, img) => {
                if (err) { cc.error(err); return; }
                this.cachedImages[id] = img;
            }).bind(this));
        }
    },

    load(id, URL) {
        if (!this.cachedImages[id]) {
            this.cachedImages[id] = URL;
            cc.loader.load(URL, ((err, img) => {
                if (err) { cc.error(err); return; }
                this.cachedImages[id] = img;
            }).bind(this));
        }
    },

    addImage(id, img)
    {
        if (!this.cachedImages[id])
            this.cachedImages[id] = img;
        else
        {
            console.warn("image with id " + id + " is already in cached list");
        }
    },

    getImage(id) {
        if (!this.cachedImages[id]) {
            console.error("Image id: " + id + " was not added to cached list");
            id = "default";
        }
        return this.cachedImages[id];
    },

    loadAvatar(userId, photo, callback)
    {
        if (photo == "default")
        {
            callback(new cc.SpriteFrame(this.cachedImages[photo]));
        }
        else if (this.cachedImages[userId])
        {
            callback(new cc.SpriteFrame(this.cachedImages[userId]));
        }
        else
        {
            cc.loader.load(photo, ((err, img) => {
                if (err)
                {
                    callback(null);
                }
                this.cachedImages[userId] = img;
                callback(new cc.SpriteFrame(this.cachedImages[userId]));
            }).bind(this));
        }
    },

    getSprite(id) {
        return new cc.SpriteFrame(this.getImage(id));
    },
});

module.exports = new ImageCache();