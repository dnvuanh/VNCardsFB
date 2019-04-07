cc.Class({
    extends: cc.Component,

    properties: {

    },
    
    onLoad()
    {
        this.cachedPlayersPos = [];
        this.cachedResultPos = [];
        this.cachedCardsPos = [];
        
        for (let i=0; i<this.node.children.length; i++)
        {
            this.cachedPlayersPos[i] = this.node.children[i].position;
            this.cachedResultPos[i] = this.node.children[i].getChildByName("display").getChildByName("ResultIcon").position;
            this.cachedCardsPos[i] = this.node.children[i].getChildByName("display").getChildByName("cards").position;
        }
    },

    refreshSeats(Seats)
    {
        for (var seat in Seats)
        {
            let playerId = Seats[seat];
            if (playerId)
            {
                let playerInfo = GameMgr.instance.getPlayer(playerId);
                this.onPlayerEnter(playerInfo, seat);
            }
        }
        let host = GameMgr.instance.getHost();
        if (host)
            this.setHost(host);
    },

    onPlayerEnter(playerInfo, seat)
    {
        if (seat < this.node.children.length)
        {
            var seatDisplay = this.node.children[seat].getComponent("SeatDisplay");
                seatDisplay.display(playerInfo);
        }
        if (GameMgr.instance.IsMyId(playerInfo.id))
        {
            this.RotateSeats(seat);
        }
    },

    RotateSeats(mySeat)
    {
        Notification.instance.add("Moving Player Position");
        for (let i=0; i < this.node.children.length; i++)
        {
            let offset = (i - mySeat) >= 0 ? (i - mySeat) : (i - mySeat + 4);
            /*let fadeOut = cc.fadeOut(0.2);
            let movePosition = cc.callFunc(() => this.node.children[i].position = this.cachedPlayersPos[offset]);
            let fadeIn = cc.fadeIn(0.2);
            this.node.children[i].runAction(cc.sequence(fadeOut, cc.delayTime(0.1), movePosition, fadeIn));*/
            var movePosition = cc.moveTo(0.5,this.cachedPlayersPos[offset]);
            this.node.children[i].runAction(movePosition);
            var cardsNode = this.node.children[i].getChildByName("display").getChildByName("cards");
            var resultNode = this.node.children[i].getChildByName("display").getChildByName("ResultIcon");
            cardsNode.angle = 90 * (offset % 2);
            cardsNode.setPosition(this.cachedCardsPos[offset]);
            resultNode.setPosition(this.cachedResultPos[offset]);
        }
    },

    onPlayerLeave(seat)
    {
        if (seat < this.node.children.length)
        {
            var seatDisplay = this.node.children[seat].getComponent("SeatDisplay");
                seatDisplay.remove();
        }
    },

    setHost(playerId)
    {
        for (var i=0; i<this.node.children.length; i++)
        {
            var seatDisplay = this.node.children[i].getComponent("SeatDisplay");
            if (seatDisplay && seatDisplay.getPlayerId() == playerId)
            {
                seatDisplay.setHost(true);
            }
            else
            {
                seatDisplay && seatDisplay.setHost(false);
            }
        }
    },

    onTurnChange(playerId, startTime, timeout)
    {
        for (var i=0; i<this.node.children.length; i++)
        {
            var seatDisplay = this.node.children[i].getComponent("SeatDisplay");
            if (seatDisplay && seatDisplay.getPlayerId() == playerId)
            {
                seatDisplay.displayTurn(startTime, timeout);
            }
            else
            {
                seatDisplay.disableCountDown();
            }
        }
    },

    stopAllTurn()
    {
        for (var i=0; i<this.node.children.length; i++)
        {
            var seatDisplay = this.node.children[i].getComponent("SeatDisplay");
                seatDisplay.disableCountDown();
        }
    },

    displayResult(playerWinId, playersCards)
    {
        for (var i=0; i<this.node.children.length; i++)
        {
            var seatDisplay = this.node.children[i].getComponent("SeatDisplay");
            if (seatDisplay && seatDisplay.getPlayerId() != null)
            {
                var cards = playersCards[seatDisplay.getPlayerId()];
                var bInstantWin = playersCards[playerWinId].length == 13;
                if(seatDisplay.getPlayerId() == playerWinId)
                {
                    seatDisplay.displayWinResult(bInstantWin, cards);
                }
                else 
                {
                    seatDisplay.displayLoseResult(bInstantWin, cards);
                }
            }
        }
    },

    hideResultIcon()
    {
        for (var i=0; i<this.node.children.length; i++)
        {
            var seatDisplay = this.node.children[i].getComponent("SeatDisplay");
            seatDisplay.hideResultIcon();
            if (seatDisplay && seatDisplay.getPlayerId() != null)
            {
                seatDisplay.RecallCards();
            }
        }
    },

    onPlayerReady(playerId, isReady)
    {
        for (var i=0; i<this.node.children.length; i++)
        {
            var seatDisplay = this.node.children[i].getComponent("SeatDisplay");
            if (seatDisplay && seatDisplay.getPlayerId() == playerId)
            {
                seatDisplay.setReady(isReady);
            }
        }
    }
    
});
