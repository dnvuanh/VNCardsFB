var Log = RTSession.getLogger();
var ServerCode = require("ServerCode");
var Define = require("Define");
var GameHelper = require("GameHelper");

var MatchPublicData = {
    Seats:{},
    Turn:null,
    TimeBeginTurn:0,
    TurnKeeper:null,
    CurrentCards:{},
    Host:null,
    Winner:null,
    State: Define.GameState.WAITING,
    SkipState: [],
    PreviousThrowPlayerId: 0,
    RegisterLeave: [],
}

var MatchPrivateData = {
    Deck: [],
    Cards:{},
}

var TurnLoopId = null;
var startGameTimeout = null;

var SendErrorCode = function(code, peers)
{
    var message = RTSession.newData();
        message.setNumber(1, code);
    
    RTSession.newPacket()
    .setOpCode(ServerCode.RP_REQUEST_ERROR)
    .setTargetPeers(peers)
    .setData(message)
    .send();
}

var SendMessageEnterSeat = function(player, seat)
{
    Log.debug("Sending message enter seat " + player);
    var message = RTSession.newData();
        message.setString(1, player);
        message.setNumber(2, seat);
    
    RTSession.newPacket()
    .setOpCode(ServerCode.RP_ENTER_SEAT)
    .setData(message)
    .send();
}

var SendMessageHostChange = function(player)
{
    var message = RTSession.newData();
        message.setString(1, player);

    RTSession.newPacket()
    .setOpCode(ServerCode.RP_HOST_CHANGE)
    .setData(message)
    .send();
}

var SendMessageLeaveSeat = function(player, seat)
{
    Log.debug("Sending message Leave seat " + player);
    var message = RTSession.newData();
        message.setString(1, player);
        message.setNumber(2, seat);
    
    RTSession.newPacket()
    .setOpCode(ServerCode.RP_LEAVE_SEAT)
    .setData(message)
    .send();
}

var SendPlayerRegisterLeave = function(peerId, isLeave)
{
    var message = RTSession.newData();
        message.setNumber(1, isLeave);
    
    RTSession.newPacket()
    .setOpCode(ServerCode.RP_REGISTER_LEAVE)
    .setTargetPeers([peerId])
    .setData(message)
    .send();
}

var SendStateChange = function(timestamp)
{
    Log.debug("Sending state change ");
    var message = RTSession.newData();
        message.setNumber(1, MatchPublicData.State);
        message.setNumber(2, timestamp);
        
    RTSession.newPacket()
    .setOpCode(ServerCode.RP_STATE_UPDATE)
    .setData(message)
    .send();
}

var SendCurrentMatch = function(player, peerId)
{
    var matchString = JSON.stringify(MatchPublicData);
    var message = RTSession.newData();
        message.setString(1, matchString);
    
    RTSession.newPacket()
    .setOpCode(ServerCode.RP_LOAD_MATCH)
    .setTargetPeers(peerId)
    .setData(message)
    .send();
}

var SendCardsToPlayer = function(playerId, peerId) 
{
    var cardsString = JSON.stringify(MatchPrivateData.Cards[playerId]);
    var message = RTSession.newData();
        message.setString(1, cardsString);
    
    RTSession.newPacket()
    .setOpCode(ServerCode.RP_GET_CARDS)
    .setTargetPeers(peerId)
    .setData(message)
    .send();
}

var SendTurnChange = function(playerId, timeBeginTurn, turnTimeout)
{
    var message = RTSession.newData();
        message.setString(1, playerId);
        message.setNumber(2, timeBeginTurn);
        message.setNumber(3, turnTimeout);
        
    RTSession.newPacket()
    .setOpCode(ServerCode.RP_TURN_CHANGE)
    .setData(message)
    .send();
}

var SendPlayerThrowSuccess = function(playerId, cards)
{
    var cardsString = JSON.stringify(cards);
    var message = RTSession.newData();
        message.setString(1, playerId);
        message.setString(2, cardsString);
        
    RTSession.newPacket()
    .setOpCode(ServerCode.RP_THROW_SUCCESS)
    .setData(message)
    .send();
}

