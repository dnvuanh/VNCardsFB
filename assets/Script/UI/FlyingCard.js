cc.Class({
    extends: cc.Component,

    reset()
    {
        this.node.position = cc.Vector2.ZERO;
    },

    fly(destination, flyTime, startTime)
    {
        this.startTime = startTime;
        this.timeEnd = startTime + flyTime;
        this.startFlying = true;
    },

    update(dt)
    {
        
    }
});
