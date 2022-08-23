const Global = require("../Global");
const Role = require("./Role");

class Veteran extends Role{
    constructor(){
        super("Veteran","Town","Killing","#7fff00",1,"assets/roles/veteran.png",
        "You are a paranoid war hero who will shoot anyone who visits you.",
        2,0,"Alert","Lynch every criminal and evildoer.",
        ["Decide if you will go on alert."],
        ["While on alert you gain Basic Defense.",
        "While on alert, you will deliver a Powerful attack to anyone who visits you.",
        "You can only go on alert 3 times.",
        "You cannot be role blocked."],1);
        super.killerInfo = `killed by a&nbsp;<span style="color: ${this.color}">${this.name}</span>`;
        this.alerts = 3;
    }
    getActionMsg(){
        if(this.targets[0] != 0){
            this.performAction = true;
            return `You have decided to go on alert tonight`;
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
                if(this.alerts > 0){
                    playersList.push(this.addPlayerTab(p.number,p.nick,null,this.color,this.name,this.possibletargets,this.img,this.actionName))
                }
                else{
                    playersList.push(this.addPlayerTab(p.number,p.nick,null,this.color,this.name))
                }
            }
            else{
                playersList.push(this.addPlayerTab(p.number,p.nick))
            }
        })
        let targets = playersList.filter((p)=>{return (p.img != null)})
        self.emit("playerslist",playersList,targets)
    }
    useAbility(self){
        if(this.performAction){
            this.alerts--;
            this.defense = 1;
        }
        else{
            self.emit('servermsg',`You didn't perform your night ability!`,"white","red")
        }
    }
    checkAbility(self){
        if(this.performAction){
            this.defense = 0;
            Global.visits.forEach(v=>{
                if(self.number == v.target.number){
                    if(this.attack > v.visitor.role.defense){
                        self.emit('servermsg',`You shot someone visiting you last night!.`,"white","red")
                        this.kill(v.visitor)
                    }
                    else{
                        self.emit('servermsg',`Target's defense too strong to kill.`,"white","red")
                    }
                }
            })
        }
    }
}
module.exports = Veteran;