const Role = require("./Role");
class Crusader extends Role{
    constructor(){
        super("Crusader","Town","Protective","#7fff00",6,"assets/roles/crusader.png","A divine protector skilled in the art of combat",
        0,1,"Protect","Lynch every criminal and evildoer.",["Protect one person other than yourself during the night."],["Grant your target Powerful defense",
        "You will know if your target is attacked.","You attack one person who visits your target on the same night.","You do not attack vampires, but you do block their attacks."],
        5);
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
module.exports = Crusader;