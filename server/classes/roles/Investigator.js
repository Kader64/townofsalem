const Global = require("../Global");
const Role = require("./Role");
const Visit = require("./Visit");

class Investigator extends Role{ 
    constructor(){
        super("Investigator","Town","Investigative","#7fff00",
        6,"assets/roles/investigator.png",
        "You are a private eye who secretly gathers information.",
        0,0,"Investigate","Lynch every criminal and evildoer.",
        ["Investigate one person each night for a clue to their role."],
        ["None"],1,4)
    }
    getActionMsg(){
        if(this.targets[0] != 0){
            this.performAction = true;
            let target1 = this.getPlayerByNumber(this.targets[0]);
            return `You have decided to investigate <span style="color: #fcc746">${target1.nick}</span> tonight.`
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
            let role = target1.role.name;
            if(["framer","vampire","jester","hex master"].includes(role.toLowerCase())){
                self.emit('servermsg',`Your target could be a Framer, Vampire, Jester, or Hex Master.`,"white","red")
                return;
            }
            if(["vigilante","veteran","mafioso","pirate","ambusher"].includes(role.toLowerCase())){
                self.emit('servermsg',`Your target could be a Vigilante, Veteran, Mafioso, Pirate, or Ambusher.`,"white","red")
                return;
            }
            if(["medium","janitor","retributionist","necromancer","trapper"].includes(role.toLowerCase())){
                self.emit('servermsg',`Your target could be a Medium, Janitor, Retributionist, Necromancer, or Trapper.`,"white","red")
                return;
            }
            if(["survivor","vampire hunter","amnesiac","medusa","psychic"].includes(role.toLowerCase())){
                self.emit('servermsg',`Your target could be a Survivor, Vampire Hunter, Amnesiac, Medusa, or Psychic.`,"white","red")
                return;
            }
            if(["spy","blackmailer","jailor","guardian angel"].includes(role.toLowerCase())){
                self.emit('servermsg',`Your target could be a Spy, Blackmailer, Jailor, or Guardian Angel.`,"white","red")
                return;
            }
            if(["sheriff","executioner","werewolf","poisoner"].includes(role.toLowerCase())){
                self.emit('servermsg',`Your target could be a Sheriff, Executioner, Werewolf, or Poisoner.`,"white","red")
                return;
            }
            if(["lookout","forger","juggernaut","coven leader"].includes(role.toLowerCase())){
                self.emit('servermsg',`Your target could be a Lookout, Forger, Juggernaut, or Coven Leader.`,"white","red")
                return;
            }
            if(["escort","transporter","consort","hypnotist"].includes(role.toLowerCase())){
                self.emit('servermsg',`Your target could be an Escort, Transporter, Consort, or Hypnotist.`,"white","red")
                return;
            }
            if(["bodyguard","godfather","arsonist","crusader"].includes(role.toLowerCase())){
                self.emit('servermsg',`Your target could be a Bodyguard, Godfather, Arsonist, or Crusader.`,"white","red")
                return;
            }
            if(["investigator","consigliere","mayor","tracker","plaguebearer"].includes(role.toLowerCase())){
                self.emit('servermsg',`Your target could be an Investigator, Consigliere, Mayor, Tracker, or Plaguebearer.`,"white","red")
                return;
            }
        }
    }
}
module.exports = Investigator;