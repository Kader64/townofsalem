const Lobby = require("./Lobby");

class Game {
    static rolelist;
    static players;

    static init = (players, rolelist)=> {
        this.rolelist = rolelist;
        this.players = players;
        
        this.players.forEach(socket => {
            socket.removeAllListeners();
        });
        io.emit("start");
    }
}

module.exports = Game;