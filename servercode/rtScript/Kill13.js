var Log = RTSession.getLogger();
var ServerCode = require("ServerCode");
var Define = require("Define");

var MatchPublicData = {
    Seats:{},
    Turn:null,
    TimeBeginTurn:0,
    TurnKeeper:null,
    CurrentCards:null,
    Host:null,
    State: Define.GameState.WAITING,
}

var MatchPrivateData = {
    Cards:{}
}

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
    }
    Log.debug("Current Match State " + MatchPublicData.State + " Seats " + JSON.stringify(MatchPublicData.Seats));
    if (MatchPublicData.State == Define.GameState.WAITING && Object.keys(MatchPublicData.Seats).length >= 2)
    {
        UpdateGameState(Define.GameState.READY);
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

var OnStartGame = function(firstId)
{
    var CARD_NUM = 52;
    var CARD_PER_PLAYER = 13;
    var deck = new Array(CARD_NUM);
    //reload deck
    for(var i = 0; i < CARD_NUM; i++) {
        deck[i] = i;
    }
    //shuffle
    for(var i = CARD_NUM; i > 1; i--) {
        var randomIdx = Math.random() * i | 0;
        var temp = deck[i - 1];
        deck[i - 1] = deck[randomIdx];
        deck[randomIdx] = temp;
        //deck[i - 1, randomIdx] = deck[randomIdx, i - 1];
    }
    
    //send cards to players
    var players = RTSession.getPlayers();
    Log.debug("DealCards:" + deck);
    for(var i = 0; i < players.length; i++)
    {
        var player = players[i];
        MatchPrivateData.Cards[player.getPlayerId()] = deck.slice(i * CARD_PER_PLAYER, (i + 1) * CARD_PER_PLAYER);
        SendCardsToPlayer(player.getPlayerId(), player.getPeerId());
    }
}

var main = function(){
    RTSession.onPacket(ServerCode.RQ_LOAD_MATCH, OnRequestMatch.bind(this));
    RTSession.onPacket(ServerCode.RQ_ENTER_SEAT, OnSeatsRequest.bind(this));
    RTSession.onPacket(ServerCode.RQ_LEAVE_SEAT, OnSeatLeave.bind(this));
    RTSession.onPacket(ServerCode.RQ_START_GAME, OnStartGame.bind(this));
    RTSession.onPlayerConnect(onPlayerConnect.bind(this));
    RTSession.onPlayerDisconnect(onPlayerDisconnect.bind(this));
}

main();