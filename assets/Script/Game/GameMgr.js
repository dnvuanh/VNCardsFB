var GameState = {
    PENDING:0,
    WAIT:1,
    STARTED:2,
    OVER:3
};

var GameMgr = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null
    },

    onLoad()
    {
        GameMgr.instance = this;
        cc.game.addPersistRootNode(this.node);
        this.matchData={};
    },

    start()
    {
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_ENTER_SEAT, this.onPlayerEnterSeat.bind(this));
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_LEAVE_SEAT, this.onPlayerLeaveSeat.bind(this));
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_LOAD_MATCH, this.onMatchLoad.bind(this));
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_HOST_CHANGE, this.onHostChange.bind(this));
    },

    onInit()
    {
        this.startGameScene = true;
        this.state = GameState.PENDING;
    },

    OnMatchFound(message)
    {
        console.log("Game on match found " + JSON.stringify(message));
        this.onlineList = message.participants;
    },

    OnMatchUpdate(message)
    {
        console.log("Game on match update " + JSON.stringify(message));
        this.onlineList = message.participants;
        if (message.hasOwnProperty("addedPlayers"))
        {
            let player = this.onlineList.filter(player => player.id == message.addedPlayers)[0];
                UIManager.instance.addPlayer(player);
        }
        if (message.hasOwnProperty("removedPlayers"))
        {
            let player = message.removedPlayers[0];
                UIManager.instance.removePlayer(player);
        }
    },

    onMatchLoaded(callback)
    {
        this.onMatchLoadedCb = callback;
    },

    onMatchLoad(message)
    {
        this.matchData = JSON.parse(message.getString(1));
        if (this.onMatchLoadedCb)
            this.onMatchLoadedCb();
    },

    getCurrentSeats()
    {
        if (this.matchData)
            return this.matchData.Seats;
        return {};
    },

    getPlayer(id)
    {
        return this.onlineList.filter(player => player.id == id)[0];
    },

    getOnlineList()
    {
        return this.onlineList;
    },

    getHost()
    {
        return this.matchData.Host;
    },

    UpdateUserInfo(message) {
        this.userId = message.userId;
    },

    onPlayerEnterSeat(message)
    {
        let playerId = message.getString(1);
        let seat = message.getLong(2);
            this.matchData.Seats[seat] = playerId;
            UIManager.instance.playerEnterSeat(this.getPlayer(playerId), seat);
        
        if(this.userId == this.getHost()){
            UIManager.instance.setEnableStartButton(true);
        } else {
            UIManager.instance.setEnableStartButton(false);
        }
    },

    onPlayerLeaveSeat(message)
    {
        let playerId = message.getString(1);
        let seat = message.getLong(2);
            this.matchData.Seats[seat] = null;
            UIManager.instance.playerLeaveSeat(seat);
    },

    onHostChange(message)
    {
        let playerId = message.getString(1);
            this.matchData.Host = playerId;
            UIManager.instance.setHost(playerId);
    },

    onGameStart()
    {

    },

    onGameOver()
    {

    },
});