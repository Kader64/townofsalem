const Global = require("../Global");
const Role = require("./Role");
const Visit = require("./Visit");

class Mafioso extends Role{
    constructor(){
        super("Mafioso","Mafia","Killing","#dd0000",1,"assets/roles/mafioso.png",
        "You are a member of organized crime, trying to work your way to the top.",
        1,0,"Kill","Kill anyone that will not submit to the Mafia.",
        ["Carry out the Godfather's orders."],
        ["You can attack if the Godfather doesn't give you orders.",
        "If the Godfather dies you will become the next Godfather.",
        "You can talk with the other Mafia at night."],
        1,4)
        super.killerInfo = `killed by a&nbsp;<span style="color: ${this.color}">member of the mafia</span>`
    }
    getActionMsg(){
        if(this.targets[0] != 0){
            this.performAction = true;
            let target1 = this.getPlayerByNumber(this.targets[0]);
            return `You have voted to kill <span style="color: #fcc746">${target1.nick}</span> tonight.`
        }
        else{
            this.performAction = false;
            return `You decided to stay home tonight.`
        }
    }
    showNightList(self){
        let playersList = [];
        Global.alivePlayers.forEach((p)=>{
            if(p.number == self.number || p.role.aligment == this.aligment){
                playersList.push(this.addPlayerTab(p.number,p.nick,null,this.color,this.name))
            }
            else{
                playersList.push(this.addPlayerTab(p.number,p.nick,null,null,null,this.possibletargets,this.img,this.actionName))
            }
        })
        let targets = playersList.filter((p)=>{return (p.img != null)})
        self.join("mafia");
        self.emit("playerslist",playersList,targets)
    }
    useAbility(self){
        if(this.performAction){
            let target1 = this.getPlayerByNumber(this.targets[0]);
            Global.visits.push(new Visit(self,target1));
        }
        else{
            self.emit('servermsg',`You didn't perform your night ability!`,"white","red")
        }

    }
    checkAbility(self){
        if(this.performAction){
            let target1 = this.getPlayerByNumber(this.targets[0]);
            if(this.attack > target1.role.defense){
                this.kill(target1)
            }
            else{
                self.emit('servermsg',`Target's defense too strong to kill.`,"white","red")
            }
        }
    }
}
module.exports = Mafioso;