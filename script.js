let tickets = [];
let originalTickets = [];
let currentRotation = 0;

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");

function parseTickets() {
    const lines = document.getElementById("names").value.trim().split("\n");
    tickets = [];

    lines.forEach(line => {
        const [name, weightText] = line.split(",").map(x => x.trim());
        const weight = Math.max(1, parseInt(weightText || "1"));

        for (let i = 0; i < weight; i++) {
            tickets.push(name);
        }
    });

    shuffle(tickets);
    originalTickets = [...tickets];
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function drawWheel() {
    ctx.clearRect(0, 0, 500, 500);

    if (!tickets.length) return;

    const angle = (2 * Math.PI) / tickets.length;

    tickets.forEach((name, i) => {
        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 220, i * angle, (i + 1) * angle);

        ctx.fillStyle = `hsl(${i * 360 / tickets.length}, 70%, 70%)`;
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(i * angle + angle / 2);

        ctx.fillStyle = "black";
        ctx.font = "18px Arial";
        ctx.fillText(name, 120, 5);

        ctx.restore();
    });
}

function loadWheel() {
    parseTickets();
    drawWheel();

    currentRotation = 0;
    canvas.style.transform = "rotate(0deg)";

    document.getElementById("result").innerText = "🏆 SELECTED: -";
    spinBtn.disabled = false;
}

function spinWheel() {
    if (!tickets.length) {
        alert("All names selected!");
        spinBtn.disabled = true;
        return;
    }

    spinBtn.disabled = true;

    const selected = tickets.shift();

    currentRotation += 1800;

    playTick();

    canvas.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        document.getElementById("result").innerText =
            "🏆 SELECTED: " + selected + " 🎉";

        drawWheel();

        if (tickets.length > 0) {
            spinBtn.disabled = false;
        }
    }, 4000);
}

function resetWheel() {
    tickets = [...originalTickets];
    shuffle(tickets);

    drawWheel();

    currentRotation = 0;
    canvas.style.transform = "rotate(0deg)";

    document.getElementById("result").innerText = "🏆 SELECTED: -";
    spinBtn.disabled = false;
}

function playTick() {
    const audio = new AudioContext();
    const osc = audio.createOscillator();
    const gain = audio.createGain();

    osc.connect(gain);
    gain.connect(audio.destination);

    osc.frequency.value = 800;
    gain.gain.value = 0.1;

    osc.start();
    osc.stop(audio.currentTime + 0.08);
}

document.addEventListener("keydown", function(event) {

    // if SPACEBAR pressed
    if (event.code === "Space") {

        // stop page scrolling
        event.preventDefault();

        // only spin if button enabled
        if (!spinBtn.disabled) {
            spinWheel();
        }
    }
});