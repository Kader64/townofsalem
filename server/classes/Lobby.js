const Message = require("./MessageManager");
const Game = require("./Game")
const { getRole } = require('./RoleManager')

class Lobby{
    possibleNames = ["Cotton Mather","Deodat Lawson","Edward Bishop","Giles Corey","James Bayley","James Russel","John Hathorne",
    "John Proctor","John Willard","Jonathan Corwin","Samuel Parris","Samuel Sewall","Thomas Danforth","William Hobbs","William Phips",
    "Abigail Hobbs","Alice Young","Ann Hibbins","Ann Putnam","Ann Sears","Betty Parris","Dorothy Good","Lydia Dustin","Martha Corey",
    "Mary Eastey","Mary Johnson","Mary Warren","Sarah Bishop","Sarah Good","Sarah Wildes"];
    players = []
    rolelist = []
    status = 0

    joinPlayer(socket){
        if(this.status!=0){
            io.to(socket.id).emit("servermsg","Game is currently running, try to reconnect later...","#ff1818","none")
            socket.disconnect();
            return;    
        }

        this.#onNewSocket(socket);
        socket.on("nick",(nick)=>{
            this.#onUpdateNick(nick,socket)
        })
        socket.on("msg",(msg)=>{
            this.#onPlayerMessage(msg,socket)
        })
        socket.on("addRole",(role)=>{
            this.#onAddRole(role,socket)
        })
        socket.on("removeRole",(index)=>{
            this.#onRemoveRole(index,socket)
        })
        socket.on("start",()=>{
            this.#onGameStart(socket);
        })
        socket.on("disconnect",()=>{
            this.#onDisconnect(socket);
        })
    }

    #onNewSocket(socket){
        socket.defaultNick = this.#getRandomName();
        socket.nick = socket.defaultNick;
        this.players.push(socket);
        Message.emitLobbyPlayerList(this.players)
        Message.emitLobbyRoleList(this.rolelist)
        socket.broadcast.emit("servermsg",`<span style="color:gold; font-size:1.1vw">${socket.defaultNick}</span> joined the game.`,"#02fb4c","none");
        io.to(socket.id).emit("servermsg","Welcome! Server running","#02fb4c","none")
    }
    
    #getRandomName = () =>{
        let number = Math.floor(Math.random()*this.possibleNames.length);
        let nick = this.possibleNames[number];
        this.possibleNames.splice(number,1);
        return nick;
    }

    #onUpdateNick = (nick,socket) => {
        nick = nick.trim();
        nick = nick.replaceAll("<","≤");
        if(!(nick.length>0 && nick.length<=15)){
            io.to(socket.id).emit("servermsg","The nickname must be at least 1 to 15 characters long.","#ff1818","none")
            return;
        }
        if(this.players.filter((e)=>{return (e.nick == nick)}).length == 0){
            socket.nick = nick;
            Message.emitLobbyPlayerList(this.players)
            io.to(socket.id).emit("servermsg","Your nickname has been updated.","#02fb4c","none")
            return;
        }
        io.to(socket.id).emit("servermsg","This nickname is taken by another player.","#ff1818","none")
    }
    
    #onPlayerMessage = (msg,player) => {
        msg = msg.trim();
        msg = msg.replaceAll("<","≤");
        io.emit("msg", msg, player.nick)
    }

    #onAddRole = (id,socket) =>{
        let role = getRole(id)
        try{
            if(role==-1){
                throw "The selected role does not exist.";
            }
            if(this.players[0].id != socket.id){
                throw "Only host can add roles";
            }
            if(this.rolelist.length >= 15){
                throw "The Role list is full";
            }
            let sameRolesCount = this.rolelist.filter((e)=>{return (e.name == role.name)}).length;
            if(sameRolesCount >= role.limit){
                throw `${role.name} is limited to ${role.limit} per game.`
            }

            this.rolelist.push(role);
            Message.emitLobbyRoleList(this.rolelist)
        }
        catch(e){
            io.to(socket.id).emit("servermsg",e,"#ff1818","none")
        }
    }

    #onRemoveRole = (index,socket) =>{
        if(this.players[0].id == socket.id){
            this.rolelist.splice(index,1);
            Message.emitLobbyRoleList(this.rolelist);
        }
        else{
            io.to(socket.id).emit("servermsg","Only host can edit rolelist","#ff1818","none")
        }
    }

    #onGameStart(socket){
        try{
            if(this.players[0].id != socket.id){
                throw "Only host can start the game";
            }
            // if(this.players.length < 2){
            //     throw "There must be at least 2 players in the game."
            // }
            if(this.rolelist.length != this.players.length){
                throw "The number of roles must be equal to the number of players.";
            }
            
            this.status = 1;
            Game.init(this.players, this.rolelist)
        }
        catch(e){
            io.to(socket.id).emit("servermsg",e,"#ff1818","none")
        }
    }

    #onDisconnect = (socket) => {
        console.log(socket.id + ' disconnected');
        for(var i=0;i<this.players.length;i++){
            if(this.players[i].id==socket.id){
                this.players.splice(i,1);
                break;
            }
        }
        this.possibleNames.push(socket.defaultNick);
        Message.emitLobbyPlayerList(this.players);
        io.emit("servermsg",`<span style="color:gold; font-size:1.1vw">${socket.nick}</span> left the game.`,"#02fb4c","none");
    }
}
module.exports = Lobby;