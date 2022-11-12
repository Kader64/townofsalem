const Role = require("../Role")

class Town extends Role{
    constructor(name, aligment_type, limit, img, desc, attack, defense, actionName, abilities, attributes){
        super(
            name,
            "Town",
            aligment_type,
            "#7fff00",
            limit,
            img,
            desc,
            attack,
            defense,
            actionName,
            "Lynch every criminal and evildoer.",
            abilities,
            attributes)
    }
}

module.exports = Town;