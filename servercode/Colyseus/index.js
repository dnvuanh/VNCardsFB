require('dotenv').config();

const http = require('http');
const express = require('express');
const cors = require('cors');
const colyseus = require('colyseus');
const monitor = require("@colyseus/monitor").monitor;
const socialRoutes = require("@colyseus/social/express").default;
const BattleRoom = require('./VnCard').VnCardRoom;

const port = process.env.PORT || 2567;
const app = express()

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const gameServer = new colyseus.Server({
  server: server,
  express: app,
});

// register your room handlers
gameServer.define('BattleRoom', BattleRoom);

// register @colyseus/social routes
app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
app.use("/colyseus", monitor(gameServer));

gameServer.listen(port);
console.log(`Listening on ws://localhost:${ port }`)