const Global = require("../Global");
const Role = require("./Role");
const Visit = require("./Visit");

class Bodyguard extends Role{
    constructor(){
        super("Bodyguard","Town","Protective","#7fff00",6,"assets/roles/bodyguard.png",
        "An ex-soldier who secretly makes a living by selling protection",
        2,0,"Protect","Lynch every criminal and evildoer.",["Protect a player from direct attacks at night."],
        ["If your target is directly attacked or is the victim of a harmful visit, you and the visitor will fight.",
        "If you successfully protect someone you can still be Healed."],1,3)
        this.vest = 1;
    }
    getActionMsg(self){
        if(this.targets[0] != 0){
            this.performAction = true;
            let target1 = this.getPlayerByNumber(this.targets[0]);
            return `You have decided to protect <span style="color: #fcc746">${target1.nick}</span> tonight.`
        }
        if(this.targets[0] == self.number){
            this.performAction = true;
            return `You have decided to put bulletproof vest tonight.`
        }
        else{
            this.performAction = false;
            return `You decided to stay home tonight.`
        }
    }
    showNightList(self){
        let playersList = [];
        Global.alivePlayers.forEach((p)=>{
            if(p.number == self.number){
                if(this.vest > 0){
                    playersList.push(this.addPlayerTab(p.number,p.nick,null,this.color,this.name,this.possibletargets,this.img,this.actionName))
                }
                else{
                    playersList.push(this.addPlayerTab(p.number,p.nick,null,this.color,this.name))
                }
            }
            else{
                playersList.push(this.addPlayerTab(p.number,p.nick,null,null,null,this.possibletargets,this.img,this.actionName))
            }
        })
        let targets = playersList.filter((p)=>{return (p.img != null)})
        self.emit("playerslist",playersList,targets)
    }
    useAbility(self){
        if(this.performAction){
            let target1 = this.getPlayerByNumber(this.targets[0]);
            target1.role.defense = 2;
            Global.visits.push(new Visit(self,target1));
        }
        else{
            self.emit('servermsg',`You didn't perform your night ability!`,"white","red")
        }
    }
    checkAbility(self){
        if(this.performAction){
            let target1 = this.getPlayerByNumber(this.targets[0]);
            target1.role.defense = 0;
        }
    }
}
module.exports = Bodyguard;