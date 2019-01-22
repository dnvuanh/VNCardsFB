(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ServerCode.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '098f25tA1lNC7hv0OFUcAve', 'ServerCode', __filename);
// Script/ServerCode.js

"use strict";

var ServerCode = {
    //request
    RQ_ENTER_SEAT: 1000,

    //response
    RP_ENTER_SEAT: 2000
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
        