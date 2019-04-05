var Define = {
    GameState:{
        WAITING:0,
        READY:1,
        STARTED:2,
        RUNNING:3,
        GAMEOVER:4
    },

    SetType: {
        ERROR: 0,
        SINGLE: 1,
        PAIR: 2,
        TRIPLE: 3,
        STRAIGHT: 4,
        THREEPAIRS: 5,
        QUADS: 6,
        FOURPAIRS: 7,
    },

    RESULT: {
        WIN: 0,
        INSTANT: 1,
        LOSE: 2,
        DEAD2: 3,
        BURNED: 4,
        FROZEN: 5,
    },

    TIME_FORCE_START: 15,
}

module.exports = Define;