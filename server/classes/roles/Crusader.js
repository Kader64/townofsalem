const Global = require("../Global");
const Role = require("./Role");

class Crusader extends Role{
    constructor(){
        super("Crusader","Town","Protective","#7fff00",6,"assets/roles/crusader.png",
        "A divine protector skilled in the art of combat",
        0,1,"Protect","Lynch every criminal and evildoer.",["Protect one person other than yourself during the night."],
        ["Grant your target Powerful defense",
        "You will know if your target is attacked.","You attack one person who visits your target on the same night.",
        "You do not attack vampires, but you do block their attacks."],1,3);
    }
    getActionMsg(self){
        if(this.targets[0] != 0){
            this.performAction = true;
            let target1 = this.getPlayerByNumber(this.targets[0]);
            return `You have decided to guard <span style="color: #fcc746">${target1.nick}</span> tonight.`
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
        this.targets.forEach(t=>{
            if(t==0){
                self.emit('servermsg',`You didn't perform your night ability!`,"black","red")
                return;
            }
            else{
                
            }
        })

        // if(this.selectedTarget==0){
        //     self.emit('servermsg',`You didn't perform your night ability!`,"black","red")
        // }
        // let arr = [];
        // Global.alivePlayers.forEach(p=>{
        //     if((p.role.selectedTarget == this.selectedTarget && p.role.selectedTarget != p.role.number) || (p.role.firstSelectedTarget = this.selectedTarget || p.role.firstSelectedTarget == this.selectedTarget)){
        //         arr.push(p);
        //     }
        // })
        // if(arr>0){
        //     self.emit('servermsg',`You attacked someone visiting your target!`,"black","red")
        // }
        // Global.toKill.push(arr[Math.round(Math.random()*arr.length)]);
        // this.selectedTarget = 0;
    }
}
module.exports = Crusader;