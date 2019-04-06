cc.Class({
    extends: cc.Component,

    properties: {
    },

    start () {

    },

    init(type)
    {
        var sprite = ImageCache.getSprite("Result_Lose");
        switch(type)
        {
            case Define.RESULT.WIN:
                sprite = ImageCache.getSprite("Result_Win");
                break;
            case Define.RESULT.INSTANT:
                sprite = ImageCache.getSprite("Result_InstantWin");
                break;
            case Define.RESULT.BURNED:
                sprite = ImageCache.getSprite("Result_Burned");
                break;
            case Define.RESULT.FROZEN:
                sprite = ImageCache.getSprite("Result_Frozen");
                break;
            case Define.RESULT.DEAD2:
                sprite = ImageCache.getSprite("Result_Dead2");
                break;
            default: // LOSE
                //sprite = ImageCache.getSprite("Result_Lose");
        }
        this.node.setPosition(0, 0);
        this.node.getComponent(cc.Sprite).spriteFrame = sprite;
    },
});
