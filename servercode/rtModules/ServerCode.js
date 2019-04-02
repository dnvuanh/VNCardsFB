function ServerCode()
{
    //request
    this.RQ_LOAD_MATCH =  999;
    this.RQ_ENTER_SEAT = 1000;
    this.RQ_LEAVE_SEAT = 1001;
    this.RQ_START_GAME = 1002;
    this.RQ_THROW_CARDS = 1003;
    this.RQ_SKIP_TURN = 1004;
    this.RQ_REGISTER_LEAVE = 1106;

    //response
    this.RP_LOAD_MATCH = 1999;
    this.RP_ENTER_SEAT = 2000;
    this.RP_LEAVE_SEAT = 2001;
    this.RP_STATE_UPDATE = 2002;
    this.RP_HOST_CHANGE = 2100;
    this.RP_GET_CARDS = 2101;
    this.RP_TURN_CHANGE = 2102;
    this.RP_THROW_SUCCESS = 2103;
    this.RP_TURN_SKIPPED  = 2104;
    this.RP_GAME_RESULT = 2105;
    this.RP_REGISTER_LEAVE = 2106;

    //error handle
    RP_REQUEST_ERROR = 5000;
}
module.exports = new ServerCode();