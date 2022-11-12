const Town = require("./Town");

class Bodyguard extends Town{
    constructor(){
        super(
            "Bodyguard",
            "Protective",
            6,
            "assets/roles/bodyguard.png",
            "An ex-soldier who secretly makes a living by selling protection",
            2,
            0,
            "Protect",
            ["Protect a player from direct attacks at night."],
            ["If your target is directly attacked or is the victim of a harmful visit, you and the visitor will fight.",
            "If you successfully protect someone you can still be Healed."]
        )
    }
}
module.exports = Bodyguard;