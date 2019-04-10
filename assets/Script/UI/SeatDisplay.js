var ObjectPool = require("ObjectPool");

cc.Class({
    extends: cc.Component,

    properties: {
        displayNode: cc.Node,
        avatar: cc.Sprite,
        userName: cc.Label,
        money: cc.Label,
        hostIcon: cc.Node,
        turnCountDown: cc.ProgressBar,
        resultNode: cc.Node,
        cardsNode: cc.Node,
        ResultIconPrefab : cc.Prefab,
        resultNode : cc.Node,
    },

    onInit(index, position)
    {
        this.displayNode.active = false;
        this.hostIcon.active = false;
        this.turnCountDown.node.active = false;
        this.IsMyTurn = false;
        this.resultNode.active = false;
        this.cardsNode.active = false;
        this.ResultNodes = {};
        this.index = index;
        this.node.setPosition(position);
    },

    display(playerInfo)
    {
        this.playerId = playerInfo.id;
        let photo = playerInfo.scriptData.Photo;
        let displayName = playerInfo.displayName;

        ImageCache.loadAvatar(this.playerId, photo, (imgSprite)=>{
            if (imgSprite)
            {
                this.avatar.spriteFrame = imgSprite;
            }
            else
            {
                console.log("Error while loading user avatar " + this.playerId);
            }
            this.userName.string = displayName;
            this.displayNode.active = true;
        });
    },

    getPlayerId()
    {
        return this.playerId;
    },

    remove()
    {
        this.playerId = null;
        this.hostIcon.active = false;
        this.displayNode.active = false;
    },

    setHost(isHost)
    {
        this.hostIcon.active = isHost;
    },

    displayTurn(startTime, timeout)
    {
        this.turnCountDown.node.active = true;
        this.timeStartTurn = startTime;
        this.timeoutTurnMill = timeout * 1000;
        this.timeEndTurn = this.timeStartTurn + this.timeoutTurnMill;
        this.IsMyTurn = true;
    },

    disableCountDown()
    {
        this.IsMyTurn = false;
        this.turnCountDown.node.active = false;
    },

    GetResultIcon(resultType)
    {
        if(this.ResultNodes[resultType] == null)
        {
            let icon = cc.instantiate(this.ResultIconPrefab).getComponent("ResultIcon");
            icon.init(resultType);
            this.ResultNodes[resultType] = icon.node;
        }
        return this.ResultNodes[resultType];
    },

    hideResultIcon()
    {
        this.resultNode.removeAllChildren();
        this.resultNode.active = false;
    },
    
    showResultIcon(resultType)
    {
        this.resultNode.addChild(this.GetResultIcon(resultType))
    },

    displayWinResult(bInstantWin, cards)
    {
        if(bInstantWin) 
        {
            this.displayCards(cards);
            this.showResultIcon(Define.RESULT.INSTANT);
        }
        else 
        {
            this.showResultIcon(Define.RESULT.WIN);
        }
        this.resultNode.active = true;
    },

    displayLoseResult(bInstantWin, cards)
    {   
        this.displayCards(cards);
        var resultType = GameHelper.getLoseResultType(bInstantWin, cards);
        if(resultType & Define.RESULT.DEAD2)
        {
            this.showResultIcon(Define.RESULT.DEAD2);
        }
        if(resultType & Define.RESULT.BURNED)
        {
            this.showResultIcon(Define.RESULT.BURNED);
        }
        if(resultType & Define.RESULT.FROZEN)
        {
            this.showResultIcon(Define.RESULT.FROZEN);
        }
        if(resultType == Define.RESULT.LOSE)
        {
            this.showResultIcon(Define.RESULT.LOSE);
        }
        this.resultNode.active = true;
    },

    displayCards(cards)
    {
        let idx = 0;
        this.cardsNode.active = true;
        cards.forEach(it => {
            let card = ObjectPool.instance.getCard(it);
            if(card != null)                
            {
                card.setParent(this.cardsNode);
                card.setScale(0.5, 0.5);
                card.setPosition(0, 0);
            }
        });
    },

    RecallCards()
    {
        while (this.cardsNode.children.length > 0)
        {
            this.cardsNode.children[0].setPosition(0, 0);
            this.cardsNode.children[0].setScale(1, 1);
            ObjectPool.instance.recall(this.cardsNode.children[0]);
        }
        this.cardsNode.active = false;
    },

    update(dt)
    {
        if (this.IsMyTurn)
        {
            let timeNow = Date.now();
            let percent = (this.timeEndTurn - timeNow) / this.timeoutTurnMill;
            if (percent > 0)
            {
                this.turnCountDown.progress = percent;
            }
            else
            {
                this.IsMyTurn = false;
                this.turnCountDown.progress = 0;
                this.turnCountDown.node.active = false;
            }
        }
    },

    setReady(isReady)
    {
        if (isReady)
        {
            this.node.opacity = 255;
        }
        else
        {
            this.node.opacity = 125;
        }
    },

    onClick()
    {
        GSMgr.instance.requestSeat(this.index);
    }
});
