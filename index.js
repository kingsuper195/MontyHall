let carDoor;
let goatDoor;
let switchDoor;
let playerDoor;
let auto = false;
let rounds = 100;
let doSwitch = 0;
let autoDoor = 0;
let ms = 1000;
let cancel = false;
let roundsLog = [];
function adv1() { roundStageTwo(1); }
function adv2() { roundStageTwo(2); }
function adv3() { roundStageTwo(3); }
const delay = seconds => new Promise(res => setTimeout(res, seconds));

async function resetSetup() {
    document.querySelector("#startview").style.display = "block";
    document.querySelector("h1").innerHTML = `Monty Hall Problem Simulator`;
    document.querySelector("#doorview").style.display = "none";
    document.querySelector("#progress").style.display = "none";
    document.querySelector("#resultview").style.display = "none";
    document.querySelector(`#door1 > .door-front`).style.transform = "";
    document.querySelector(`#door2 > .door-front`).style.transform = "";
    document.querySelector(`#door3 > .door-front`).style.transform = "";
    document.querySelector("#door1").classList.remove("playerDoor");
    document.querySelector("#door2").classList.remove("playerDoor");
    document.querySelector("#door3").classList.remove("playerDoor");
    document.querySelector("#progress").style.display = "none";
}

async function checkautopts(autoCheckBox) {
    if (autoCheckBox.checked && autoCheckBox.id == "auto") {
        document.querySelector("#autoOpts").style.display = "block";
    } else {
        document.querySelector("#autoOpts").style.display = "none";
    }
    if (autoCheckBox.checked) {
        document.querySelector("#submitstart").style.display = "inline";
    } else {
        document.querySelector("#submitstart").style.display = "none";
    }
}

async function begin(form) {
    roundsLog = [];
    auto = form.elements.auto[0].checked;
    console.log(auto);
    rounds = form.elements.maxrounds.value;
    ms = form.elements.seconds.value;
    if (form.elements.alwaysstay.checked) doSwitch = 0;
    if (form.elements.alwaysswitch.checked) doSwitch = 1;
    if (form.elements.random.checked) doSwitch = 2;
    if (form.elements.d1.checked) autoDoor = 1;
    if (form.elements.d2.checked) autoDoor = 2;
    if (form.elements.d3.checked) autoDoor = 3;
    if (form.elements.drandom.checked) autoDoor = 0;
    if (rounds == "") {
        if (auto) {
            rounds = 100;
        } else {
            rounds = Infinity;
        }
    } else {
        rounds = parseInt(rounds, 10);
    }
    if (ms == "") {
        ms = 0;
    } else {
        ms = (100 - parseFloat(ms, 10)) * 10;
    }
    document.querySelector("#startview").style.display = "none";
    cancel = false;
    initRound();
}

async function initRound() {
    if (cancel) {
        return 0;
    }
    document.querySelector("h1").innerHTML = `Monty Hall Problem Simulator Round <span id="roundnumber"></span>`;
    document.querySelector("#roundnumber").innerHTML = `${roundsLog.length + 1}`;
    let prog = document.querySelector("#progress");
    prog.style.display = "block";
    prog.setAttribute("max", rounds);
    prog.value = roundsLog.length + 1;
    if (ms > 0 || !auto) {
        document.querySelector("#doorview").style.display = "block";
        document.querySelector(`#door1 > .door-front`).style.transform = "";
        document.querySelector(`#door2 > .door-front`).style.transform = "";
        document.querySelector(`#door3 > .door-front`).style.transform = "";
        document.querySelector("#door1").classList.remove("playerDoor");
        document.querySelector("#door2").classList.remove("playerDoor");
        document.querySelector("#door3").classList.remove("playerDoor");
    }
    carDoor = Math.floor(Math.random() * 3) + 1;
    if (ms > 0 || !auto) {
        let p = document.querySelector("#prompt");
        p.innerHTML = "";
        const div = document.createElement("div");
        div.appendChild(document.createTextNode("> Select a door."));
        p.appendChild(div);
    }
    if (!auto) {
        document.querySelector("#door1").addEventListener("mousedown", adv1);
        document.querySelector("#door2").addEventListener("mousedown", adv2);
        document.querySelector("#door3").addEventListener("mousedown", adv3);
    } else {
        if (ms > 0) {
            await delay(ms);
        }
        if (autoDoor > 0) {
            roundStageTwo(autoDoor);
        } else {
            let randomDoor = Math.floor(Math.random() * 3) + 1;
            roundStageTwo(randomDoor);
        }
    }

}

