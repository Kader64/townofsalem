sock.on("start", () => {
    sock.removeAllListeners()

    sock.on("servermsg", (msg, color, colorBG) => {
        var chat = document.querySelector("#chat_game_div");
        let div = document.createElement('div');
        div.classList.add("lobby_msg");
        div.style.color = color;
        if (colorBG != "none") {
            div.style.backgroundColor = colorBG;
        }
        div.innerHTML = msg;
        chat.appendChild(div);
    })
    
    sock.on("msg", (msg, number, nick) => {
        let chat = document.querySelector("#chat_game_div");
        let div = document.createElement('div');
        div.classList.add("msg");
        div.innerHTML = `<div class="cloud_icon">${number}</div><div class="player_nick">${nick}</div>: <span class="message">${msg}</span>`;
        chat.appendChild(div);
    })

    document.querySelector("#game").style.display = "block";
    document.querySelector("#lobby").outerHTML = "";

    // var ul = document.querySelector("#rolelist").querySelector("ul");
    // rolelist.forEach((r) => {
    //     li = document.createElement("li");
    //     li.innerHTML = r.name;
    //     li.style.color = r.color
    //     ul.appendChild(li);
    // })
})
