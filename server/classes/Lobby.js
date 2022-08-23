const roles = require("./RoleManager");
const Game = require("./Game");
class Lobby {
    possibleNames = ["Cotton Mather","Deodat Lawson","Edward Bishop","Giles Corey","James Bayley","James Russel","John Hathorne",
    "John Proctor","John Willard","Jonathan Corwin","Samuel Parris","Samuel Sewall","Thomas Danforth","William Hobbs","William Phips",
    "Abigail Hobbs","Alice Young","Ann Hibbins","Ann Putnam","Ann Sears","Betty Parris","Dorothy Good","Lydia Dustin","Martha Corey",
    "Mary Eastey","Mary Johnson","Mary Warren","Sarah Bishop","Sarah Good","Sarah Wildes"];
    players = [];
    rolelist = [];
    status = "Lobby";
    gameSettings = {
        role_limit: 6,
        mafia_limit: 4,
        coven_Limit: 4,
        vamps_limit: 4,
    }
    joinPlayer(socket){
        if(this.status=="Lobby"){
            this.#addNewPlayer(socket);
            socket.on("nick",(n)=>{
                this.#updateNick(n,socket)
            })
            socket.on("lobby_message",(msg)=>{
                this.#playersMsg(msg,socket)
            })
            socket.on("addRole",(role)=>{
                this.#addRole(role,socket.id)
            })
            socket.on("removeRole",(index)=>{
                this.#removeRole(index,socket.id)
            })
            socket.on("start",()=>{
                this.#startGame(socket.id);
            })
            socket.on("disconnect",()=>{
                console.log(socket.id + ' disconnected');
                let p;
                for(var i=0;i<this.players.length;i++){
                    if(this.players[i].id==socket.id){
                        p = this.players.splice(i,1);
                        break;
                    }
                }
                io.emit("lobby_players", this.#showPlayers());
                io.emit("l_servermsg",`<span style="color:gold; font-size:1.1vw">${socket.nick}</span> left the game.`,"#02fb4c","none");
            })
        }
        else{
            io.to(socket.id).emit("l_servermsg","Game is currently running, try to reconnect later...","#ff1818","left")
            socket.disconnect();
        }
    }
    #playersMsg = (msg,player) => {
        msg = msg.trim();
        msg = msg.replaceAll("<","≤");
        io.emit("lobby_msg", msg, player.nick)
    }
    #addNewPlayer(socket){
        socket.nick = this.#random_name();
        this.players.push(socket);
        io.emit("lobby_players", this.#showPlayers());
        io.emit("rolelist", this.rolelist);
        socket.broadcast.emit("l_servermsg",`<span style="color:gold; font-size:1.1vw">${socket.nick}</span> joined the game.`,"#02fb4c","none");
        io.to(socket.id).emit("l_servermsg","Welcome! Server running","#02fb4c","none")
    }
    #random_name = () =>{
        let number = Math.floor(Math.random()*this.possibleNames.length);
        let n = this.possibleNames[number];
        this.possibleNames.splice(number,1);
        return n;
    }
    #showPlayers(){
        var nicks = [];
        this.players.forEach((s)=>{
            nicks.push(s.nick);
        })
        return nicks;
    }
    #updateNick = (n,player) => {
        n = n.trim();
        n = n.replaceAll("<","≤");
        if(n.length>0 && n.length<=15){
            if(this.players.filter((e)=>{return (e.nick == n)}).length == 0){
                player.nick = n;
                io.emit("lobby_players", this.#showPlayers());
                io.to(player.id).emit("l_servermsg","Your nickname has been updated.","#02fb4c","none")
            }
            else{
                io.to(player.id).emit("l_servermsg","This nickname is taken by another player.","#ff1818","none")
            }
        }
        else{
            io.to(player.id).emit("l_servermsg","The nickname must be at least 1 to 15 characters long.","#ff1818","none")
        }
    }
    #rolelist_validation = (role,id) =>{
        role = role.replace(/\s/g, "");
        let playerRole;
        if(this.players[0].id != id){
            return "Only host can add roles";
        }
        try{
            playerRole = eval("new roles."+role+"()");
        }catch(e){
            return "The selected role does not exist.";
        }
        if(this.rolelist.length >= 15){
            return "The Role list is full";
        }
        if(this.rolelist.filter((e)=>{return (e.name == playerRole.name)}).length >= playerRole.limit){
            return `${playerRole.name} is limited to ${playerRole.limit} per game.`
        }
        switch(playerRole.aligment){
            case "Mafia": 
                if(this.rolelist.filter((e)=>{return (e.aligment == playerRole.aligment)}).length >= this.gameSettings.mafia_limit){
                    return `Mafia roles are limited to "+${this.gameSettings.mafia_limit} per game.`;
                }
            break;
            case "Coven": 
                if(this.rolelist.filter((e)=>{return (e.aligment == playerRole.aligment)}).length >= this.gameSettings.coven_limit){
                    return `Coven roles are limited to "+${this.gameSettings.coven_limit} per game.`;
                }
            break;
            case "Neutral":
                if(playerRole.name == "Vampire" && this.rolelist.filter((e)=>{return (e.name == playerRole.name)}).length >= this.gameSettings.vamps_limit){
                    return `Vampires are limited to "+${this.gameSettings.vamps_limit} per game.`;
                }
            break;
        }
        this.rolelist.push(playerRole);
        return "OK";
    }
    #start_validation(id){
        if(this.players[0].id != id){
            return "Only host can start the game";
        }
        if(this.players.length < 2){
            return "There must be at least 2 players in the game."
        }
        if(this.rolelist.length != this.players.length){
            return "The number of roles must be equal to the number of players.";
        }
        return "OK";
    }
    #addRole = (role,id) =>{
        let results = this.#rolelist_validation(role,id);
        if(results === "OK"){
            io.emit("rolelist",this.rolelist)
        }
        else{
            io.to(id).emit("l_servermsg",results,"#ff1818","none")
        }
    }
    #removeRole = (index,id) =>{
        if(this.players[0].id == id){
            this.rolelist.splice(index,1);
            io.emit("rolelist",this.rolelist)
        }
        else{
            io.to(id).emit("l_servermsg","Only host can remove roles","#ff1818","none")
        }
    }
    #startGame(id){
        let results = this.#start_validation(id);
        if(results == "OK"){
            this.status = "Game";
            var game = new Game(this.players,this.rolelist);
            game.start();
        }
        else{
            io.to(id).emit("l_servermsg",results,"#ff1818","none")
        }
    }
}
module.exports = Lobby;