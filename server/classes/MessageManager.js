class Message{

    static emitLobbyPlayerList = (sockets) =>{
        let nicks = [];
        sockets.forEach((s)=>{
            nicks.push(s.nick);
        })
        io.emit("lobby_players", nicks);
    }

    static emitLobbyRoleList = (rolelist) =>{
        io.emit("rolelist", rolelist);
    }
    
}
module.exports = Message;