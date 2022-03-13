const Role = require("./Role");
class Doctor extends Role{
    constructor(){
        super("Doctor","Town","Protective","#7fff00",6,"assets/roles/doctor.png"," A surgeon skilled in trauma care who secretly heals people.",
        0,0,"Heal","Lynch every criminal and evildoer.",["Heal one person each night, granting them Powerful defense."],
        ["You may only Heal yourself once.","You will know if your target is attacked."],5)
        this.selfHeal = 1;
    }
    showNightActions(players,self){
        let playersList = [];
        players.forEach((p)=>{
            if(p.number == self.number){
                if(this.selfHeal > 0){
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
}
module.exports = Doctor;