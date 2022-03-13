const Role = require("./Role");
class Mafioso extends Role{
    constructor(){
        super("Mafioso","Mafia","Killing","#dd0000",2,"assets/roles/mafioso.png","You are a member of organized crime, trying to work your way to the top.",
        1,0,"Kill","Lynch every criminal and evildoer.",["Carry out the Godfather's orders."],
        ["You can attack if the Godfather doesn't give you orders.","If the Godfather dies you will become the next Godfather.","You can talk with the other Mafia at night."],
        7)
    }
    showNightActions(players,self){
        let playersList = [];
        players.forEach((p)=>{
            if(p.number == self.number || p.role.aligment == this.aligment){
                playersList.push(this.addPlayerTab(p.number,p.nick,null,this.color,this.name))
            }
            else{
                playersList.push(this.addPlayerTab(p.number,p.nick,null,null,null,this.img,this.actionName))
            }
        })
        let targets = playersList.filter((p)=>{return (p.img != null)})
        self.join("mafia");
        self.emit("playerslist",playersList,targets)
    }
    useAbility(players,self){
        var target = this.findByNumber(players,this.selectedTarget);
        if(Number.isInteger(target)){
            if(this.attack>target.role.defense){
                this.kill(players,this.selectedTarget)
            }
            else{
                
            }
        }
    }
}
module.exports = Mafioso;