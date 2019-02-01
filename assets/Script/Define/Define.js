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
        QUADS: 4,
        STRAIGHT: 5,
        THREEPAIRS: 6,
        FOURPAIRS: 7,
    }
}

module.exports = Define;