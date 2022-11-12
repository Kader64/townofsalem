const Bodyguard = require("./Roles/Town/Bodyguard");

const ALL_ROLES = [
    new Bodyguard(),



]

const getRole = (id) => {
    if(id >= 0 && id < ALL_ROLES.length){
        return ALL_ROLES[id];
    }
    return -1;
}

module.exports = { getRole }