var SendGameResult = function(scores)
{
    var players = RTSession.getPlayers();
    var message = RTSession.newData();
    message.setString(1, JSON.stringify(scores));
    message.setString(2, MatchPublicData.Winner);
    for(var i = 0; i < players.length; i++)
    {
        message.setString(3 + i * 2, players[i].getPlayerId());
        var cardsString = JSON.stringify(MatchPrivateData.Cards[players[i].getPlayerId()]);
        message.setString(3 + i * 2 + 1, cardsString);
    }  

    RTSession.newPacket()
    .setOpCode(ServerCode.RP_GAME_RESULT)
    .setData(message)
    .send();
}

var SendPlayerSkipTurn = function(playerId)
{
    var message = RTSession.newData();
        message.setString(1, playerId);
        
    RTSession.newPacket()
    .setOpCode(ServerCode.RP_TURN_SKIPPED)
    .setData(message)
    .send(); 
}

var OnSeatsRequest = function(packet)
{
    var playerId = packet.getSender().getPlayerId();
    var peerId = packet.getSender().getPeerId();
    var pos = packet.getData().getNumber(1);
    Log.debug("OnSeatsRequest " + pos);
    
    if (MatchPublicData.State >= Define.GameState.RUNNING) //check if match is running, can't join
    {
        //todo: add to queue list
        return;
    }
    
    if (MatchPublicData.Seats[pos] == null || !MatchPublicData.Seats[pos].hasOwnProperty(pos))
    {
        LeaveCurrentSeat(playerId);
        EnterSeat(pos, playerId);
        return;
    }
    else
    {
        SendErrorCode(Define.ERROR_CODE.ERROR_DUPLICATED_SEAT, [peerId]);
    }
}

var OnPlayerRegisterLeave = function(packet)
{
    var playerId = packet.getSender().getPlayerId();
    var pearId = packet.getSender().getPeerId();
    var isLeave = packet.getData().getNumber(1);
    if (isLeave)
    {
        MatchPublicData.RegisterLeave.push(playerId);
    }
    else
    {
        var index = MatchPublicData.RegisterLeave.indexOf(playerId);
        MatchPublicData.RegisterLeave.slice(index, 1);
    }
    SendPlayerRegisterLeave(pearId, isLeave);
}

var OnSeatLeave = function(packet)
{
    var playerId = packet.getSender().getPlayerId();
    if (MatchPublicData.State != Define.GameState.RUNNING)
    {
        LeaveCurrentSeat(playerId);
    }
    else
    {
        OnPlayerRegisterLeave(packet);
    }
}

var EnterSeat = function(position, playerId)
{
    MatchPublicData.Seats[position] = playerId;
    SendMessageEnterSeat(playerId, position);
    if (!MatchPublicData.Host)
    {
        setMatchHost(playerId);
        //MatchPublicData.PlayerReady.push(playerId);
    }
    
    CheckEnoughPlayer();
}

var UpdateGameState = function(state)
{
    if (MatchPublicData.State != state)
    {
        MatchPublicData.State = state;
        SendStateChange(Date.now());
    }
    
    if (state == Define.GameState.WAITING || state == Define.GameState.STARTED)
    {
        RTSession.clearTimeout(startGameTimeout);
    }
}

var LeaveCurrentSeat = function(playerId)
{
    Log.debug("Leave Current Seat " + playerId);
    Log.debug("Current Seats " + JSON.stringify(MatchPublicData.Seats));
    var currentSeats = Object.keys(MatchPublicData.Seats);
    
    for (var i=0; i<currentSeats.length; i++)
    {
        if (MatchPublicData.Seats[currentSeats[i]] == playerId)
        {
            delete MatchPublicData.Seats[currentSeats[i]];
            if (playerId==MatchPublicData.Host)
            {
                MatchPublicData.Host = null;
                findNextHost();
            }
            SendMessageLeaveSeat(playerId, currentSeats[i]);
            break;
        }
    }
    
    if (Object.keys(MatchPublicData.Seats).length < 2)
    {
        if (MatchPublicData.State == Define.GameState.READY)
            UpdateGameState(Define.GameState.WAITING);
    }
}

