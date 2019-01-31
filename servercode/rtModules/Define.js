function Define()
{
    this.GameState = {
        WAITING:0,
        READY:1,
        STARTED:2,
        RUNNING:3,
        GAMEOVER:4
    }
    
    this.ERROR_CODE = {
        ERROR_DUPLICATED_SEAT : 5001,
        ERROR_ENTER_SEAT_MATCH_STARTED : 5002,
    }
}
module.exports = new Define();