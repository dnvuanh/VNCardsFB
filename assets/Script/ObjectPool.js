var ObjectPool = cc.Class({
    extends: cc.Component,

    properties: {
        Card: cc.Prefab
    },

    statics: {
        instance: null
    },

    onLoad()
    {
        ObjectPool.instance = this; 
        this.InitPool();
    },

    InitPool()
    {
        this.InitPoolCard();
    },
    
    InitPoolCard()
    {
        for (var i = 0; i < 52; i++)
        {
            let card = cc.instantiate(this.Card).getComponent("Card");
                card.setCard(i+12);
                card.node.setParent(this.node);
                card.node.active = false;
        }
    },

    getCard(value)
    {
        let card = this.node.getChildByName("Card_" + value);
        if (card)
        {
            card.active = true;
            return card;
        }
        else
            return null;
    },

    recall(obj)
    {
        obj.setParent(this.node);
        obj.active = false;
    }
});
