const Role = require("./Role");
class Escort extends Role{
    constructor(){
        super("Escort","Town","Support","#7fff00",6,"assets/roles/escort.png","You are a beautiful person skilled in distraction.",0,0,
        "Block","Lynch every criminal and evildoer.",["Distract someone each night."],["Distraction blocks your target from using their role's night ability.",
        "You cannot be role blocked."],3)
    }
    showNightActions(players,self){
        let playersList = [];
        players.forEach((p)=>{
            if(p.number == self.number){
                playersList.push(this.addPlayerTab(p.number,p.nick,null,this.color,this.name))
            }
            else{
                playersList.push(this.addPlayerTab(p.number,p.nick,null,null,null,this.img,this.actionName))
            }
        })
        let targets = playersList.filter((p)=>{return (p.img != null)})
        self.emit("playerslist",playersList,targets)
    }
}
module.exports = Escort;