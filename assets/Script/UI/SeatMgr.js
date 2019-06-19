cc.Class({
    extends: cc.Component,

    properties: {
        SeatPrefab : cc.Prefab,
        displayNode: cc.Node,
    },
    
    onLoad()
    {
        this.cachedPlayersPos = [];
        this.Seats = [];
        this.SeatMapping = [0,1,2,3];

        let totalSeats = this.displayNode.children.length;
        for (let i=0; i<totalSeats; i++)
        {
            let display = this.displayNode.getChildByName("display_" + i);
            this.cachedPlayersPos[i] = display.position;
            this.Seats[i] = cc.instantiate(this.SeatPrefab).getComponent("SeatDisplay");
            this.Seats[i].onInit(i, this.cachedPlayersPos[i]);
            this.Seats[i].node.position = display.position;
            this.Seats[i].node.parent = this.displayNode;
            this.Seats[i].node.active = false;
        }
    },

    refreshSeats(Seats, status)
    {
        for (var seat in Seats)
        {
            let playerId = Seats[seat];
            if (playerId)
            {
                let playerInfo = GameMgr.instance.getPlayer(playerId);
                let additionalInfo = GameMgr.instance.getAdditionalInfo(playerId);
                this.onPlayerEnter(playerInfo, seat, additionalInfo, status.indexOf(playerId) > -1);
            }
        }
        let host = GameMgr.instance.getHost();
        if (host)
            this.setHost(host);
    },

    onPlayerEnter(playerInfo, seat, additionalInfo, isReady)
    {
        if (seat < this.Seats.length)
        {
            var seatDisplay = this.Seats[seat];
                seatDisplay.node.active = true;
                seatDisplay.display(playerInfo, additionalInfo, isReady);
            if (!GameMgr.instance.getHost() || GameMgr.instance.getHost() == playerInfo.id)
            {
                this.setHost(playerInfo.id);
            }
        }
        /*if (GameMgr.instance.IsMyId(playerInfo.id))
        {
            this.RotateSeats(seat);
        }*/
    },

    RotateSeats(mySeat)
    {
        Notification.instance.add("Moving Player Position");
        for (let i=0; i < this.Seats.length; i++)
        {
            let offset = (i - mySeat) >= 0 ? (i - mySeat) : (i - mySeat + 4);
            let fadeOut = cc.fadeOut(0.2);
            let movePosition = cc.callFunc(() => this.Seats[i].node.position = this.cachedPlayersPos[offset]);
            let fadeIn = cc.fadeIn(0.2);
            this.Seats[i].node.runAction(cc.sequence(fadeOut, cc.delayTime(0.1), movePosition, fadeIn));
            /*var movePosition = cc.moveTo(0.5,this.cachedPlayersPos[offset]);
            this.Seats[i].node.runAction(movePosition);
            this.Seats[i].setPositionAfterRotate(offset);*/
        }
    },

    onPlayerLeave(seat)
    {
        if (seat < this.Seats.length)
        {
            var seatDisplay = this.Seats[seat];
                seatDisplay.remove();
                seatDisplay.node.active = false;
        }
    },

    setHost(playerId)
    {
        for (var i=0; i<this.Seats.length; i++)
        {
            var seatDisplay = this.Seats[i];
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
        for (var i=0; i<this.Seats.length; i++)
        {
            var seatDisplay = this.Seats[i];
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
        for (var i=0; i<this.Seats.length; i++)
        {
            var seatDisplay = this.Seats[i];
                seatDisplay.disableCountDown();
        }
    },

    onPlayerReady(playerId, isReady)
    {
        for (var i=0; i<this.Seats.length; i++)
        {
            var seatDisplay = this.Seats[i];
            if (seatDisplay && seatDisplay.getPlayerId() == playerId)
            {
                seatDisplay.setReady(isReady);
            }
        }
    },

    getPlayerSeat(playerId)
    {
        for (var i = 0; i < this.Seats.length; i++)
        {
            var seatDisplay = this.Seats[i];
            if (seatDisplay && seatDisplay.getPlayerId() == playerId)
            {
                return seatDisplay.getPositionAfterRotate();
            }
        }
        return -1;
    },

    updateResult()
    {
        for (var i = 0; i < this.Seats.length; i++)
        {
            var seatDisplay = this.Seats[i];
                seatDisplay.updateResult();
        }
    },

    onRequestSeat(target, data)
    {
        GSMgr.instance.requestSeat(data);
    },

    clearAll()
    {
        this.Seats.forEach(seatDisplay => seatDisplay.remove());
    },
});
