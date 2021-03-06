window.addEventListener("load", function(){
const sock = io();

sock.on("lobby_players",(tab)=>{
    var ul = document.querySelector('#lobby_players_ul');
    ul.innerHTML= "";
    tab.forEach(e => {
        var li = document.createElement("li");
        li.innerHTML = e;
        ul.appendChild(li);
    });
    document.querySelector("#countPlayers").innerHTML = "Players in lobby: "+tab.length;
})
sock.on("l_servermsg",(msg,color,colorBG)=>{
    var chat = document.querySelector("#chat_lobby_div");
    let div = document.createElement('div');
    div.classList.add("lobby_msg");
    div.style.color = color;
    if(colorBG!="none"){
        div.style.backgroundColor = colorBG;
    }
    div.innerHTML = msg;
    chat.appendChild(div);
})
sock.on("rolelist",(tab)=>{
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
        li.addEventListener("click",()=>{
            h1.innerHTML = e.name;
            h1.style.color = e.color;
            desc.innerHTML = e.desc;
        })
        img.addEventListener("click",()=>{
            const index = [...ul.childNodes].findIndex(e => e === img.parentNode)
            sock.emit("removeRole",index)
        })
    });
    document.querySelector("#countRoles").innerHTML = "Selected Roles: "+tab.length;
})
document.querySelector("#select_name_submit").addEventListener("click",(e)=>{
    e.preventDefault();
    let input = document.querySelector("#select_name_input");
    if(input.value.trim()!=""){
        sock.emit("nick",input.value);
    }
    input.value = "";
})
document.querySelector('#lobby_chat_form').addEventListener('submit',(e)=>{
    e.preventDefault();
    const input = document.querySelector('#lobby_chat_input')
    const msg = input.value;
    input.value = "";
    if(msg.trim()!=""){
        sock.emit('lobby_message',msg)
    }
})
sock.on("lobby_msg",(msg,nick)=>{
    let chat = document.querySelector("#chat_lobby_div");
    let div = document.createElement('div');
    div.classList.add("lobby_msg");
    div.innerHTML = `<span>${nick}: </span>${msg}`;
    chat.appendChild(div);
})
document.querySelector('#host_btn').addEventListener("click",()=>{
    document.querySelector('#host_controls').style.display = "block";
})
document.querySelector('#close_controls').addEventListener("click",()=>{
    document.querySelector('#host_controls').style.display = "none";
});
document.querySelector("#start_btn").addEventListener("click",()=>{
    sock.emit("start");
})
openAndhideTabs("town_btn")
openAndhideTabs("mafia_btn")
openAndhideTabs("coven_btn")
openAndhideTabs("neutral_btn")
openAndhideTabs("random_btn")

function openAndhideTabs(id){
    let btn = document.getElementById(id);
    btn.addEventListener("click",()=>{
        let nextNode = btn.nextElementSibling;
        if(nextNode.style.display === "block"){
            nextNode.style.display = "none";
        }
        else{
            nextNode.style.display = "block";
        }
    })
}
var roles = document.querySelector('#host_controls').querySelectorAll("li")
roles.forEach((e)=>{
    e.addEventListener("click",()=>{
        sock.emit("addRole",e.textContent)
    })
})
sock.on("rolelist",(tab)=>{
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
        li.addEventListener("click",()=>{
            h1.innerHTML = e.name;
            h1.style.color = e.color;
            desc.innerHTML = e.desc;
        })
        img.addEventListener("click",()=>{
            const index = [...ul.childNodes].findIndex(e => e === img.parentNode)
            sock.emit("removeRole",index)
        })
    });
    document.querySelector("#countRoles").innerHTML = "Selected Roles: "+tab.length;
})

