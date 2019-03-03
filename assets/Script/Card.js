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
        this.up = false;
    },
    
    getCard()
    {
        return this.cardValue;
    },

    onClick() 
    {
        let position = this.node.getPosition();
        if(!this.up) {
            this.node.setPosition(position.x, position.y + 50);
            this.up = true;
            GameMgr.instance.pushCard(this.getCard());
        } else {
            this.node.setPosition(position.x, position.y - 50);
            this.up = false;
            GameMgr.instance.popCard(this.getCard());
        }
    }
});
