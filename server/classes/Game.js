const roles = require("./RoleManager");
const Global = require("./Global");
class Game {
    constructor(players, rolelist) {
        Global.rolelist = rolelist;
        Global.deadPlayers = [];
        Global.players = players;
        this.countDays = 1;
    }
    start() {
        Global.players.forEach(socket => {
            socket.removeAllListeners();
            this.#addEvents(socket);
        });
        this.#addNumbers();
        this.#random_roles();
        io.emit("start", Global.rolelist);

        Global.players.forEach((p) => {
            var attack, defense;
            switch (p.role.defense) {
                case 0: defense = "None"; break;
                case 1: defense = "Basic"; break;
                case 2: defense = "Powerful"; break;
                case 3: defense = "Invincible"; break;
            }
            switch (p.role.attack) {
                case 0: attack = "None"; break;
                case 1: attack = "Basic"; break;
                case 2: attack = "Powerful"; break;
                case 3: attack = "Unstoppable"; break;
            }
            p.emit("rolecard",
                p.nick, p.role.name, p.role.color, attack, defense, p.role.aligment, p.role.aligment_type, p.role.goal, p.role.abilities, p.role.attributes)
        })
        this.#startFirstDay();
    }
    #addEvents(socket) {
        socket.on("game_message", (msg) => {
            this.#playerMsg(msg, socket);
        })
    }
    #random_number(numbers) {
        let number = Math.floor(Math.random() * numbers.length);
        let n = numbers[number];
        numbers.splice(number, 1);
        return n;
    }
    #addNumbers() {
        let numbers = [];
        for (var i = 1; i <= Global.players.length; i++) {
            numbers.push(i);
        }
        Global.players.forEach((p) => {
            p.number = this.#random_number(numbers);
        })
        Global.players.sort(function (a, b) { return a.number - b.number });
        Global.alivePlayers = [...Global.players]
    }
    #random_roles() {
        let hiddenRolelist = [...Global.rolelist]
        Global.players.forEach((p) => {
            let index = Math.floor(Math.random() * hiddenRolelist.length);
            p.role = hiddenRolelist[index];
            hiddenRolelist.splice(index, 1);
        })
    }
    #playerMsg(msg, player) {
        msg = msg.replaceAll("<", "≤");
        Array.from(player.rooms).forEach((r) => {
            if(player.deadDay && r == 'deadChat'){
                player.to("deadChat").emit("msg", msg, player.number, player.nick);
            }
            else{
                player.to(r).emit("msg", msg, player.number, player.nick);
            }
        })
    }



    /* TIMER */
    #runTimer(time, nextPhase, stage) {
        let max = time;
        io.emit("clear")
        io.emit('servermsg', `<span style="font-weight: bolder">${stage} ${this.countDays}</span>`, "black", "c4c4c4")
        io.emit('newStage', time, stage, this.countDays)
        let int = setInterval(() => {
            io.emit("updateClock",time,max)
            time--;
            if (time < 0) {
                nextPhase();
                clearInterval(int);
            }
        }, 1000)
    }

    #startFirstDay() {
        Global.alivePlayers.forEach((p) => {
            p.role.showDayList(p);
            p.leaveAll();
            p.join("dayChat");
        })
        this.#runTimer(2, this.#startNightPhase.bind(this), "Day");
    }
    #startNightPhase() {
        Global.players.forEach(p=>{
            p.leave("dayChat");
        })
        Global.alivePlayers.forEach((p) => {
            p.role.showNightList(p);
            p.on("selectTarget", (n, btn) => {
                if (btn == 1) {
                    p.role.targets[0] = n;
                }
                else {
                    p.role.targets[1] = n;
                }
                p.emit('servermsg', p.role.getActionMsg(p), "white", "black");
            })
        })
        this.#runTimer(10, this.#startSummaryPhase.bind(this), "Night");
    }
    #startSummaryPhase() {
        Global.visits = [];
        this.countDays++;
        let pList = [...Global.alivePlayers];

        pList.sort(function (a, b) { return a.role.priority - b.role.priority })
        pList.forEach((p) => {
            p.removeAllListeners("selectTarget")
            p.role.useAbility(p)
        })

        pList.sort(function (a, b) { return b.role.priority - a.role.priority })
        pList.forEach((p) => {
            p.role.checkAbility(p);
            p.role.targets = [0, 0]
            p.role.performAction = false;
        })

        Global.players.forEach((p) => {
            p.role.showDayList(p);
        })

        let timer = 12;
        let max = timer*Global.killed.length
        let visibleTimer = max;
        setTimeout(() => {
            io.emit("clear")
            io.emit('servermsg', `<span style="font-weight: bolder">Day ${this.countDays}</span>`, "black", "c4c4c4")
            io.emit('newStage', max, "Day", this.countDays)
            if (Global.killed.length > 0) {
                let int = setInterval(() => {
                    io.emit("updateClock",visibleTimer,max)
                    if (timer == 12) {
                        io.emit("center_msg", `<div class="number_icon">${Global.killed[0].player.number}</div><span style="color: white">${Global.killed[0].player.nick}</span>&nbsp died last night`);
                        io.emit('servermsg', `<div class="number_icon">${Global.killed[0].player.number}</div><span style="color: white">${Global.killed[0].player.nick}</span>&nbsp died last night`, "white", "red")
                    }
                    else if (timer == 8) {
                        io.emit("center_msg", `${Global.killed[0].reason} ${Global.killed[0].reasonImg}`);
                        io.emit('servermsg', Global.killed[0].reason, "#fcc746", "black")
                    }
                    else if (timer == 4) {
                        io.emit("center_msg", `<div class="number_icon">${Global.killed[0].player.number}</div><span style="color: white">${Global.killed[0].player.nick}</span>'s
                        role was &nbsp;<span style="color: ${Global.killed[0].player.role.color}">
                        ${Global.killed[0].player.role.name}</span>
                        <img class="center_img" src="${Global.killed[0].player.role.img}">`);
                        io.emit("servermsg", `<div class="number_icon">${Global.killed[0].player.number}</div><span style="color: white">${Global.killed[0].player.nick}</span>'s role was &nbsp;<span style="color: ${Global.killed[0].player.role.color}">${Global.killed[0].player.role.name}</span>`, "white", "black")

                    }
                    else if (timer <= 0) {
                        io.emit("center_msg", "")
                        let g = Global.killed.shift();
                        let reason = g.reason;
                        let player = g.player;
                        player.deadDay = this.countDays--;
                        Global.deadPlayers.push(player);
                        player.join("deadChat");
                        Global.alivePlayers = Global.alivePlayers.filter(a => a.number != player.number);
                        this.showGraveyard(reason)
                        Global.players.forEach((p) => {
                            p.role.showDayList(p);
                        })
                        if (Global.killed.length <= 0) {
                            clearInterval(int);
                            this.#runTimer(10, this.#startDiscussionPhase.bind(this), "Day");
                            return;
                        }
                        timer = 13;
                    }
                    timer--;
                    visibleTimer--;
                }, 1000)
            }
            else {
                setTimeout(() => {
                    this.#startDiscussionPhase()
                }, 1000);
            }
        }, 4000)
    }

    #startDiscussionPhase() {
        let time = 10;
        let max = time;
        io.emit('newStage', time, "Day", this.countDays)
        Global.players.forEach(p => {
            p.join("dayChat");
        })
        let int = setInterval(() => {
            io.emit("updateClock",time,max)
            time--;
            if (time < 0) {
                setTimeout(() => {
                    this.#startNightPhase();
                }, 2000);
                clearInterval(int);
            }
        }, 1000)
    }
    showGraveyard(killer) {
        let playersList = [];
        Global.deadPlayers.forEach(p => {
            playersList.push({ number: p.number, nick: p.nick, day: p.deadDay, role: p.role.name, color: p.role.color,killer: killer});
        })
        io.emit('graveyard', playersList)
    }
    /*
    #startVotingPhase(){
        this.time = 30;
    }
    #startTrailDefensePhase(){
        this.time = 20;
    }
    #startTrailVotingPhase(){
        this.currentTrial++;
        this.time = 15;
        //IFIFIF
    }
    */

}
module.exports = Game;