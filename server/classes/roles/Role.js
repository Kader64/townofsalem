const Global = require("../Global");

class Role{
    static protectedPlayers = [];
    constructor(name,aligment,al_type,color,limit,img,desc,attack,defense,actionName,goal,abilities,attributes,possibletargets,priority){
        this.name = name;
        this.aligment = aligment;
        this.aligment_type = al_type;
        this.color = color;
        this.limit = limit;
        this.img = img;
        this.desc = desc;
        this.attack = attack;
        this.defense = defense;
        this.actionName = actionName;
        this.goal = goal;
        this.abilities = abilities;
        this.attributes = attributes;

        this.possibletargets = possibletargets
        this.targets = [0,0];
        this.killerInfo = "";
        this.performAction = false;
        this.priority = priority
    }
    showDayList(self){
        var playersList = [];
        if(this.name == "Vampire"){
            Global.alivePlayers.forEach((p)=>{
                playersList.push(this.addPlayerTab(p.number,p.nick,null,this.color,p.role.name==this.name?p.role.name:null));
            })
        }
        else if (this.aligment == "Mafia" || this.aligment == "Coven"){
            Global.alivePlayers.forEach((p)=>{
                playersList.push(this.addPlayerTab(p.number,p.nick,null,this.color,p.role.aligment==this.aligment?p.role.name:null));
            })
        }
        else{
            Global.alivePlayers.forEach((p)=>{
                playersList.push(this.addPlayerTab(p.number,p.nick,null,this.color,p.id==self.id?this.name:null));
            })
        }
        self.emit("playerslist",playersList,null)    
    }
    showNightList(self){
        
    }
    checkAbility(self){

    }
    addPlayerTab(number,nick,special,color,role,possibletargets,img,ability){
        return {number: number, nick: nick, special: special, color:color,role: role, possibletargets: possibletargets, img: img, ability: ability}
    }
    getPlayerByNumber(number){
        for(let i=0;i<Global.players.length;i++){
            if(Global.players[i].number == number){
                return Global.players[i]
            }
        }
        return 0;
    }
    kill(target){
        let found = false
        for(let i=0;i<Global.killed.length;i++){
            if(Global.killed[i].player == target){
                target.emit('servermsg',`You were ${this.killerInfo}`,"white","black");
                Global.killed[i].reason += " also "+this.killerInfo;
                Global.killed[i].reasonImg += `<img class="center_img" src="${this.img}">`;
                found = true;
            }
        }
        if(!found){
            Global.killed.push({player: target, 
                reason: "<div>He was "+this.killerInfo+"</div>",
                reasonImg: `<img class="center_img" src="${this.img}">`
            });
    
                target.emit('servermsg',`You were ${this.killerInfo}`,"white","black");
                target.emit('servermsg',`You have died!`,"white","red");
                target.emit('center_msg',`<span style="color: red; font-size:3.5vw">You have died!</span><img class="center_img" src="assets/skull.png">`);
        }
    }
}
module.exports = Role;
