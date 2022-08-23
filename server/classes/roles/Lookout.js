const Global = require("../Global");
const Role = require("./Role");
const Visit = require("./Visit");

class Lookout extends Role{ 
    constructor(){
        super("Lookout","Town","Investigative","#7fff00",6,
        "assets/roles/lookout.png","You are an eagle-eyed observer, stealthily camping outside houses to gain information.",
        0,0,"Watch","Lynch every criminal and evildoer.",
        ["Watch one person at night to see who visits them."],["None."],1,4)
    }
    getActionMsg(){
        if(this.targets[0] != 0){
            this.performAction = true;
            let target1 = this.getPlayerByNumber(this.targets[0]);
            return `You have decided to watch <span style="color: #fcc746">${target1.nick}</span> tonight.`
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
                playersList.push(this.addPlayerTab(p.number,p.nick,null,this.color,this.name))
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
            Global.visits.push(new Visit(self,target1));
        }
        else{
            self.emit('servermsg',`You didn't perform your night ability!`,"white","red")
        }
    }
    checkAbility(self){
        if(this.performAction){
            let target1 = this.getPlayerByNumber(this.targets[0]);
            Global.visits.forEach(v=>{
                if(target1.number == v.target.number && v.visitor.number != self.number){
                    self.emit('servermsg',`<span style="color: white">${v.visitor.nick}</span> visited your target last night!`,"lime","black")
                }
            })
        }
    }
}
module.exports = Lookout;