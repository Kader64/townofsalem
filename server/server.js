const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();

const clientPath = `${__dirname}/../client`;
console.log('Serving static from '+clientPath);

app.use(express.static(clientPath));
const server = http.createServer(app);

server.on("error",(e)=>{
    console.error('Server error:',e);
});
server.listen(8080,()=>{
    console.log('Server started on 8080');
});

const io = socketio(server);
//------------------------------------//
const Lobby = require("./classes/Lobby");
var lobby = new Lobby();
global.io = io;

io.on('connection',(socket)=>{
    console.log(socket.id + ' connected');
    lobby.joinPlayer(socket);
});
