"use strict";
cc._RF.push(module, '098f25tA1lNC7hv0OFUcAve', 'ServerCode');
// Script/Define/ServerCode.js

"use strict";

var ServerCode = {
    //request
    RQ_LOAD_MATCH: 999,
    RQ_ENTER_SEAT: 1000,
    RQ_LEAVE_SEAT: 1001,

    //response
    RP_LOAD_MATCH: 1999,
    RP_ENTER_SEAT: 2000,
    RP_LEAVE_SEAT: 2001,
    RP_HOST_CHANGE: 2100,

    //error handle
    RP_REQUEST_ERROR: 5000,
    ERROR_DUPLICATED_SEAT: 5001
};

module.exports = ServerCode;

cc._RF.pop();