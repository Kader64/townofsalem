const Role = require("./Role");
class Jailor extends Role{ 
    constructor(){
        super("Jailor","Town","Killing","#7fff00",1,"assets/roles/jailor.png","A prison guard who secretly detains suspects.",
        "Unstoppable","None","Execute","Lynch every criminal and evildoer.",["You may choose one person during the day to Jail for the night."],
        ["You may anonymously talk with your prisoner.","You can choose to attack your prisoner.","The jailed target can't perform their night ability.","If you execute a Town member, you forfeit further executions."])
    }
}
module.exports = Jailor;