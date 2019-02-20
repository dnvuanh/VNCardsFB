cc.Class({
    extends: cc.Component,

    properties: {
        display: cc.Sprite
    },

    setCard(value)
    {
        this.cardValue = value;
        this.display.spriteFrame = ImageCache.getSprite("Card_" + value);
        this.node.name = "Card_" + value;
    },
    
    getCard()
    {
        return this.cardValue;
    }
});
