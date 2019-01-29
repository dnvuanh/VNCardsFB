cc.Class({
    extends: cc.Component,

    
    start()
    {
        let seats = GameMgr.instance.getCurrentSeats();
        for (var seat in seats)
        {
            let playerId = seats[seat];
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
    }
});
