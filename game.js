const state = {
  credits: 80,
  threat: "Low",
  health: 100,
  humanity: 100,
  hasMap: false
};

const creditsEl = document.getElementById("credits");
const threatEl = document.getElementById("threat");
const healthTextEl = document.getElementById("healthText");
const humanityTextEl = document.getElementById("humanityText");
const healthMeterEl = document.getElementById("healthMeter");
const humanityMeterEl = document.getElementById("humanityMeter");
const sceneTitleEl = document.getElementById("sceneTitle");
const sceneDescEl = document.getElementById("sceneDesc");
const logEl = document.getElementById("log");

function updateUI() {
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

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    handleAction(button.dataset.action);
  });
});

updateUI();