var findNextHost = function()
{
    var currentSeats = Object.keys(MatchPublicData.Seats);
    for (var i=0; i<currentSeats.length; i++)
    {
        if (MatchPublicData.Seats[currentSeats[i]] != null)
        {
            setMatchHost(MatchPublicData.Seats[currentSeats[i]]);
            break;
        }
    }
}

var setMatchHost = function(playerId)
{
    MatchPublicData.Host = playerId;
    SendMessageHostChange(playerId);
}

var OnRequestMatch = function(packet)
{
    var player = packet.getSender().getPlayerId();
    var peerId = packet.getSender().getPeerId();
    SendCurrentMatch(player, peerId);
}

var onPlayerConnect = function(player)
{
    SendCurrentMatch(player.getPlayerId(), player.getPeerId());
}

var onPlayerDisconnect = function(player)
{
    var playerId = player.getPlayerId();
    LeaveCurrentSeat(playerId);
}

var CheckInstantWin = function()
{
    var players = RTSession.getPlayers();
    for(var i = 0; i < players.length; i++)
    {
        var playerId = players[i].getPlayerId();
        if(GameHelper.isInstantWin(MatchPrivateData.Cards[playerId]))
        {
            MatchPublicData.Winner = playerId;
            return true;
        }
    }
    return false;
}

var ShuffleDeck = function()
{
    var CARD_QUANTITY = 52;
    var CARD_PER_PLAYER = 13;
    var players = RTSession.getPlayers();
    
    MatchPrivateData.Deck = Define.DefaultCards.slice();
    //shuffle
    for(var i = CARD_QUANTITY; i > 1; i--) {
        var randomIdx = Math.random() * i | 0;
        var temp = MatchPrivateData.Deck[i - 1];
        MatchPrivateData.Deck[i - 1] = MatchPrivateData.Deck[randomIdx];
        MatchPrivateData.Deck[randomIdx] = temp;
    } 
    
    for(var i = 0; i < players.length; i++)
    {
        var playerId = players[i].getPlayerId();
        MatchPrivateData.Cards[playerId] = MatchPrivateData.Deck.slice(i * CARD_PER_PLAYER, (i + 1) * CARD_PER_PLAYER);
    }
}

var EndGame = function()
{
    UpdateGameState(Define.GameState.GAMEOVER);
        
    RTSession.setTimeout(function(){
        PrepareNewGame();
    },Define.TIME_BREAK_GAME * 1000);
    
    var scores = CanculateScores(MatchPublicData.Winner);
    SendGameResult(scores);
}

var SendCardsToAllPlayers = function()
{
    var players = RTSession.getPlayers();
    for(var i = 0; i < players.length; i++)
    {
        var player = players[i];
        SendCardsToPlayer(player.getPlayerId(), player.getPeerId());
    }
}

var ShuffleDeckDebug = function(debugCode)
{
    var CARD_QUANTITY = 52;
    var CARD_PER_PLAYER = 13;
    var players = RTSession.getPlayers();
    
    switch (debugCode)
    {
        case 101:
            MatchPrivateData.Deck = Define.DragonCards.slice();
            break;
        case 102:
            MatchPrivateData.Deck = Define.FourPigsCards.slice();
            break;
        case 103:
            MatchPrivateData.Deck = Define.SixPairsCards.slice();
            break;
        case 104:
            MatchPrivateData.Deck = Define.FiveContPairsCards.slice();
            break;
        default:
            MatchPrivateData.Deck = Define.DefaultCards.slice();
    }
    for(var i = 0; i < players.length; i++)
    {
        var playerId = players[i].getPlayerId();
        MatchPrivateData.Cards[playerId] = MatchPrivateData.Deck.slice(i * CARD_PER_PLAYER, (i + 1) * CARD_PER_PLAYER);
    }
}

