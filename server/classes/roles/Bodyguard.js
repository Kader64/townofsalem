const Role = require("./Role");
class Bodyguard extends Role{
    constructor(){
        super("Bodyguard","Town","Protective","#7fff00",6,"assets/roles/bodyguard.png","An ex-soldier who secretly makes a living by selling protection",
        2,0,"Protect","Lynch every criminal and evildoer.",["Protect a player from direct attacks at night."],
        ["If your target is directly attacked or is the victim of a harmful visit, you and the visitor will fight.","If you successfully protect someone you can still be Healed."],
        5)
        this.vest = 1;
    }
    showNightActions(players,self){
        let playersList = [];
        players.forEach((p)=>{
            if(p.number == self.number){
                if(this.vest > 0){
                    playersList.push(this.addPlayerTab(p.number,p.nick,null,this.color,this.name,this.img,this.actionName))
                }
                else{
                    playersList.push(this.addPlayerTab(p.number,p.nick,null,this.color,this.name))
                }
            }
            else{
                playersList.push(this.addPlayerTab(p.number,p.nick,null,null,null,this.img,this.actionName))
            }
        })
        let targets = playersList.filter((p)=>{return (p.img != null)})
        self.emit("playerslist",playersList,targets)
    }
    useAbility(){
        
    }
}
module.exports = Bodyguard;