var SoundMgr = cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    statics:{
        instance: null,
    },

    onLoad()
    {
        SoundMgr.instance = this;
        this.SoundCached = null;
        cc.game.addPersistRootNode(this.node);
    },

    preload(callback)
    {
        cc.loader.loadResDir("Sounds", cc.AudioClip, (err, assets, urls) => {
            this.SoundCached = assets;
            callback();
        });
    },

    play(soundName, loop = false, volumn = 1)
    {
        let clip = this.SoundCached.filter((ac) => ac.name == soundName);
        if (clip.length > 0)
        {
            cc.audioEngine.play(clip[0], loop, volumn);
        }
        //cc.audioEngine.playEffect("Sounds/" + soundName);
    }
});
