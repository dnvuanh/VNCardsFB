(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Singleton/ImageCache.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '858216Ov8NPy70BXz0rki8i', 'ImageCache', __filename);
// Script/Singleton/ImageCache.js

"use strict";

var ImageCache = cc.Class({
    ctor: function ctor() {
        this.cachedImages = {};
    },
    Init: function Init(callback) {
        this.addRes("default", "Texture/default");
        for (var i = 12; i < 64; i++) {
            this.addRes("Card_" + i, "Texture/Cards/" + "Card_" + i);
        }callback();
    },
    addRes: function addRes(id, path) {
        var _this = this;

        if (!this.cachedImages[id]) {
            this.cachedImages[id] = path;
            cc.loader.loadRes(path, function (err, img) {
                if (err) {
                    cc.error(err);return;
                }
                _this.cachedImages[id] = img;
            }.bind(this));
        }
    },
    load: function load(id, URL) {
        var _this2 = this;

        if (!this.cachedImages[id]) {
            this.cachedImages[id] = URL;
            cc.loader.load(URL, function (err, img) {
                if (err) {
                    cc.error(err);return;
                }
                _this2.cachedImages[id] = img;
            }.bind(this));
        }
    },
    addImage: function addImage(id, img) {
        if (!this.cachedImages[id]) this.cachedImages[id] = img;else {
            console.warn("image with id " + id + " is already in cached list");
        }
    },
    getImage: function getImage(id) {
        if (!this.cachedImages[id]) {
            console.error("Image id: " + id + " was not added to cached list");
            id = "default";
        }
        return this.cachedImages[id];
    },
    loadAvatar: function loadAvatar(userId, photo, callback) {
        var _this3 = this;

        if (photo == "default") {
            callback(new cc.SpriteFrame(this.cachedImages[photo]));
        } else if (this.cachedImages[userId]) {
            callback(new cc.SpriteFrame(this.cachedImages[userId]));
        } else {
            cc.loader.load(photo, function (err, img) {
                if (err) {
                    callback(null);
                }
                _this3.cachedImages[userId] = img;
                callback(new cc.SpriteFrame(_this3.cachedImages[userId]));
            }.bind(this));
        }
    },
    getSprite: function getSprite(id) {
        return new cc.SpriteFrame(this.getImage(id));
    }
});

module.exports = new ImageCache();

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
        //# sourceMappingURL=ImageCache.js.map
        