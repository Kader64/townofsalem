class Role{
    static protectedPlayers = [];
    constructor(name,aligment,al_type,color,limit,img,desc,attack,defense,actionName,goal,abilities,attributes,priority){
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
        this.priority = priority;
        this.selectedTarget = 0;
    }
    showDayList(players,self){
        var playersList = [];
        if(this.name == "Vampire"){
            players.forEach((p)=>{
                playersList.push(this.addPlayerTab(p.number,p.nick,null,this.color,p.role.name==this.name?p.role.name:null));
            })
        }
        else if (this.aligment == "Mafia" || this.aligment == "Coven"){
            players.forEach((p)=>{
                playersList.push(this.addPlayerTab(p.number,p.nick,null,this.color,p.role.aligment==this.aligment?p.role.name:null));
            })
        }
        else{
            players.forEach((p)=>{
                playersList.push(this.addPlayerTab(p.number,p.nick,null,this.color,p.id==self.id?this.name:null));
            })
        }
        self.emit("playerslist",playersList,null)    
    }
    kill(players,number){
        for(var i=0;i<players.length;i++){
            if(players.number == number){
                players.slice(i,1);
                break;
            }
        }
        io.emit("",)
    }
    findByNumber(players,number){
        for(var i=0;i<players.length;i++){
            if(players[i].number == number){
                return players[i];
            }
        }
    }
    addPlayerTab(number,nick,special,color,role,img,ability){
        return {number: number, nick: nick, special: special,color:color,role: role, img: img, ability: ability}
    }
}
module.exports = Role;