async function roundStageTwo(door) {
    if (cancel) {
        return 0;
    }
    if (!auto) {
        document.querySelector("#door1").removeEventListener("mousedown", adv1);
        document.querySelector("#door2").removeEventListener("mousedown", adv2);
        document.querySelector("#door3").removeEventListener("mousedown", adv3);
    }
    playerDoor = door;
    let p;
    if (ms > 0 || !auto) {
        document.querySelector("#door" + playerDoor).classList.add("playerDoor");
        p = document.querySelector("#prompt");
    }
    let goatDoorId = 1;
    if (playerDoor == carDoor) {
        goatDoorId = Math.floor(Math.random() * 2) + 1;
    }
    let id = 0;
    for (let i = 0; i < 3; i++) {
        if (i + 1 != carDoor && i + 1 != playerDoor) {
            id++;
            if (id == goatDoorId) {
                goatDoor = i + 1;
            }
        };
    }
    for (let i = 0; i < 3; i++) {
        if (i + 1 != playerDoor && i + 1 != goatDoor) {
            switchDoor = i + 1;
        };
    }
    if (ms > 0 || !auto) {
        const div = document.createElement("div");
        div.appendChild(
            document.createTextNode(
                `> The host opens door ${goatDoor}, to reveal a goat. He asks if you wish to switch from your current door (door ${playerDoor}) to door ${switchDoor}.`
            )
        );
        // Goat image under public domain from https://commons.wikimedia.org/wiki/File:Goat_cartoon_04.svg. Attribution given but not required.
        document.querySelector(`#door${goatDoor} > .door-back > img`).setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/f/f5/Goat_cartoon_04.svg");
        document.querySelector(`#door${goatDoor} > .door-front`).style.transform = "rotateY(-160deg)";
        if (!auto) {
            let yes = document.createElement("button");
            yes.id = "yes";
            yes.innerText = "Switch";
            div.appendChild(yes);
            let no = document.createElement("button");
            no.id = "no";
            no.innerText = "Stay";
            div.appendChild(no);
        }
        p.appendChild(div);
    }
    if (!auto) {
        document.querySelector("#yes").addEventListener("mousedown", () => { roundStageThree(true, door); });
        document.querySelector("#no").addEventListener("mousedown", () => { roundStageThree(false, door); });
    } else {
        if (ms > 0) {
            await delay(ms);
        }
        if (doSwitch == 0) {
            roundStageThree(false, door);
        } else if (doSwitch == 1) {
            roundStageThree(true, door);
        } else if (doSwitch == 2) {
            roundStageThree(Math.random() < 0.5, door);
        }
    }
}

async function roundStageThree(switched, pDoor) {
    if (cancel) {
        return 0;
    }
    if (!auto) {
        document.querySelector("#yes").remove();
        document.querySelector("#no").remove();
    }
    let door;
    if (switched) { door = switchDoor; } else { door = playerDoor; }
    let p;
    let div;
    if (ms > 0 || !auto) {
        p = document.querySelector("#prompt");
        div = document.createElement("div");
    }
    if (door == carDoor) {
        roundsLog.push({ "gotcar": true, "switched": switched, "pDoor": pDoor });
        if (ms > 0 || !auto) {
            div.appendChild(document.createTextNode(`> The host opens door ${door} to reveal a stupid car!`));
            // Car image under public domain from  https://commons.wikimedia.org/wiki/File:Sedan-car.svg. Attribution given but not required.
            document.querySelector(`#door${door} > .door-back > img`).setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/4/43/Sedan-car.svg");
        }
    } else {
        roundsLog.push({ "gotcar": false, "switched": switched, "pDoor": pDoor });
        if (ms > 0 || !auto) {
            div.appendChild(document.createTextNode(`> The host opens door ${door} to reveal your beautiful new pet goat!`));
            document.querySelector(`#door${door} > .door-back > img`).setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/f/f5/Goat_cartoon_04.svg");
        }
    }
    if (ms > 0 || !auto) {
        document.querySelector(`#door${door} > .door-front`).style.transform = "rotateY(-160deg)";
    }

    if (!auto) {
        if (roundsLog.length < rounds) {
            let newRound = document.createElement("button");
            newRound.id = "newround";
            newRound.innerText = "New Round";
            div.appendChild(newRound);
        }
        let seeResultsBtn = document.createElement("button");
        seeResultsBtn.id = "seeresults";
        seeResultsBtn.innerText = "See Results";
        div.appendChild(seeResultsBtn);

    }
    if (ms > 0 || !auto) {
        p.appendChild(div);
    }
    if (!auto) {
        if (roundsLog.length < rounds) {
            document.querySelector("#newround").addEventListener("mousedown", initRound);
        }
        document.querySelector("#seeresults").addEventListener("mousedown", seeResults);
    } else {
        if (ms > 0) {
            await delay(ms);
        }
        if (roundsLog.length >= rounds) {
            seeResults();
        } else {
            setTimeout(() => {
                initRound();
            }, 0);
        }
    }
}

