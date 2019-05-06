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
        this.myCards = null;
        //this.matchData.PlayerReady = [];
        this.matchData.AdditionInfos = {};
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
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_REQUEST_ERROR, this.onErrorResponse.bind(this));
        //GSMgr.instance.registerOpCodeCallback(ServerCode.RP_PLAYER_READY, this.onPlayerReady.bind(this));
        //remove design ready
    },

    refreshMatchStatus() {
        this.startGameScene = true;
        //this.matchData.Host && UIManager.instance.setHost(this.matchData.Host);
        this.matchData.Seats && UIManager.instance.refreshSeats(this.matchData.Seats);
        if (this.matchData.State == Define.GameState.RUNNING)
        {
            //this.myCards && UIManager.instance.onCardsReceived(this.myCards, false);
            this.matchData.TurnKeeper && UIManager.instance.onTurnChange(this.matchData.TurnKeeper, this.matchData.TimeBeginTurn, this.matchData.Timeout);
            this.matchData.CurrentCards && UIManager.instance.onThrowSuccess(this.matchData.PreviousThrowPlayerId, this.matchData.CurrentCards);
        }
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

    onMatchLoad(message) {
        this.matchData = JSON.parse(message.getString(1));
        this.refreshMatchStatus();
    },

    getCurrentSeats() {
        if (this.matchData)
            return this.matchData.Seats;
        return {};
    },

    getMycards() {
        return this.myCards;
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
        if (message.scriptData && message.scriptData.lastMatchInfo)
            this.lastMatchInfo = message.scriptData.lastMatchInfo
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

    getPlayerSeat(playerId) {
        return UIManager.instance.getPlayerSeat(playerId);
    },

    onPlayerEnterSeat(message) {
        let playerId = message.getString(1);
        let seat = message.getLong(2);
        this.matchData.Seats[seat] = playerId;
        this.matchData.AdditionInfos[playerId] = JSON.parse(message.getString(3));;
        UIManager.instance.playerEnterSeat(this.getPlayer(playerId), seat, this.matchData.AdditionInfos[playerId]);

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
        UIManager.instance.setHost(this.matchData.Host);
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
        this.myCards = cards;
        let playAnimDeal = (this.matchData.State != Define.GameState.RUNNING);
        UIManager.instance && UIManager.instance.onCardsReceived(this.myCards, playAnimDeal);
    },

    onTurnChange(message) {
        this.matchData.TurnKeeper = message.getString(1);
        this.matchData.TimeBeginTurn = message.getLong(2);
        this.matchData.Timeout = message.getLong(3);
        UIManager.instance.onTurnChange(this.matchData.TurnKeeper, this.matchData.TimeBeginTurn, this.matchData.Timeout);
    },

    onThrowSuccess(message) {
        this.matchData.PreviousThrowPlayerId = message.getString(1);
        this.matchData.CurrentCards = JSON.parse(message.getString(2));
        UIManager.instance.onThrowSuccess(this.matchData.PreviousThrowPlayerId, this.matchData.CurrentCards);
    },

    onGameResult(message)
    {
        let scores = JSON.parse(message.getString(1));
        let winner = message.getString(2);
        let remainCards = JSON.parse(message.getString(3));
        for (let i in this.matchData.AdditionInfos)
        {
            this.matchData.AdditionInfos[i].VND += scores[i];
        }
        UIManager.instance.updateResult(scores, winner, remainCards);
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
    },

    onErrorResponse(message)
    {
        let errorCode = message.getLong(1);
        let errorString = message.getString(2);
        console.log("On response error " + errorCode);
        Notification.instance.add(errorString);
    },

    getAdditionalInfo(playerId)
    {
        return this.matchData.AdditionInfos[playerId];
    }
});