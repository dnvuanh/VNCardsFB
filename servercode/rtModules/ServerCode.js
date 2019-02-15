function ServerCode()
{
    //request
    this.RQ_LOAD_MATCH =  999;
    this.RQ_ENTER_SEAT = 1000;
    this.RQ_LEAVE_SEAT = 1001;
    this.RQ_START_GAME = 1002;

    //response
    this.RP_LOAD_MATCH = 1999;
    this.RP_ENTER_SEAT = 2000;
    this.RP_LEAVE_SEAT = 2001;
    this.RP_STATE_UPDATE = 2002;
    this.RP_HOST_CHANGE = 2100;

    //error handle
    RP_REQUEST_ERROR = 5000;
}
module.exports = new ServerCode();