var ObjectPool = require("ObjectPool");

cc.Class({
    extends: cc.Component,

    properties: {
        cardsNode: {
            default: [],
            type: cc.Node
        },
        iconNode: {
            default: [],
            type: cc.Node
        },
        ResultIconPrefab : cc.Prefab,
    },

    onLoad () 
    {
        this.Icons = {};
    },

    display(winner, remainCards)
    {
        var players = Object.keys(remainCards);
        for(var i = 0, len = players.length; i < len; i++)
        {
            var seatIndex = GameMgr.instance.getPlayerSeat(players[i]);
            var cards = remainCards[players[i]];
            var bInstantWin = remainCards[playerWinId].length == 13;
            if(players[i] == winner)
            {
                this.displayWinResult(bInstantWin, seatIndex, cards);
            }
            else
            {
                this.displayLoseResult(bInstantWin, seatIndex, cards);
            }
        }
    },

    GetResultIcon(seatIndex, resultType)
    {
        if(this.Icons[seatIndex + 4 * resultType] == null)
        {
            let icon = cc.instantiate(this.ResultIconPrefab).getComponent("ResultIcon");
            icon.init(resultType);
            this.Icons[seatIndex + 4 * resultType] = icon.node;
        }
        return this.Icons[seatIndex + 4 * resultType];
    },

    hideResultIcon()
    {
        this.iconNode.forEach(icon => 
        {
            icon.removeAllChildren();
        });
        this.RecallCards();
    },
    
    showResultIcon(seatIndex, resultType)
    {
        this.iconNode[seatIndex].addChild(this.GetResultIcon(seatIndex, resultType));
    },

    displayWinResult(bInstantWin, seatIndex, cards)
    {
        if(bInstantWin) 
        {
            this.displayCards(seatIndex, cards);
            this.showResultIcon(seatIndex, Define.RESULT.INSTANT);
        }
        else 
        {
            this.showResultIcon(seatIndex, Define.RESULT.WIN);
        }
    },

    displayLoseResult(bInstantWin, seatIndex, cards)
    {   
        this.displayCards(seatIndex, cards);
        var resultType = GameHelper.getLoseResultType(bInstantWin, cards);
        if(resultType & Define.RESULT.DEAD2)
        {
            this.showResultIcon(seatIndex, Define.RESULT.DEAD2);
        }
        if(resultType & Define.RESULT.BURNED)
        {
            this.showResultIcon(seatIndex, Define.RESULT.BURNED);
        }
        if(resultType & Define.RESULT.FROZEN)
        {
            this.showResultIcon(seatIndex, Define.RESULT.FROZEN);
        }
        if(resultType == Define.RESULT.LOSE)
        {
            this.showResultIcon(seatIndex, Define.RESULT.LOSE);
        }
    },

    displayCards(seatIndex, cards)
    {
        cards.forEach(it => {
            let card = ObjectPool.instance.getCard(it);
            if(card != null)                
            {
                card.setParent(this.cardsNode[seatIndex]);
                card.setScale(0.75, 0.75);
                card.setPosition(0, 0);
            }
        });
    },

    RecallCards()
    {
        this.cardsNode.forEach(cards => {
            while (cards.children.length > 0)
            {
                cards.children[0].setPosition(0, 0);
                cards.children[0].setScale(1, 1);
                ObjectPool.instance.recall(cards.children[0]);
            }
        });
    },
});
