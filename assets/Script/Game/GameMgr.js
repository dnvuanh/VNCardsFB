var GameMgr = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null
    },

    onLoad() {
        GameMgr.instance = this;
        cc.game.addPersistRootNode(this.node);
        this.matchData = {};
        this.RegisterLeave = 0;
        //this.matchData.PlayerReady = [];
    },

    start() {
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_ENTER_SEAT, this.onPlayerEnterSeat.bind(this));
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_LEAVE_SEAT, this.onPlayerLeaveSeat.bind(this));
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_LOAD_MATCH, this.onMatchLoad.bind(this));
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_HOST_CHANGE, this.onHostChange.bind(this));
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_STATE_UPDATE, this.onGameStateUpdate.bind(this));
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_GET_CARDS, this.onCardsReceived.bind(this));
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_TURN_CHANGE, this.onTurnChange.bind(this));
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_THROW_SUCCESS, this.onThrowSuccess.bind(this));
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_GAME_RESULT, this.onGameResult.bind(this));
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_REGISTER_LEAVE, this.onPlayerRegisterLeave.bind(this));
        //GSMgr.instance.registerOpCodeCallback(ServerCode.RP_PLAYER_READY, this.onPlayerReady.bind(this));
        //remove design ready
    },

    onInit() {
        this.startGameScene = true;
    },

    OnMatchFound(message) {
        console.log("Game on match found " + JSON.stringify(message));
        this.onlineList = message.participants;
    },

    OnMatchUpdate(message) {
        console.log("Game on match update " + JSON.stringify(message));
        this.onlineList = message.participants;
        if (message.hasOwnProperty("addedPlayers")) {
            let player = this.onlineList.filter(player => player.id == message.addedPlayers)[0];
            UIManager.instance.addPlayer(player);
        }
        if (message.hasOwnProperty("removedPlayers")) {
            let player = message.removedPlayers[0];
            UIManager.instance.removePlayer(player);
        }
    },

    onMatchLoaded(callback) {
        this.onMatchLoadedCb = callback;
    },

    onMatchLoad(message) {
        this.matchData = JSON.parse(message.getString(1));
        if (this.onMatchLoadedCb)
            this.onMatchLoadedCb();
    },

    getCurrentSeats() {
        if (this.matchData)
            return this.matchData.Seats;
        return {};
    },

    getPlayer(id) {
        return this.onlineList.filter(player => player.id == id)[0];
    },

    getOnlineList() {
        return this.onlineList;
    },

    getHost() {
        return this.matchData.Host;
    },

    IsMeHost()
    {
        return (this.userId == this.matchData.Host || this.matchData.Host == null);
    },

    IsHost(playerId)
    {
        return (playerId == this.matchData.Host || this.matchData.Host == null);
    },

    UpdateUserInfo(message) {
        this.userId = message.userId;
    },

    getMyId() {
        return this.userId;
    },

    getMySeat() {
        return this.MySeat;
    },

    IsMyId(id) {
        return this.userId == id;
    },

    getOnlineSeatCount() {
        return Object.keys(this.matchData.Seats).length;
    },

    onPlayerEnterSeat(message) {
        let playerId = message.getString(1);
        let seat = message.getLong(2);
        this.matchData.Seats[seat] = playerId;
        UIManager.instance.playerEnterSeat(this.getPlayer(playerId), seat);

        if (this.IsMyId(playerId)) {
            this.MySeat = seat;
        }
    },

    onPlayerReady(message) {
        let playerId = message.getString(1);
        let isReady = message.getLong(2);
        if (isReady)
        {
            this.matchData.PlayerReady.push(playerId);
        }
        else
        {
            let index = this.matchData.PlayerReady.indexOf(playerId);
            this.matchData.PlayerReady.splice(index, 1);
        }
        UIManager.instance.onPlayerReady(playerId, isReady);
    },

    onPlayerLeaveSeat(message) {
        let playerId = message.getString(1);
        let seat = message.getLong(2);
        this.matchData.Seats[seat] = null;
        UIManager.instance.playerLeaveSeat(seat);

        if (this.IsMyId(playerId)) {
            this.MySeat = null;
        }
    },

    onHostChange(message) {
        let playerId = message.getString(1);
        this.matchData.Host = playerId;
        UIManager.instance.setHost(playerId);
    },

    onGameStateUpdate(message) {
        this.matchData.State = message.getLong(1);
        console.log('GameState Change ' + this.matchData.State);
        switch (this.matchData.State) {
            case Define.GameState.WAITING:
                this.onGameStateWaiting();
                break;

            case Define.GameState.READY:
                let timeStamp = message.getLong(2);
                this.onGameStateReady(timeStamp);
                break;

            case Define.GameState.GAMEOVER:
                this.onGameOver();
                break;

            case Define.GameState.STARTED:
                this.onGameStart();
                break;
        }
    },

    onGameStateWaiting() {
        UIManager.instance.onGameWaiting();
    },

    onGameStateReady(timeStamp) {
        UIManager.instance.onGameStateReady(timeStamp);
    },

    onGameOver() {
        UIManager.instance.onGameOver();
    },

    onCardsReceived(message) {
        let cards = JSON.parse(message.getString(1));
        cards.sort((a, b) => a - b);
        UIManager.instance.onCardsReceived(cards);
    },

    onTurnChange(message) {
        let playerId = message.getString(1);
        let startTime = message.getLong(2);
        let timeout = message.getLong(3);
        this.matchData.TurnKeeper = playerId;
        this.matchData.TimeBeginTurn = startTime;
        UIManager.instance.onTurnChange(playerId, startTime, timeout);
    },

    onThrowSuccess(message) {
        let playerId = message.getString(1);
        let cards = JSON.parse(message.getString(2));
        UIManager.instance.onThrowSuccess(playerId, cards);
    },

    onGameResult(message)
    {
        let scores = JSON.parse(message.getString(1));
        let playerWinId = message.getString(2);
        let playersCards = {};
        for(var i = 0, seats = this.getOnlineSeatCount(); i < seats; i++)
        {
            let playerId = message.getString(3 + i * 2);
            let cards = JSON.parse(message.getString(3 + i * 2 + 1));
            playersCards[playerId] = cards;
        }
        UIManager.instance.displayResult(scores, playerWinId, playersCards);
    },

    onPlayerRegisterLeave(message)
    {
        let isLeave = message.getLong(1);
        this.RegisterLeave = isLeave;
        UIManager.instance.onPlayerRegisterLeave(isLeave);
    },

    IsRegisterLeave()
    {
        return this.RegisterLeave;
    },

    onGameStart()
    {
        UIManager.instance.onGameStart();
    }
});