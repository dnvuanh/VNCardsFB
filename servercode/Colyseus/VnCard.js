const colyseus = require('colyseus');
const { User, verifyToken } = require("@colyseus/social");

exports.VnCardRoom = class extends colyseus.Room {
  onCreate (options) {
    console.log("onCreate",options)
  }
  onJoin(client, options, user) {
    console.log(user.username, "has joined the room!");
  }
  onMessage (client, message) {
    console.log("onMessage " + client.id + " | "  + message);
  }
  onLeave (client, consented) {
    console.log("onLeave " + client.id + " | "  + consented);
  }
  onDispose() {
    console.log("onDispose");
  }
  async onAuth(client, options) {
    // verify token authenticity
    console.log("onAuth", options.jwt)
    const token = verifyToken(options.jwt);
    console.log("token._id", token.sub)
    return await User.findById(token.sub);
  }
}
