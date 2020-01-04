

const Colyseus = require("colyseus.js");

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad()
    {
        let client = new Colyseus.Client("ws://localhost:2567");
            
        client.joinOrCreate("BattleRoom", {"jwt":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZDZiZjdlODA2MWIxNmFjMWVlYjZjNjMiLCJpYXQiOjE1Njc0MTM2MTN9.1NFYxYOFaiduVUdDmjm5YAVmRnqeA_ctZsre4YpKs-8"}).then(room => {
            console.log("joined successfully", room);
          }).catch(e => {
            console.error("join error", e);
          });
    },
});
