cc.Class({
    extends: cc.Component,

    properties: {
        SeatPrefab : cc.Prefab,
        displayNode: cc.Node,
        Seats: [require("SeatDisplay")],
    },
    
    onLoad()
    {
        this.cachedPlayersPos = [];
        this.SeatMapping = [0,1,2,3];
        for (let i=0; i<this.Seats.length; i++)
        {
            let seat = this.Seats[i].node;
                seat.active = false;

            this.cachedPlayersPos[i] = seat.position;
        }
    },

    start()
    {
        this.refreshSeats();
    },

    refreshSeats()
    {
        let matchData = GameMgr.instance.getMatchData();
        let Seats = matchData.Seats;
        let status = matchData.Ready;

        if (Seats && Seats.length > 0)
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
        }
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
        let offset = this.SeatMapping.indexOf(mySeat);
        Utils.shiftArray(this.SeatMapping, offset);
        let swapPosition = cc.callFunc(()=>{
            for (let i=0; i < this.SeatMapping.length; i++)
            {
                this.Seats[this.SeatMapping[i]].node.position = this.cachedPlayersPos[i];
            }
        });
        this.displayNode.runAction(cc.sequence(cc.fadeOut(0.2), cc.delayTime(0.5), swapPosition, cc.fadeIn(0.2)));
    },

    getSeat(playerId)
    {
        for (let i=0; i<this.Seats.length; i++)
        {
            if (this.Seats[i].getPlayerId() == playerId)
            {
                return this.Seats[i].node;
            }
        }
        return null;
    },

    onPlayerLeave(seat)
    {
        if (seat < this.Seats.length)
        {
            var seatDisplay = this.Seats[seat];
                seatDisplay.remove();
                seatDisplay.node.active = false;
        }
        if (seat == GameMgr.instance.getMySeat())
        {
            this.Seats.forEach(seat =>{
                seat.remove();
                seat.node.active = false;
            });
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
        GSMgr.instance.requestSeat(this.SeatMapping[parseInt(data)]);
    },

    clearAll()
    {
        this.Seats.forEach(seatDisplay => seatDisplay.remove());
    },
});
