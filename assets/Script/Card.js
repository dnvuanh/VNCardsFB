cc.Class({
    extends: cc.Component,

    properties: {
        display: cc.Sprite,
        selectedPosition: 0
    },

    setCard(value)
    {
        this.cardValue = value;
        this.display.spriteFrame = ImageCache.getSprite("Card_" + value, "Cards");
        this.node.name = "Card_" + value;
        this.up = false;
    },
    
    getCard()
    {
        return this.cardValue;
    },

    onSelect()
    {
        this.isSelected = true;
        this.node.runAction(cc.moveTo(0.1, this.node.x, this.selectedPosition));
    },

    onDeselect(playAnim)
    {
        this.isSelected = false;
        if (playAnim)
            this.node.runAction(cc.moveTo(0.1, this.node.x, 0));
        else
        {
            this.node.position.y = 0;
        }
    },

    onClick()
    {
        if (this.isSelected)
        {
            this.onDeselect(true);
        }
        else
        {
            this.onSelect();
        }
        UIManager.instance.checkThrowable();
    },

    IsSelected()
    {
        return this.isSelected;
    },

    reset()
    {
        this.isSelected = false;
        this.node.scale = cc.Vec2.ONE;
    }
});
