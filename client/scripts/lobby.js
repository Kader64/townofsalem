const sock = io();

sock.on("lobby_players", (tab) => {
    let ul = document.querySelector('#lobby_players_ul');
    ul.innerHTML = "";
    tab.forEach(e => {
        let li = document.createElement("li");
        li.innerHTML = e;
        ul.appendChild(li);
    });
    document.querySelector("#countPlayers").innerHTML = "Players in lobby: " + tab.length;
})

sock.on("servermsg", (msg, color, colorBG) => {
    let chat = document.querySelector("#chat_lobby_div");
    let div = document.createElement('div');
    div.classList.add("lobby_msg");
    div.style.color = color;
    if (colorBG != "none") {
        div.style.backgroundColor = colorBG;
    }
    div.innerHTML = msg;
    chat.appendChild(div);
})

sock.on("msg", (msg, nick) => {
    let chat = document.querySelector("#chat_lobby_div");
    let div = document.createElement('div');
    div.classList.add("lobby_msg");
    div.innerHTML = `<span>${nick}: </span>${msg}`;
    chat.appendChild(div);
})

sock.on("rolelist", (tab) => {
    var ul = document.querySelector("#lobby_rolelist").querySelector("ul");
    ul.innerHTML = "";
    tab.forEach(e => {
        var li = document.createElement("li");
        li.innerHTML = `<img class="role_icon" src="${e.img}"><span class="role_name">${e.name}</span>`;
        li.style.color = e.color;
        var img = document.createElement("img");
        img.src = "assets/close.png";
        img.classList.add("role_icon");
        li.prepend(img)
        ul.appendChild(li);
        var h1 = document.querySelector("#lobby_role_desc");
        var desc = document.querySelector("#desc");
        li.addEventListener("click", () => {
            h1.innerHTML = e.name;
            h1.style.color = e.color;
            desc.innerHTML = e.desc;
        })
        img.addEventListener("click", () => {
            const index = [...ul.childNodes].findIndex(e => e === img.parentNode)
            sock.emit("removeRole", index)
        })
    });
    document.querySelector("#countRoles").innerHTML = "Selected Roles: " + tab.length;
})


// ----------------- EVENTS ---------------------//

document.querySelector("#select_name_submit").addEventListener("click", (e) => {
    e.preventDefault();
    let input = document.querySelector("#select_name_input");
    if (input.value.trim() != "") {
        sock.emit("nick", input.value);
    }
    input.value = "";
})

document.querySelector('#lobby_chat_form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.querySelector('#lobby_chat_input')
    const msg = input.value;
    input.value = "";
    if (msg.trim() != "") {
        sock.emit('msg', msg)
    }
})

document.querySelector('#host_btn').addEventListener("click", () => {
    document.querySelector('#host_controls').style.display = "block";
})
document.querySelector('#close_controls').addEventListener("click", () => {
    document.querySelector('#host_controls').style.display = "none";
});
document.querySelector("#start_btn").addEventListener("click", () => {
    sock.emit("start");
})

const openAndhideTabs = (id) => {
    let btn = document.getElementById(id);
    btn.addEventListener("click", () => {
        let nextNode = btn.nextElementSibling;
        if (nextNode.style.display === "block") {
            nextNode.style.display = "none";
        }
        else {
            nextNode.style.display = "block";
        }
    })
}

openAndhideTabs("town_btn")
openAndhideTabs("mafia_btn")
openAndhideTabs("coven_btn")
openAndhideTabs("neutral_btn")
openAndhideTabs("random_btn")

let roles = document.querySelector('#host_controls').querySelectorAll("li")
roles.forEach((e,id) => {
    e.addEventListener("click", () => {
        sock.emit("addRole", id)
    })
})