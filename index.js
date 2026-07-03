let carDoor;
let goatDoor;
let switchDoor;
let playerDoor;
let auto = false;
let maxRounds = 100;
let doSwitch = 0;
let autoDoor = 0;
let ms = 1000;
let rounds = [];
function adv1() { roundStageTwo(1) }
function adv2() { roundStageTwo(2) }
function adv3() { roundStageTwo(3) }
const delay = seconds => new Promise(res => setTimeout(res, seconds));

async function checkautopts(autoCheckBox) {
    if (autoCheckBox.checked) {
        document.querySelector("#autoOpts").style.display = "block";
    } else {
        document.querySelector("#autoOpts").style.display = "none";
    }
}

async function begin(form) {
    auto = form.elements.auto.checked;
    maxRounds = form.elements.maxrounds.value;
    ms = form.elements.seconds.value;
    if (form.elements.alwaysstay.checked) doSwitch = 0;
    if (form.elements.alwaysswitch.checked) doSwitch = 1;
    if (form.elements.random.checked) doSwitch = 2;
    if (form.elements.d1.checked) autoDoor = 1;
    if (form.elements.d2.checked) autoDoor = 2;
    if (form.elements.d3.checked) autoDoor = 3;
    if (form.elements.drandom.checked) autoDoor = 0;
    if (maxRounds == "") {
        maxRounds = 100;
    } else {
        maxRounds = parseInt(maxRounds, 10)
    }
    if (ms == "") {
        ms = 500;
    } else {
        ms = parseInt(ms, 10) * 1000;
    }
    initRound();
}

async function initRound() {
    document.querySelector("#startview").style.display = "none";
    document.querySelector("h1").innerHTML = `Monty Hall Problem Simulator Round <span id="roundnumber"></span>`
    document.querySelector("#doorview").style.display = "block";
    document.querySelector("#roundnumber").innerHTML = `${rounds.length + 1}`
    document.querySelector(`#door1 > .door-front`).style.transform = "";
    document.querySelector(`#door2 > .door-front`).style.transform = "";
    document.querySelector(`#door3 > .door-front`).style.transform = "";
    carDoor = Math.floor(Math.random() * 3) + 1;
    let p = document.querySelector("#prompt");
    p.innerHTML = "";
    const div = document.createElement("div");
    div.appendChild(document.createTextNode("> Select a door."));
    p.appendChild(div);
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
    if (!auto) {
        document.querySelector("#door1").removeEventListener("mousedown", adv1);
        document.querySelector("#door2").removeEventListener("mousedown", adv2);
        document.querySelector("#door3").removeEventListener("mousedown", adv3);
    }
    playerDoor = door;
    let p = document.querySelector("#prompt");
    let goatDoorId = 1;
    if (playerDoor == carDoor) {
        goatDoorId = Math.floor(Math.random() * 2) + 1
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
    const div = document.createElement("div");
    div.appendChild(
        document.createTextNode(
            `> The host opens door ${goatDoor}, to reveal a goat. He asks if you wish to switch from your current door (door ${playerDoor}) to door ${switchDoor}.`
        )
    );
    // Goat image under public domain from https://commons.wikimedia.org/wiki/File:Goat_cartoon_04.svg. Attribution given but not required.
    document.querySelector(`#door${goatDoor} > .door-back > img`).setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/f/f5/Goat_cartoon_04.svg")
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
    if (!auto) {
        document.querySelector("#yes").addEventListener("mousedown", () => { roundStageThree(true, door) });
        document.querySelector("#no").addEventListener("mousedown", () => { roundStageThree(false, door) });
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
    if (!auto) {
        document.querySelector("#yes").remove();
        document.querySelector("#no").remove();
    }
    let door;
    if (switched) { door = switchDoor; } else { door = playerDoor; }
    let p = document.querySelector("#prompt");
    const div = document.createElement("div");
    if (door == carDoor) {
        rounds.push({ "gotcar": true, "switched": switched, "pDoor": pDoor });
        div.appendChild(document.createTextNode(`> The judge opens door ${door} to reveal a stupid car!`));
        // Car image under public domain from  https://commons.wikimedia.org/wiki/File:Sedan-car.svg. Attribution given but not required.
        document.querySelector(`#door${door} > .door-back > img`).setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/4/43/Sedan-car.svg");
    } else {
        rounds.push({ "gotcar": false, "switched": switched, "pDoor": pDoor });
        div.appendChild(document.createTextNode(`> The judge opens door ${door} to reveal your beautiful new pet goat!`));
        document.querySelector(`#door${door} > .door-back > img`).setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/f/f5/Goat_cartoon_04.svg");
    }
    document.querySelector(`#door${door} > .door-front`).style.transform = "rotateY(-160deg)";
    if (!auto) {
        if (rounds.length < maxRounds) {
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
    p.appendChild(div);
    if (!auto) {
        if (rounds.length < maxRounds) {
            document.querySelector("#newround").addEventListener("mousedown", initRound);
        }
        document.querySelector("#seeresults").addEventListener("mousedown", seeResults);
    } else {
        if (ms > 0) {
            await delay(ms);
        }
        if (rounds.length >= maxRounds) {
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
    document.querySelector("h1").innerHTML = "Monty Hall Problem Simulator Results"
    document.querySelector("#resultview").style.display = "block";
    let goats = 0;
    for (let i = 0; i < rounds.length; i++) {
        let round = rounds[i];
        const row = document.createElement("tr");
        {
            let data = document.createElement("td");
            data.innerText = i+1;
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
            goats++;
        }
        if (round.switched) {
            let data = document.createElement("td");
            data.innerText = "Yes";
            row.appendChild(data);
        } else {
            let data = document.createElement("td");
            data.innerText = "No";
            row.appendChild(data);
        }
        {
            let data = document.createElement("td");
            data.innerText = round.pDoor;
            row.appendChild(data);
        }
        document.querySelector("#results > tbody").appendChild(row);
    };
    let pc = document.createElement("span");
    pc.innerText = `You got the goat ${Math.round((goats / rounds.length) * 100)}% of the time.`;
    document.querySelector("#resultview").appendChild(pc);
}

checkautopts(document.querySelector("#auto"));