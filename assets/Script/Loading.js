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
        loadingTimeout: 20,
    },
    
    start()
    {
        this.timeout = 0;
    },

    show()
    {
        this.node.active = true;
        this.timeout = this.loadingTimeout;
    },
    
    hide()
    {
        this.timeout = 0;
        this.node.active = false;
    },
    
    update(dt)
    {
        if (this.timeout > 0)
        {
            this.timeout -= dt;
        }
        else
        {
            this.hide();
        }
    }
});
