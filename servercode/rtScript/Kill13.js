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
    ThrowPlayerId: 0,
    PlayerReady: [],
}

var MatchPrivateData = {
    Cards:{},
}

var TurnLoopId = null;

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

var SendPlayerReady = function(player, isReady)
{
    Log.debug("Sending message Leave seat " + player);
    var message = RTSession.newData();
        message.setString(1, player);
        message.setNumber(2, isReady);
    
    RTSession.newPacket()
    .setOpCode(ServerCode.RP_PLAYER_READY)
    .setData(message)
    .send();
}

var SendStateChange = function()
{
    Log.debug("Sending state change ");
    var message = RTSession.newData();
        message.setNumber(1, MatchPublicData.State);
        
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
    var message = RTSession.newData();
        message.setString(1, JSON.stringify(scores));

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

var OnPlayerReady = function(packet)
{
    var playerId = packet.getSender().getPlayerId();
    var IsReady = packet.getData().getNumber(1);
    if (IsReady)
    {
        MatchPublicData.PlayerReady.push(playerId);
    }
    else
    {
        var index = MatchPublicData.PlayerReady.indexOf(playerId);
        MatchPublicData.PlayerReady.slice(index, 1);
    }
    SendPlayerReady(playerId, IsReady);
    
    Log.debug("Player Ready " + MatchPublicData.PlayerReady.length + " Total Seats " + Object.keys(MatchPublicData.Seats).length);
    if ((MatchPublicData.State == Define.GameState.WAITING || MatchPublicData.State == Define.GameState.GAMEOVER) && MatchPublicData.PlayerReady.length == Object.keys(MatchPublicData.Seats).length)
    {
        UpdateGameState(Define.GameState.READY);
    }
}

var OnSeatLeave = function(packet)
{
    var playerId = packet.getSender().getPlayerId();
    LeaveCurrentSeat(playerId);
}

var EnterSeat = function(position, playerId)
{
    MatchPublicData.Seats[position] = playerId;
    SendMessageEnterSeat(playerId, position);
    if (!MatchPublicData.Host)
    {
        setMatchHost(playerId);
        MatchPublicData.PlayerReady.push(playerId);
    }
}

var UpdateGameState = function(state)
{
    if (MatchPublicData.State != state)
    {
        MatchPublicData.State = state;
        SendStateChange();
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

var DealCards = function()
{
    var CARD_NUM = 52;
    var CARD_PER_PLAYER = 13;
    var deck = Define.DefaultCards.slice();
    //shuffle
    for(var i = CARD_NUM; i > 1; i--) {
        var randomIdx = Math.random() * i | 0;
        var temp = deck[i - 1];
        deck[i - 1] = deck[randomIdx];
        deck[randomIdx] = temp;
    }
    
    //send cards to players
    var players = RTSession.getPlayers();
    for(var i = 0; i < players.length; i++)
    {
        var player = players[i];
        MatchPrivateData.Cards[player.getPlayerId()] = deck.slice(i * CARD_PER_PLAYER, (i + 1) * CARD_PER_PLAYER);
        SendCardsToPlayer(player.getPlayerId(), player.getPeerId());
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

var OnStartGame = function()
{
    DealCards();
    UpdateGameState(Define.GameState.STARTED);
    FindFirstTurn();
    UpdateGameState(Define.GameState.RUNNING);
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
}

var SwitchTurn = function(playerId)
{
    var nextPlayer = FindNextPlayerCanPlay(playerId);
    this.StartTurn(nextPlayer);
    if(MatchPublicData.ThrowPlayerId == nextPlayer)
    {
        ResetSkipState();
    }
}

var RemoveCardsFromPlayer = function(playerId, cards)
{
    for (var i = 0; i < cards.length; i++) 
    {
        MatchPrivateData.Cards[playerId].splice(MatchPrivateData.Cards[playerId].indexOf(cards[i]), 1);
    }
    SendPlayerThrowSuccess(playerId, cards);
}

var CheckEndGame = function(playerId)
{
    if (MatchPrivateData.Cards[playerId].length == 0)
    {
        MatchPublicData.Winner = playerId;
        UpdateGameState(Define.GameState.GAMEOVER);
        
        var scores = CanculateScores(playerId);
            SendGameResult(scores);
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
    Log.debug("OnCardsThrown: " + MatchPublicData.CurrentCards + "cards: " + cards);
    if(playerId != MatchPublicData.TurnKeeper)
    {
        //TODO: Send error, hack turn.
        return;
    }
    
    if (GameHelper.validTurn(MatchPublicData.CurrentCards, cards))
    {
        MatchPublicData.CurrentCards = cards;
        MatchPublicData.ThrowPlayerId = playerId;
        RemoveCardsFromPlayer(playerId, cards);
        var gameEnded = CheckEndGame(playerId);
        if (gameEnded)
        {
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
    SendPlayerSkipTurn(playerId);
    MatchPublicData.SkipState[GetPlayerSeat(playerId)] = true;
    SwitchTurn(playerId);
}

var OnSkipTurn = function(packet)
{
    var playerId = packet.getSender().getPlayerId();
    if(playerId != MatchPublicData.TurnKeeper)
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
    RTSession.onPacket(ServerCode.RQ_PLAYER_READY, OnPlayerReady.bind(this));
    RTSession.onPacket(ServerCode.RQ_SKIP_TURN, OnSkipTurn.bind(this));
    RTSession.onPlayerConnect(onPlayerConnect.bind(this));
    RTSession.onPlayerDisconnect(onPlayerDisconnect.bind(this));
}

main();