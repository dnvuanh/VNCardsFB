(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Define/Define.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '269d9GKinlH54NtTSoZByRV', 'Define', __filename);
// Script/Define/Define.js

"use strict";

var Define = {
    GameState: {
        WAITING: 0,
        READY: 1,
        STARTED: 2,
        RUNNING: 3,
        GAMEOVER: 4
    }
};

module.exports = Define;

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
        //# sourceMappingURL=Define.js.map
        