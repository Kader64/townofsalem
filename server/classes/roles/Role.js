class Role{
    constructor(name, aligment, aligment_type, color, limit, img, desc, attack, defense, actionName, goal, abilities, attributes){
        this.name = name;
        this.aligment = aligment;
        this.aligment_type = aligment_type;
        this.color = color;
        this.limit = limit;
        this.img = img;
        this.desc = desc;
        this.attack = attack;
        this.defense = defense;
        this.actionName = actionName;
        this.goal = goal;
        this.abilities = abilities;
        this.attributes = attributes;
    }
}
module.exports = Role;