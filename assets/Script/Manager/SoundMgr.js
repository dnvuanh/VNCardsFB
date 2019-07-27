var SoundMgr = cc.Class({
    extends: cc.Component,

    properties: {
        soundClick: {
            type: cc.AudioClip,
            default: null
        }
    },

    statics:{
        instance: null,
    },

    onLoad()
    {
        SoundMgr.instance = this;
        this.SoundCached = null;
        cc.game.addPersistRootNode(this.node);
        this.isMusicLoaded = false;
    },

    playSoundClick()
    {
        cc.audioEngine.play(this.soundClick, false, 1);
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
            cc.audioEngine.playEffect(clip[0], loop, volumn);
        }
    },

    playMusic(soundName, loop = true, volumn = 1)
    {
        if (this.isMusicLoaded)
        {
            cc.audioEngine.resumeMusic();
        }
        else
        {
            let clip = this.SoundCached.filter((ac) => ac.name == soundName);
            if (clip.length > 0)
            {
                this.isMusicLoaded = true;
                cc.audioEngine.playMusic(clip[0], loop, volumn);
            }
        }
    },

    pauseMusic()
    {
        cc.audioEngine.pauseMusic();
    },
});
