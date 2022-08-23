const Global = require("../Global");
const Role = require("./Role");
const Visit = require("./Visit");

class Transporter extends Role{
    constructor(){
        super("Transporter","Town","Support","#7fff00",6,"assets/roles/transporter.png",
        "Your job is to transport people without asking any questions.",
        0,0,"Swap","Lynch every criminal and evildoer.",
        ["Choose two people to transport at night."],
        ["Transporting two people swaps all targets against them.",
        "You may transport yourself.",
        "Your targets will know they were transported."],2,1);
    }
    getActionMsg(){
        if(this.targets[0] == 0 && this.targets[1] == 0){
            this.performAction = false;
            return `You decided to stay home tonight.`
        }

        let target1 = this.getPlayerByNumber(this.targets[0]);
        let target2 = this.getPlayerByNumber(this.targets[1]);

        if(this.targets[0] != 0 && this.targets[1] != 0){
            this.performAction = true;
            return `You have decided to transport <span style="color: #fcc746">${target1.nick}</span> with 
            <span style="color: #fcc746">${target2.nick}</span> tonight.`
        }
        else{
            this.performAction = false;
            return `You have decided to transport <span style="color: #fcc746">${this.targets[0]==0?target2.nick:target1.nick}</span> tonight.`
        }
    }
    showNightList(self){
        let playersList = [];
        Global.alivePlayers.forEach((p)=>{
            playersList.push(this.addPlayerTab(p.number,p.nick,null,null,null,this.possibletargets,this.img,this.actionName))
        })
        let targets = playersList.filter((p)=>{return (p.img != null)})
        self.emit("playerslist",playersList,targets)
    }
    useAbility(self){
        if(this.performAction){
            let target1 = this.getPlayerByNumber(this.targets[0]);
            let target2 = this.getPlayerByNumber(this.targets[1]);

            target1.emit("servermsg",`You were transported to another location.`,"black","c4c4c4")
            target2.emit("servermsg",`You were transported to another location.`,"black","c4c4c4")

            if(target1.number == target2.number){
                Global.visits.push(new Visit(self,target1));
                this.performAction = false;
            }
            else{
                Global.visits.push(new Visit(self,target1));
                Global.visits.push(new Visit(self,target2));
    
                let temp = target1.number;
                target1.number = target2.number;
                target2.number = temp;
            }
        }
        else{
            self.emit('servermsg',`You didn't perform your night ability!`,"white","red")
        }
    }
    checkAbility(self){
        if(this.performAction){
            let target1 = this.getPlayerByNumber(this.targets[0]);
            let target2 = this.getPlayerByNumber(this.targets[1]);

            let temp = target1.number;
            target1.number = target2.number;
            target2.number = temp;
        }
    }
}
module.exports = Transporter;