//---------GAME---------//
sock.on("start",(rolelist)=>{
    document.querySelector("#game").style.display = "block";
    document.querySelector("#lobby").outerHTML = "";
    var ul = document.querySelector("#rolelist").querySelector("ul");
    rolelist.forEach((r)=>{
        li = document.createElement("li");
        li.innerHTML= r.name;
        li.style.color = r.color
        ul.appendChild(li);
    })
    //showPlayersList("All Live Townies",players)
})
sock.on("rolecard",(nick,title,color,attack,defense,aligment,aligment_type,goal,abilities,attributes)=>{
    document.querySelector("#nick").innerHTML = nick;
    const card = document.querySelector("#role_card");
    var h1 = card.querySelector("h1");
    h1.innerHTML = title;
    h1.style.color = color;
    card.querySelector("#attack_text").innerHTML = attack;
    card.querySelector("#defense_text").innerHTML = defense;
    card.querySelector("#aligment_type").innerHTML = `<span style="color:${color}">${aligment}</span> <span style="color:#49A9D0">${aligment_type}</span>`;
    card.querySelector("#goal_div").innerHTML = goal;
    var ab_ul = card.querySelector("#abili_div");
    abilities.forEach((a)=>{
        let li = document.createElement("li");
        li.innerHTML = a;
        ab_ul.appendChild(li);
    })
    var at_ul = card.querySelector("#atri_div");
    attributes.forEach((a)=>{
        let li = document.createElement("li");
        li.innerHTML = a;
        at_ul.appendChild(li);
    })
})
document.querySelector('#game_chat_form').addEventListener('submit',(e)=>{
    e.preventDefault();
    const input = document.querySelector('#chat_game_input')
    const msg = input.value;
    input.value = "";
    if(msg.trim()!=""){
        sock.emit('game_message',msg)
    }
})
sock.on("msg",(msg,number,nick)=>{
    let chat = document.querySelector("#chat_game_div");
    let div = document.createElement('div');
    div.classList.add("msg");
    div.innerHTML = `<div class="cloud_icon">${number}</div><div class="player_nick">${nick}</div>: <span class="message">${msg}</span>`;
    chat.appendChild(div);
})
sock.on("newStage",(time,day,count)=>{
    document.querySelector('#date').innerHTML = `${day} <span class="white">${count}</span>`;
    var bar = document.querySelector("#loading_bar").style;
    bar.backgroundColor = (day=="Night"?"1a4b93":"b79f35");
    var maxValue = time;
    let int = this.setInterval(()=>{
        bar.width = `${(time/maxValue*100)}%`;
        document.querySelector('#time').textContent = time;
        time--;
        if(time<0){
            this.clearInterval(int);
        }
    },1000);
})
sock.on("servermsg",(msg,color,colorBG)=>{
    var chat = document.querySelector("#chat_game_div");
    let div = document.createElement('div');
    div.classList.add("lobby_msg");
    div.style.color = color;
    if(colorBG!="none"){
        div.style.backgroundColor = colorBG;
    }
    div.innerHTML = msg;
    chat.appendChild(div);
})
sock.on("clear",()=>{
    document.querySelector("#chat_game_div").innerHTML = "";
})
var players = [];
var targets = [];
document.querySelector("#players_tab").addEventListener("click",()=>{
    showPlayersList("All Live Townies",players)
});
document.querySelector("#targets_tab").addEventListener("click",()=>{
    showPlayersList("Targets",targets)
});
function showPlayersList(title,tab){
    const block = document.querySelector("#players_list");
    block.querySelector("h1").innerHTML = title;
    var ul = block.querySelector("#players_ul");
    ul.innerHTML = "";
    if(tab!=null){
        tab.forEach((p)=>{
            var li = document.createElement("li");
            let msg = `<div class="number_icon">${p.number}</div>`
            if(p.special != null){
                p.special.forEach((s)=>{
                    msg+=`<img src="${s}" class="special_icon">`;
                })
            }
            msg+=`${p.nick}   `;
            if(p.role!=null){
                msg+=`<span style="color:${p.color}">(${p.role})</span>`
            }
            if(p.img!=null){
                msg+=`<div class="action_button"><img src="${p.img}"><div class="action_text">${p.ability}</div></div>`
            }
            li.innerHTML = msg;
            ul.appendChild(li);
        })
        var btns = document.querySelectorAll(".action_button");
        btns.forEach((b)=>{
            b.addEventListener("click",()=>{
                sock.emit("selectTarget",b.parentNode.querySelector(".number_icon").textContent);
            })
        })
    }
}
sock.on("playerslist",(p,t)=>{
    players = p;
    targets = t;
    showPlayersList("All Live Townies",players)
})
});
