cc.Class({
    extends: cc.Component,

    properties: {
        display: cc.Sprite,
        selectedPosition: 0
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

    onSelect()
    {
        this.isSelected = true;
        this.node.y = this.selectedPosition;
    },

    onDeselect()
    {
        this.isSelected = false;
        this.node.y = 0;
    },

    onClick()
    {
        if (this.isSelected)
        {
            this.onDeselect();
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
});
