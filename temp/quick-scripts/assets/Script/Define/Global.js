(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Define/Global.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9601fdsuddIcYjtdkvZwanV', 'Global', __filename);
// Script/Define/Global.js

"use strict";

window.FBInstantHelper = require("FBInstantHelper");
window.Config = require("Config");
window.GSMgr = new require("GSMgr");
window.GameMgr = new require("GameMgr");
window.UIManager = new require("UIManager");
window.ServerCode = require("ServerCode");
window.ImageCache = require("ImageCache");
window.GameHelper = require("GameHelper");

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
        //# sourceMappingURL=Global.js.map
        