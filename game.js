const state = {
  name: "Jax Veyr",
  background: "Street Runner",
  implant: "Clean Body",
  credits: 80,
  threat: "Low",
  health: 100,
  humanity: 100,
  hasMap: false
};

const createScreenEl = document.getElementById("createScreen");
const gameScreenEl = document.getElementById("gameScreen");
const startGameButtonEl = document.getElementById("startGameButton");

const characterNameEl = document.getElementById("characterName");
const backgroundEl = document.getElementById("background");
const implantEl = document.getElementById("implant");

const playerNameEl = document.getElementById("playerName");
const creditsEl = document.getElementById("credits");
const threatEl = document.getElementById("threat");
const healthTextEl = document.getElementById("healthText");
const humanityTextEl = document.getElementById("humanityText");
const healthMeterEl = document.getElementById("healthMeter");
const humanityMeterEl = document.getElementById("humanityMeter");
const sceneTitleEl = document.getElementById("sceneTitle");
const sceneDescEl = document.getElementById("sceneDesc");
const logEl = document.getElementById("log");

function getBackgroundLabel(value) {
  if (value === "street-runner") return "Street Runner";
  if (value === "ex-security") return "Ex-Security";
  if (value === "clinic-debt") return "Clinic Debt";
  if (value === "data-rat") return "Data Rat";
  return "Street Runner";
}

function getImplantLabel(value) {
  if (value === "clean") return "Clean Body";
  if (value === "old-optic") return "Old Optic";
  if (value === "nerve-splint") return "Nerve Splint";
  if (value === "black-market-core") return "Black-Market Core";
  return "Clean Body";
}

function updateUI() {
  playerNameEl.textContent = state.name;
  creditsEl.textContent = state.credits;
  threatEl.textContent = state.threat;

  healthTextEl.textContent = state.health + "%";
  humanityTextEl.textContent = state.humanity + "%";

  healthMeterEl.value = state.health;
  humanityMeterEl.value = state.humanity;
}

function addLog(message) {
  const p = document.createElement("p");
  p.innerHTML = message;
  logEl.appendChild(p);
  logEl.scrollTop = logEl.scrollHeight;
}

function setScene(title, description) {
  sceneTitleEl.textContent = title;
  sceneDescEl.textContent = description;
}

function changeHealth(amount) {
  state.health += amount;

  if (state.health > 100) state.health = 100;
  if (state.health < 0) state.health = 0;
}

function changeHumanity(amount) {
  state.humanity += amount;

  if (state.humanity > 100) state.humanity = 100;
  if (state.humanity < 0) state.humanity = 0;
}

function startGame() {
  state.name = characterNameEl.value.trim() || "Unnamed Citizen";
  state.background = getBackgroundLabel(backgroundEl.value);
  state.implant = getImplantLabel(implantEl.value);

  state.credits = 80;
  state.threat = "Low";
  state.health = 100;
  state.humanity = 100;
  state.hasMap = false;

  if (backgroundEl.value === "street-runner") {
    state.credits += 20;
  }

  if (backgroundEl.value === "ex-security") {
    state.credits += 40;
    state.threat = "Medium";
  }

  if (backgroundEl.value === "clinic-debt") {
    state.credits -= 20;
    state.humanity -= 10;
  }

  if (backgroundEl.value === "data-rat") {
    state.credits += 10;
    state.hasMap = true;
  }

  if (implantEl.value === "old-optic") {
    state.humanity -= 6;
  }

  if (implantEl.value === "nerve-splint") {
    state.humanity -= 9;
  }

  if (implantEl.value === "black-market-core") {
    state.credits += 70;
    state.humanity -= 18;
    state.threat = "Medium";
  }

  createScreenEl.style.display = "none";
  gameScreenEl.style.display = "grid";

  logEl.innerHTML = "";
  addLog("<strong>SYSTEM:</strong> Neural link unstable.");
  addLog("<strong>PROFILE:</strong> " + state.name + ". " + state.background + ". " + state.implant + ".");
  addLog("<strong>MESSAGE:</strong> One unread contract offer waits on your wrist-com.");

  if (state.humanity < 100) {
    addLog("<span class='warning'>Implant load detected. Humanity reduced.</span>");
  }

  updateUI();
}

function handleAction(action) {
  if (action === "message") {
    state.threat = "Medium";

    setScene(
      "Contract Offer",
      "No sender ID. No corporate seal. Just coordinates, a payout, and bad timing."
    );

    addLog("<strong>CONTRACT:</strong> Retrieve a stolen data shard from the Black Circuit Market.");
    addLog("<strong>PAYMENT:</strong> <em>120 credits</em> on delivery.");
    addLog("<span class='warning'>Risk unlisted.</span>");
  }

  if (action === "scan") {
    if (!state.hasMap) {
      state.hasMap = true;
      addLog("<strong>SCAN:</strong> You find an old sector map cached inside the wall system.");
      addLog("<strong>ITEM:</strong> Sector Map Fragment acquired.");
    } else {
      addLog("<strong>SCAN:</strong> Nothing new. Bad wiring. Unpaid rent notices. Same old cage.");
    }
  }

  if (action === "clinic") {
    if (state.credits >= 35 && state.health < 100) {
      state.credits -= 35;
      changeHealth(35);

      setScene(
        "Chrome Clinic",
        "Red-white light. Clean knives. Dirty money. The smell of burned nerves."
      );

      addLog("<strong>CLINIC:</strong> Wounds patched. 35 credits deducted.");
    } else if (state.health >= 100) {
      setScene(
        "Chrome Clinic",
        "The clinic hums behind smoked glass. Everybody comes here eventually."
      );

      addLog("<strong>CLINIC:</strong> You are already patched up.");
    } else {
      addLog("<strong>CLINIC:</strong> Not enough credits.");
    }
  }

  if (action === "outside") {
    setScene(
      "Prima One",
      "The lunar megacity hangs in black space. Below, Earth is a bruised blue memory."
    );

    addLog("You look out through dirty glass. Prima One burns in layers of neon, debt, and steel.");
  }

  updateUI();
}

startGameButtonEl.addEventListener("click", startGame);

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    handleAction(button.dataset.action);
  });
});
