const Role = require("./Role");
class Lookout extends Role{ 
    constructor(){
        super("Lookout","Town","Investigative","#7fff00",6,"assets/roles/lookout.png","You are an eagle-eyed observer, stealthily camping outside houses to gain information.",
        0,0,"Watch","Lynch every criminal and evildoer.",["Watch one person at night to see who visits them."],["None."],6)
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
module.exports = Lookout;