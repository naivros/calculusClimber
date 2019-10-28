var server = require('http').createServer();
var fs = require('fs')
var io = require('socket.io')(server);
server.listen(3001);
var questions;
var filePath = 'questions.json';
try {
    questions = JSON.parse(fs.readFileSync(filePath));
    console.log("Questions Loaded...")
} catch (err) {
    // handle your file not found (or other error) here
    console.log('err')
}

const express = require('express')
const app = express()
  io.on('connection', function(client){

    client.on('event', function(data){});

    client.on('disconnect', function(){});

    client.on('create', function(room) {
       client.join(room);
    });
    client.on("playerPos", function(data){
      client.broadcast.to(data.id).emit('otherPlayerLocation', data);
      });
    client.on("sendMsg", function(data){
      client.broadcast.to(data.id).emit('msg', data);
    });
    client.on("requestPlayerNum", function(room){
      var roomCount = io.sockets.adapter.rooms[room];
      playerNumber = roomCount.length;
      client.emit("recvPlayerNum", playerNumber)
    });
    client.on("requestQuestion", function () {
        console.log('received question')
        var rand = getRandomInt(0, questions.length);
        selectedQuestion = questions[rand]
        client.emit("sendQuestion", selectedQuestion);
    });
    client.on("blocks", function(data){
      client.broadcast.to(data.id).emit('recvBlocks', data.blocks);
    });
  });
  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
// routes to serve the static HTML files
app.get('/', function(req, res) { res.sendFile( __dirname + "/html/" + "index.html" ) });
app.get('/create/:id', function(req, res) { res.sendFile( __dirname + "/html/" + "game.html" ) });
app.get('/join/:id', function(req, res) { res.sendFile( __dirname + "/html/" + "game.html" ) });
app.use('/static', express.static('public'))
app.listen(3000, () => console.log('Web Server on *:3000'))
console.log("Sockets Server on *:3001")
