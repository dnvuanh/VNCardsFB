
cc.Class({
    extends: cc.Component,

    properties: {
        sprite: cc.Sprite,
        textures: {
            default: [],
            type: cc.SpriteFrame
        },
        number: -1,
    },

    start () {

    },

    init(number) {
        this.sprite.spriteFrame = this.textures[number - 12];
        this.number = number;
    }
});