async function seeResults() {
    document.querySelector("#doorview").style.display = "none";
    document.querySelector("#progress").style.display = "none";
    document.querySelector("h1").innerHTML = "Monty Hall Problem Simulator Results";
    document.querySelector("#resultview").style.display = "block";
    let goatsW = 0;
    let totalW = 0;
    let goatsT = 0;
    let totalT = 0;
    for (let i = 0; i < roundsLog.length; i++) {
        let round = roundsLog[i];
        const row = document.createElement("tr");
        {
            let data = document.createElement("td");
            data.innerText = i + 1;
            row.appendChild(data);
        }
        if (round.gotcar) {
            let data = document.createElement("td");
            data.innerText = "Car";
            row.appendChild(data);
        } else {
            let data = document.createElement("td");
            data.innerText = "Goat";
            row.appendChild(data);
            if (round.switched) {
                goatsW++;
            } else {
                goatsT++;
            }
        }
        if (round.switched) {
            let data = document.createElement("td");
            data.innerText = "Yes";
            row.appendChild(data);
            totalW++;
        } else {
            let data = document.createElement("td");
            data.innerText = "No";
            row.appendChild(data);
            totalT++;
        }
        {
            let data = document.createElement("td");
            data.innerText = round.pDoor;
            row.appendChild(data);
        }
        document.querySelector("#results > tbody").appendChild(row);
    };
    document.querySelector("#totalW").innerText = totalW;
    document.querySelector("#totalT").innerText = totalT;
    document.querySelector("#goatPercentW").innerText = goatsW > 0 ? Math.round((goatsW / roundsLog.length) * 100) + "%" : "N/A";
    document.querySelector("#carPercentW").innerText = goatsW > 0 ? 100 - Math.round((goatsW / roundsLog.length) * 100) + "%" : "N/A";
    document.querySelector("#goatTimesW").innerText = goatsW > 0 ? goatsW : "N/A";
    document.querySelector("#carTimesW").innerText = goatsW > 0 ? roundsLog.length - goatsW : "N/A";
    document.querySelector("#goatPercentT").innerText = goatsT > 0 ? Math.round((goatsT / roundsLog.length) * 100) + "%" : "N/A";
    document.querySelector("#carPercentT").innerText = goatsT > 0 ? 100 - Math.round((goatsT / roundsLog.length) * 100) + "%" : "N/A";
    document.querySelector("#goatTimesT").innerText = goatsT > 0 ? goatsT : "N/A";
    document.querySelector("#carTimesT").innerText = goatsT > 0 ? roundsLog.length - goatsT : "N/A";
}

document.querySelector("#cancelButton").addEventListener("click", () => {
    cancel = true;
    resetSetup();
});

document.querySelector("#restart").addEventListener("click", () => {
    resetSetup();
});

document.querySelector("#settingsButton").addEventListener("click", () => {
    if (!auto) {
        document.querySelector("#settingsSeconds").style.display = "none";
        document.querySelector("#settingsSecondsLabel").style.display = "none";
        document.querySelector("#settingsNotAvaliable").style.display = "inline";
    }
    document.querySelector("#settingsSeconds").placeholder = (ms / 1000);
});
document.querySelector("#settingsClose").addEventListener("click", () => {
    let seconds = document.querySelector("#settingsSeconds");
    if (seconds.value != "") {
        ms = (seconds.value * 1000);
    }
});

checkautopts(document.querySelector("#auto"));