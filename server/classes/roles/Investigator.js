const Role = require("./Role");
class Investigator extends Role{ 
    constructor(){
        super("Investigator","Town","Investigative","#7fff00",6,"assets/roles/investigator.png","You are a private eye who secretly gathers information.",
        0,0,"Investigate","Lynch every criminal and evildoer.",["Investigate one person each night for a clue to their role."],["None"],4)
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
module.exports = Investigator;