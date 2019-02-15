
cc.Class({
    extends: cc.Component,

    properties: {
        sprite: cc.Sprite,
        textures: {
            default: [],
            type: cc.SpriteFrame
        },
        index: -1,
    },

    start () {

    },

    init(index) {
        this.sprite.spriteFrame = this.textures[index - 12];
        this.index = index;
    }
});
