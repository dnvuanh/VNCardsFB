var ServerCode = {
    //request
    RQ_LOAD_MATCH:  999,
    RQ_ENTER_SEAT: 1000,
    RQ_LEAVE_SEAT: 1001,
    RQ_START_GAME: 1002,
    RQ_THROW_CARDS: 1003,
    RQ_SKIP_TURN: 1004,

    //response
    RP_LOAD_MATCH: 1999,
    RP_ENTER_SEAT: 2000,
    RP_LEAVE_SEAT: 2001,
    RP_STATE_UPDATE: 2002,
    RP_CARD_DELIVER: 2003,
    RP_HOST_CHANGE: 2100,
    RP_GET_CARDS: 2101,
    RP_TURN_CHANGE: 2102,
    RP_THROW_SUCCESS: 2103,
    RP_TURN_SKIPPED: 2104,
    RP_GAME_RESULT: 2105,
    RP_REGISTER_LEAVE: 2106,

    //error handle
    RP_REQUEST_ERROR: 5000,
}

module.exports = ServerCode;