var StartTurn = function(player)
{
    MatchPublicData.TurnKeeper = player;
    MatchPublicData.TimeBeginTurn = Date.now();
    SendTurnChange(MatchPublicData.TurnKeeper, MatchPublicData.TimeBeginTurn, Define.TIME_PER_TURN);
    
    //stop current time out
    if (TurnLoopId != null)
    {
        RTSession.clearTimeout(TurnLoopId);
    }
    
    //set new timeout
    TurnLoopId = RTSession.setTimeout(function(){
        SkipTurn(MatchPublicData.TurnKeeper);
    }, Define.TIME_PER_TURN * 1000)
}

var FindFirstTurn = function()
{
    var nextPlayer = MatchPublicData.Host;
    if (MatchPublicData.Winner != null)
        nextPlayer = MatchPublicData.Winner;
    
    MatchPublicData.Winner = null;
    StartTurn(nextPlayer);
    ResetSkipState();
}

var OnStartGame = function(message)
{
    var debugCode = message.getData().getNumber(1);
    if (MatchPublicData.State == Define.GameState.READY)
    {
        UpdateGameState(Define.GameState.STARTED);
        if(debugCode >= 100)    
        {
            ShuffleDeckDebug(debugCode);
        } 
        else 
        {
            ShuffleDeck();
        }
        if(CheckInstantWin())
        {
            EndGame();
            return;
        }
        SendCardsToAllPlayers();
        FindFirstTurn();
        UpdateGameState(Define.GameState.RUNNING);
    }
    else
    {
        //TODO: error game already start
        Log.debug("OnStartGame " + MatchPublicData.State);
    }
}

var GetPlayerSeat = function(playerId)
{
    var currentSeats = Object.keys(MatchPublicData.Seats);
    
    for (var i=0; i<currentSeats.length; i++)
    {
        if (MatchPublicData.Seats[currentSeats[i]] == playerId)
        {
            return currentSeats[i];
        }
    }
    return -1;
}

var IsPlayerFinished = function(seatId)
{
    return MatchPrivateData.Cards[MatchPublicData.Seats[seatId]].length == 0;
}

var PlayerHasSkipped = function(seatId)
{
    return MatchPublicData.SkipState[seatId] == true; 
}

var FindNextPlayerCanPlay = function(playerId)
{
    var currentSeats = Object.keys(MatchPublicData.Seats);
    var i = (currentSeats.indexOf(GetPlayerSeat(playerId)) + 1) % currentSeats.length;
    while(PlayerHasSkipped(currentSeats[i]) || IsPlayerFinished(currentSeats[i])) 
    {
        i = (i + 1) % currentSeats.length;
    }
    return MatchPublicData.Seats[currentSeats[i]];
}

var ResetSkipState = function()
{
    MatchPublicData.SkipState = [false, false, false, false];
    MatchPublicData.CurrentCards = null;
    MatchPublicData.PreviousThrowPlayerId = 0;
}

var SwitchTurn = function(playerId)
{
    var nextPlayer = FindNextPlayerCanPlay(playerId);
    this.StartTurn(nextPlayer);
    if(MatchPublicData.PreviousThrowPlayerId == nextPlayer || MatchPublicData.PreviousThrowPlayerId == 0)
    {
        ResetSkipState();
    }
}

var RemoveCardsFromPlayer = function(playerId, cards)
{
    for (var i = 0; i < cards.length; i++) 
    {
        var cardIdx = MatchPrivateData.Cards[playerId].indexOf(cards[i]);
        if(cardIdx == -1)
        {
            //TODO: Send error, hack card
            return false;
        }
    }
    
    for (var i = 0; i < cards.length; i++) 
    {
        var cardIdx = MatchPrivateData.Cards[playerId].indexOf(cards[i]);
        MatchPrivateData.Cards[playerId].splice(cardIdx, 1);
    }
    return true;
}

