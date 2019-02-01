function Define()
{
    this.GameState = {
        WAITING:0,
        READY:1,
        STARTED:2,
        RUNNING:3,
        GAMEOVER:4
    }
    
    this.DefaultCards = [12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63]
    
    this.ERROR_CODE = {
        ERROR_DUPLICATED_SEAT : 5001,
        ERROR_ENTER_SEAT_MATCH_STARTED : 5002,
    }
    
    this.SetType = {
        ERROR:      0,
        SINGLE:     1,
        PAIR:       2,
        TRIPLE:     3,
        QUADS:      4,
        STRAIGHT:   5,
        THREEPAIRS: 6,
        FOURPAIRS:  7,
    }
}
module.exports = new Define();