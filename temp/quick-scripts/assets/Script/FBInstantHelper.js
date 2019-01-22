(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/FBInstantHelper.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5ed8fWDHDFIy6C45JGovLW5', 'FBInstantHelper', __filename);
// Script/FBInstantHelper.js

"use strict";

var FBFakeData = {
    "context": {
        "id": "1594416347337301"
    },
    "player": {
        "name": "Mayb",
        "id": "TestUser02",
        "photo": "default"
    }
};

var FBInstantHelper = cc.Class({
    isReady: function isReady() {
        return typeof FBInstant !== 'undefined';
    },
    onPause: function onPause(callback) {
        if (this.isReady()) {
            FBInstant.onPause(callback);
        }
    },
    onQuitGame: function onQuitGame() {
        if (typeof FBInstant === 'undefined') return;
        FBInstant.quit();
    },
    onShareGame: function onShareGame() {
        if (typeof FBInstant === 'undefined') return;
        FBInstant.shareAsync({
            intent: 'SHARE',
            image: this.getImgBase64(),
            text: 'X is asking for your help!',
            data: { myReplayData: '...' }
        }).then(function () {
            // continue with the game.
        });
    },
    getContextID: function getContextID() {
        if (typeof FBInstant !== 'undefined') {
            return FBInstant.context.getID();
        }

        return FBFakeData.context.id;
    },
    getPlayerID: function getPlayerID() {
        if (typeof FBInstant !== 'undefined') {
            return FBInstant.player.getID();
        }

        return FBFakeData.player.id;
    },
    getPlayerName: function getPlayerName() {
        if (typeof FBInstant !== 'undefined') {
            return FBInstant.player.getName();
        }

        return FBFakeData.player.name;
    },
    getPlayerPhoto: function getPlayerPhoto() {
        if (typeof FBInstant !== 'undefined') {
            return FBInstant.player.getPhoto();
        }

        return FBFakeData.player.photo;
    },
    logEventTracking: function logEventTracking(eventName, valueToSum, param) {
        if (typeof FBInstant === 'undefined') {
            return;
        }
        return FBInstant.logEvent(eventName, valueToSum, param);
    }
});

module.exports = new FBInstantHelper();

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
        //# sourceMappingURL=FBInstantHelper.js.map
        