var PrepareNewGame = function()
{
    //remove player who registered leave game
    for (var i=0; i<MatchPublicData.RegisterLeave.length; i++)
    {
        LeaveCurrentSeat(MatchPublicData.RegisterLeave[i]);
    }
    MatchPrivateData.Cards = {};
    UpdateGameState(Define.GameState.WAITING);
    CheckEnoughPlayer();
}

var CheckEnoughPlayer = function()
{
    if (Object.keys(MatchPublicData.Seats).length >= 2)
    {
        UpdateGameState(Define.GameState.READY);
        startGameTimeout = RTSession.setTimeout(function(){
            OnStartGame();
        }, Define.TIME_FORCE_START * 1000)
    }
}

var CheckEndGame = function(playerId)
{
    if (MatchPrivateData.Cards[playerId].length == 0) // GameOver
    {
        return true;
    }
    return false;
}

var CanculateScores = function(winner)
{
    var scores = {};
    var reward = 0;
    
    var currentSeats = Object.keys(MatchPublicData.Seats);
    for (var i=0; i<currentSeats.length; i++)
    {
        var playerId = MatchPublicData.Seats[currentSeats[i]];
        scores[playerId] = -(MatchPrivateData.Cards[playerId].length * 200); //TODO: remove hardcore 200
        reward += Math.abs(scores[playerId]);
    }
    scores[winner] = reward;
    return scores;
}

var OnCardsThrown = function(packet)
{
    var cards = JSON.parse(packet.getData().getString(1));
    var playerId = packet.getSender().getPlayerId();
    //Log.debug("OnCardsThrown: " + MatchPublicData.CurrentCards + "cards: " + cards);
    if(playerId != MatchPublicData.TurnKeeper)
    {
        //TODO: Send error, hack turn.
        return;
    }
    
    if (RemoveCardsFromPlayer(playerId, cards) 
        && GameHelper.validTurn(MatchPublicData.CurrentCards, cards))
    {
        MatchPublicData.CurrentCards = cards;
        MatchPublicData.PreviousThrowPlayerId = playerId;
        SendPlayerThrowSuccess(playerId, cards);
        if (CheckEndGame(playerId))
        {
            MatchPublicData.Winner = playerId;
            EndGame();
            RTSession.clearTimeout(TurnLoopId);
        }
        else
        {
            SwitchTurn(playerId);
        }
    }
}

var SkipTurn = function(playerId)
{
    //SendPlayerSkipTurn(playerId); No need to send event.
    MatchPublicData.SkipState[GetPlayerSeat(playerId)] = true;
    SwitchTurn(playerId);
}

var OnSkipTurn = function(packet)
{
    var playerId = packet.getSender().getPlayerId();
    if(playerId != MatchPublicData.TurnKeeper || MatchPublicData.State != Define.GameState.RUNNING)
    {
        //TODO: Send error, hack turn.
        return;
    }
    SkipTurn(playerId);
}

var main = function(){
    RTSession.onPacket(ServerCode.RQ_LOAD_MATCH, OnRequestMatch.bind(this));
    RTSession.onPacket(ServerCode.RQ_ENTER_SEAT, OnSeatsRequest.bind(this));
    RTSession.onPacket(ServerCode.RQ_LEAVE_SEAT, OnSeatLeave.bind(this));
    RTSession.onPacket(ServerCode.RQ_START_GAME, OnStartGame.bind(this));
    RTSession.onPacket(ServerCode.RQ_THROW_CARDS, OnCardsThrown.bind(this));
    RTSession.onPacket(ServerCode.RQ_REGISTER_LEAVE, OnPlayerRegisterLeave.bind(this));
    RTSession.onPacket(ServerCode.RQ_SKIP_TURN, OnSkipTurn.bind(this));
    RTSession.onPlayerConnect(onPlayerConnect.bind(this));
    RTSession.onPlayerDisconnect(onPlayerDisconnect.bind(this));
}

main();