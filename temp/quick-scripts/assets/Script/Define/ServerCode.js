(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Define/ServerCode.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '098f25tA1lNC7hv0OFUcAve', 'ServerCode', __filename);
// Script/Define/ServerCode.js

"use strict";

var ServerCode = {
    //request
    RQ_LOAD_MATCH: 999,
    RQ_ENTER_SEAT: 1000,
    RQ_LEAVE_SEAT: 1001,
    RQ_START_GAME: 1002,

    //response
    RP_LOAD_MATCH: 1999,
    RP_ENTER_SEAT: 2000,
    RP_LEAVE_SEAT: 2001,
    RP_STATE_UPDATE: 2002,
    RP_CARD_DELIVER: 2003,
    RP_HOST_CHANGE: 2100,
    RP_GET_CARDS: 2101,

    //error handle
    RP_REQUEST_ERROR: 5000,
    ERROR_DUPLICATED_SEAT: 5001
};

module.exports = ServerCode;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=ServerCode.js.map
        