var Define = require("Define");
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
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_STATE_UPDATE, this.onGameStateUpdate.bind(this));
        GSMgr.instance.registerOpCodeCallback(ServerCode.RP_GET_CARDS, this.onCardsReceived.bind(this));
    },

    onInit()
    {
        this.startGameScene = true;
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

    getMyId()
    {
        return this.userId;
    },

    getMySeat()
    {
        return this.MySeat;
    },

    IsMyId(id)
    {
        return this.userId == id;
    },

    onPlayerEnterSeat(message)
    {
        let playerId = message.getString(1);
        let seat = message.getLong(2);
            this.matchData.Seats[seat] = playerId;
            UIManager.instance.playerEnterSeat(this.getPlayer(playerId), seat);

        if (this.IsMyId(playerId))
        {
            this.MySeat = seat;
        }
    },

    onPlayerLeaveSeat(message)
    {
        let playerId = message.getString(1);
        let seat = message.getLong(2);
            this.matchData.Seats[seat] = null;
            UIManager.instance.playerLeaveSeat(seat);
        
        if (this.IsMyId(playerId))
        {
            this.MySeat = null;
        }
    },

    onHostChange(message)
    {
        let playerId = message.getString(1);
            this.matchData.Host = playerId;
            UIManager.instance.setHost(playerId);
    },

    onGameStateUpdate(message)
    {
        this.matchData.State = message.getLong(1);
        switch (this.matchData.State)
        {
            case Define.GameState.WAITING:
                this.onGameStateWaiting();
            break;

            case Define.GameState.READY:
                this.onGameStateReady();
            break;
        }
    },

    onGameStateWaiting()
    {
        if (this.IsMyId(this.matchData.Host))
            UIManager.instance.setEnableStartButton(false);
    },

    onGameStateReady()
    {
        if (this.IsMyId(this.matchData.Host))
            UIManager.instance.setEnableStartButton(true);
    },

    onCardsReceived(message)
    {
        var cards = JSON.parse(message.getString(1));
        cards.sort((a,b) => a - b);
        UIManager.instance.onCardsReceived(cards);
    },

    cardValue(card) 
    {
        return card / 4 | 0;
    },

    isSame(cards)
    {
        if(cards.length < 2) {
            return false;
        }

        for(let i = 1; i < cards.length; i++) {
            if(this.cardValue(cards[0]) != this.cardValue(cards[i])) {
                    return false;
                }
        }
        return true;
    },

    isStraight(cards)
    {
        if(cards.length < 3) {
            return false;
        }

        for(let i = 0; i < cards.length - 1; i++) {
            if(this.cardValue(cards[i]) - this.cardValue(cards[i+1]) != 1){
                return false;
            }
        }
        return true;
    },

    parseCards(cards) 
    {  
        cards.sort((a,b) => b - a);
        var result = {setType: Define.SetType.ERROR, numOfCard:"", topCard: ""};
        result.numOfCard = cards.length;
        result.topCard = cards[0];

        if(this.isStraight(cards))
        {
            result.setType = Define.SetType.STRAIGHT;
            return result;
        }
        
        switch (cards.length) {
        case 1:
            result.setType = Define.SetType.SINGLE;
            break;
        case 2:
            if(this.isSame(cards)) {
                result.setType = Define.SetType.PAIR;
            }
            break;
        case 3:
            if(this.isSame(cards)) {
                result.setType = Define.SetType.TRIPLE;
            }
            break;
        case 4:
            if(this.isSame(cards)) {
                result.setType = Define.SetType.QUADS;
            }
            break;
        case 6:
            if(this.isSame([cards[0], cards[1]]) &&
                this.isSame([cards[2], cards[3]]) &&
                this.isSame([cards[4], cards[5]]) &&
                this.isStraight([cards[0], cards[2], cards[4]])) {
                    result.setType = Define.SetType.THREEPAIRS;
                }
            break;
        case 8:
            if(this.isSame([cards[0], cards[1]]) &&
                this.isSame([cards[2], cards[3]]) &&
                this.isSame([cards[4], cards[5]]) &&
                this.isSame([cards[6], cards[7]]) &&
                this.isStraight([cards[0], cards[2], cards[4], cards[6]])) {
                    result.setType = Define.SetType.FOURPAIRS;
                }
            break;
        default:
        }
        return result;
    },

    validTurn(previous, current)
    {
        const HEO = 15;
        if(previous.setType >= Define.SetType.THREEPAIRS){
            return current.SetType * 100 + current.topCard > previous.SetType * 100 + previous.topCard;
        } else if(this.cardValue(previous.topCard) == HEO && current.setType >= Define.SetType.THREEPAIRS) {
            return true;
        } else if(current.setType == previous.setType 
            && current.numOfCard == previous.numOfCard 
            && current.topCard > previous.topCard)  {
            return true;
        }
        return false;
    }
});