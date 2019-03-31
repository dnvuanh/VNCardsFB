// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        secondString: cc.Label
    },

    start()
    {
        this.node.active = false;
    },

    show(timeStart, totalSecond)
    {
        this.secondString.node.display = true;
        this.timeStart = timeStart;
        this.secondString.string = totalSecond;
        this.currentDisplay = totalSecond;
        this.totalSecond = totalSecond;
    },

    hide()
    {
        this.node.active = false;
    },

    update(dt)
    {
        let timeNow = Date.now();
        let remainSecond = this.totalSecond - Math.floor((timeNow - this.timeStart)/1000);
        if (remainSecond > 0)
        {
            if (remainSecond <= this.currentDisplay)
            {
                this.secondString.string = remainSecond;
                this.currentDisplay = remainSecond;
            }
        }
        else
        {
            this.hide();
        }
    }
});
