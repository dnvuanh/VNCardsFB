cc.Class({
    extends: cc.Component,

    properties: {
        cardsOfEach: 13,
        flyingTime: 0.4,
        delayTime: 0.1,
        destination: [cc.Node]
    },

    startAnim(callbackEveryTurn)
    {
        this.deliveryCount = 0;
        this.startFlying = true;
        this.callbackEveryTurn = callbackEveryTurn;
        for (var i=0; i<this.node.children.length; i++)
        {
            let cardOrder = (i/this.destination.length);
            let position = this.destination[(i % this.destination.length)].position;
            let delayTime = new cc.DelayTime(cardOrder * this.delayTime);
            let moveTo = new cc.MoveTo(this.flyingTime, position);
            let rotateTo = new cc.rotateBy(this.flyingTime, 360, 360);
            let moveAndRotate = new cc.Spawn(moveTo, rotateTo);
            let finish = new cc.callFunc(this.onCardDelivery, this, this.node.children[i]);
            let sequence = new cc.Sequence(delayTime, /*cc.callFunc(() => SoundMgr.instance.play("deal", false, 0.6)),*/ moveAndRotate, finish);
            this.node.children[i].active = true;
            this.node.children[i].runAction(sequence);
        }
    },

    onCardDelivery(card)
    {
        this.deliveryCount += 1;
        card.setPosition(0,0);
        card.active = false;
        if (this.deliveryCount % this.destination.length == 0)
        {
            this.callbackEveryTurn();
        }
    }
});
