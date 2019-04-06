"use strict";
cc._RF.push(module, '5ed8fWDHDFIy6C45JGovLW5', 'FBInstantHelper');
// Script/Util/FBInstantHelper.js

"use strict";

var FBFakeData = {
    "context": {
        "id": "1991595654288654"
    },
    "player": {
        "name": "Mayc",
        "id": "TestUser03",
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