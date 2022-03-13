const roles = require("./RoleManager");
class Game{
    constructor(players,rolelist){
        this.rolelist = rolelist;
        this.hiddenRolelist = [...rolelist]; //ZMIENIC
        this.players = players;
        this.alivePlayers = [...players];
        this.deadPlayers = [];
        this.countDays = 1;
    }
    start(){
        this.players.forEach(socket => {
            socket.removeAllListeners();
            this.#addEvents(socket);
        });
        this.#addNumbers();
        this.#random_roles();
        io.emit("start",this.rolelist);
        this.players.forEach((p)=>{
            var attack,defense;
            switch(p.role.defense){
                case 0: defense = "None"; break;
                case 1: defense = "Basic"; break;
                case 2: defense = "Powerful"; break;
                case 3: defense = "Invincible"; break;
            }
            switch(p.role.attack){
                case 0: attack = "None"; break;
                case 1: attack = "Basic"; break;
                case 2: attack = "Powerful"; break;
                case 3: attack = "Unstoppable"; break;
            }
            p.emit("rolecard",
            p.nick,p.role.name,p.role.color,attack,defense,p.role.aligment,p.role.aligment_type,p.role.goal,p.role.abilities,p.role.attributes)
        })
        let time = 2;
        io.emit('servermsg',`<span style="font-weight: bolder">Day ${this.countDays}</span>`,"black","c4c4c4")
        io.emit('newStage',time,"Day",this.countDays)
        this.players.forEach((p)=>{
            p.role.showDayList(this.alivePlayers,p);
            p.leaveAll();
            p.join("dayChat");
        })
        let int = setInterval(()=>{
            time--;
            if(time<0){
                this.#startNightPhase();
                clearInterval(int);
            }
        },1000)
    }
    #addEvents(socket){
        socket.on("game_message",(msg)=>{
            this.#playerMsg(msg,socket);
        })
    }
    #random_number(numbers){
        let number = Math.floor(Math.random()*numbers.length);
        let n = numbers[number];
        numbers.splice(number,1);
        return n;
    }
    #addNumbers(){
        let numbers = [];
        for(var i=1;i<=this.players.length;i++){
            numbers.push(i);
        }
        this.players.forEach((p)=>{
            p.number = this.#random_number(numbers);
        })
        this.players.sort(function(a, b){return a.number - b.number}); 
    }
    #random_roles(){
        this.players.forEach((p)=>{
            let index = Math.floor(Math.random()*this.hiddenRolelist.length);
            p.role = this.hiddenRolelist[index];
            this.hiddenRolelist.splice(index,1);
        })
    }
    #playerMsg(msg,player){
        msg = msg.replaceAll("<","≤");
        Array.from(player.rooms).forEach((r)=>{
            player.to(r).emit("msg", msg, player.number, player.nick);
        })
    }
    #startNightPhase(){
        let time = 10;
        io.emit('newStage',time,"Night",this.countDays)
        io.emit("clear")
        io.emit('servermsg',`<span style="font-weight: bolder">Night ${this.countDays}</span>`,"black","c4c4c4")
        this.alivePlayers.forEach((p)=>{
            p.leave("dayChat");
            p.role.showNightActions(this.alivePlayers,p);
            p.on("selectTarget",(n)=>{
                p.role.selectedTarget = n;
            })
        })
        let int = setInterval(()=>{
            time--;
            if(time<0){
                this.#startSummaryPhase();
                clearInterval(int);
            }
        },1000)
    }
    #startSummaryPhase(){
        let time = 5;
        this.countDays++;
        io.emit('newStage',time,"Day",this.countDays)
        io.emit("clear")
        io.emit('servermsg',`<span style="font-weight: bolder">Day ${this.countDays}</span>`,"black","c4c4c4")
        var pList = [...this.alivePlayers]; 
        pList.sort(function(a, b){return a.role.priority - b.role.priority})
        pList.forEach((p)=>{
            p.off("selectTarget",()=>{})
            p.leaveAll();
            p.join("dayChat");
            p.role.useAbility(this.alivePlayers,p)
            p.role.showDayList(this.alivePlayers,p);
        })
        let int = setInterval(()=>{
            time--;
            if(time<0){
                this.#startDiscussionPhase();
                clearInterval(int);
            }
        },1000)
    }
    #startDiscussionPhase(){
        let time = 45;
        io.emit('newStage',time,"Day",this.countDays)
        let int = setInterval(()=>{
            time--;
            if(time<0){
                this.#startNightPhase();
                clearInterval(int);
            }
        },1000)
    }
    /*
    #startVotingPhase(){
        this.time = 30;
    }
    #startTrailDefensePhase(){
        this.time = 20;
    }
    #startTrailVotingPhase(){
        this.currentTrial++;
        this.time = 15;
        //IFIFIF
    }
    */

}
module.exports = Game;