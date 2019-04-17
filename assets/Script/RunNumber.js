cc.Class({
    extends: cc.Component,

    runTo(value, time)
    {
        this.currentValue = parseInt(this.getComponent(cc.Label).string) || 0;
        this.newValue = value;
        this.offset = Math.abs(this.newValue - this.currentValue);
        this.time = time;
        this.runTime = 0;
    },

    update(dt)
    {
        if (this.runTime < this.time)
        {
            this.runTime += dt;
            this.currentValue += (dt / this.time) * this.offset;
            if (this.runTime >= this.time)
            {
                this.runTime = this.time;
                this.currentValue = this.newValue;
            }
            this.getComponent(cc.Label).string = Math.floor(this.currentValue);
        }
    }
});
