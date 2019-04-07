var FBFakeData = {
    "context":{
        "id":"1991595654288655",
    },
    "player":{
        "name":"Mayc",
        "id":"TestUser03",
        "photo":"default"
    }
};

var FBInstantHelper = cc.Class({

    isReady () {
        return typeof FBInstant !== 'undefined';
    },

    onPause(callback)
    {
        if (this.isReady())
        {
            FBInstant.onPause(callback);
        }
    },

    onQuitGame () {
        if (typeof FBInstant === 'undefined') return;
            FBInstant.quit();
    },

    onShareGame () {
        if (typeof FBInstant === 'undefined') return;
        FBInstant.shareAsync({
            intent: 'SHARE',
            image: this.getImgBase64(),
            text: 'X is asking for your help!',
            data: {myReplayData: '...'},
        }).then(() => {
            // continue with the game.
        });
    },

    getContextID()
    {
        if (typeof FBInstant !== 'undefined') {
            return FBInstant.context.getID();
        }

        return FBFakeData.context.id;
    },

    getPlayerID()
    {
        if (typeof FBInstant !== 'undefined') {
            return FBInstant.player.getID();
        }

        return FBFakeData.player.id;
    },

    getPlayerName()
    {
        if (typeof FBInstant !== 'undefined') {
            return FBInstant.player.getName();
        }

        return FBFakeData.player.name;
    },

    getPlayerPhoto()
    {
        if (typeof FBInstant !== 'undefined') {
            return FBInstant.player.getPhoto();
        }

        return FBFakeData.player.photo;
    },

    logEventTracking(eventName, valueToSum, param)
    {
        if (typeof FBInstant === 'undefined') {
            return;
        }
        return FBInstant.logEvent(eventName,
                valueToSum, 
                param);
    }

});

module.exports = new FBInstantHelper();