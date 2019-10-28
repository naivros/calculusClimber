var server = require('http').createServer();
var io = require('socket.io')(server);
const express = require('express')
const app = express()
  io.on('connection', function(client){

  client.on('event', function(data){});

  client.on('disconnect', function(){});

  client.on('create', function(room) { client.join(room);
  });

  client.on("playerPos", function(data){
    client.broadcast.to(data.id).emit('otherPlayerLocation', data);

    });
  client.on("sendMsg", function(data){
    client.broadcast.to(data.id).emit('msg', data);
  });
  client.on("blocks", function(data){
    console.log(data.blocks)
    client.broadcast.to(data.id).emit('recvBlocks', data.blocks);
  });
  }); server.listen(3001);

// routes to serve the static HTML files
app.get('/', function(req, res) { res.sendFile( __dirname + "/html/" + "index.html" ) });
app.get('/create/:id', function(req, res) { res.sendFile( __dirname + "/html/" + "game.html" ) });
app.get('/join/:id', function(req, res) { res.sendFile( __dirname + "/html/" + "game.html" ) });
app.use('/static', express.static('public'))
app.listen(3000, () => console.log('Web Server on *:3000'))
console.log("Sockets Server on *:3001")
