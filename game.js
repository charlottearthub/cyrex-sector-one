const SAVE_KEY = "cyrex_sector_one_v02";

const DATA = {
  professions: {
    scavenger: { label: "Scavenger", bonus: "Scavenge runs find +1 scrap when successful." },
    courier: { label: "Courier", bonus: "Delivery jobs pay +15 credits." },
    medic: { label: "Street Medic", bonus: "Clinic visits cost less and med recipes are cheaper." },
    tech: { label: "Cybernetic Tech", bonus: "Crafting has a chance to refund 1 scrap." },
    "data-runner": { label: "Data Runner", bonus: "Scans reveal extra feed intel and reduce risk." },
    "bounty-hunter": { label: "Bounty Hunter", bonus: "Combat contracts pay +20 credits." }
  },
  affiliations: {
    mp: { label: "M&P", desc: "Unaffiliated independent. Flexible, local, no banner." },
    "free-cell": { label: "Free Cell", desc: "Anti-Towers. Illegal, self-owned, watched by the Grid." },
    "corporate-cell": { label: "Corporate Cell", desc: "Licensed by the Towers. Funded, protected, owned." }
  },
  implants: {
    clean: "Clean Body",
    "old-optic": "Old Optic",
    "nerve-splint": "Nerve Splint",
    "black-market-core": "Black-Market Core"
  },
  jobs: [
    { id: "medgel", title: "Clinic Med-Gel Delivery", type: "Delivery", difficulty: "Low", reward: 90, xp: 24, energy: 14, heat: 4, materials: { med_gel: 1 }, text: "A clinic needs med-gel moved through a locked transit corridor." },
    { id: "cores", title: "Recover Power Cores", type: "Recovery", difficulty: "Medium", reward: 140, xp: 36, energy: 22, heat: 10, materials: { power_core: 1, scrap: 2 }, text: "Black-market cores were spotted near Dock 12. Bring back what still holds a charge." },
    { id: "sweep", title: "Avoid Corporate Sweep", type: "Survival", difficulty: "Medium", reward: 110, xp: 32, energy: 18, heat: -8, materials: { access_chip: 1 }, text: "Suits are walking the lower platforms. Stay quiet and move clean." },
    { id: "bounty", title: "Street Bounty: Red Voss", type: "Combat", difficulty: "Hard", reward: 190, xp: 52, energy: 30, heat: 16, materials: { weapon_part: 1 }, text: "A fixer wants Red Voss alive. The contract does not say why." },
    { id: "grid", title: "Grid Echo Scan", type: "Data", difficulty: "Low", reward: 70, xp: 22, energy: 12, heat: 5, materials: { data_shard: 1 }, text: "Trace a ghost signal before the Grid closes the window." }
  ],
  recipes: [
    { id: "medkit", title: "Trauma Kit", requires: { med_gel: 1, scrap: 1 }, gives: { trauma_kit: 1 }, creditCost: 10 },
    { id: "weaponmod", title: "Crude Weapon Mod", requires: { weapon_part: 1, scrap: 2 }, gives: { weapon_mod: 1 }, creditCost: 25 },
    { id: "corecharger", title: "Core Charger", requires: { power_core: 1, circuit: 2, scrap: 2 }, gives: { core_charger: 1 }, creditCost: 40 },
    { id: "scrambler", title: "Grid Scrambler", requires: { data_shard: 1, access_chip: 1, circuit: 1 }, gives: { grid_scrambler: 1 }, creditCost: 35 }
  ],
  market: [
    { id: "buy-scrap", title: "Buy Scrap Alloy", cost: 12, gives: { scrap: 1 } },
    { id: "buy-circuit", title: "Buy Clean Circuit", cost: 28, gives: { circuit: 1 } },
    { id: "buy-medgel", title: "Buy Med-Gel", cost: 32, gives: { med_gel: 1 } },
    { id: "sell-scrap", title: "Sell Scrap Alloy", sell: { scrap: 1 }, reward: 7 },
    { id: "sell-datashard", title: "Sell Data Shard", sell: { data_shard: 1 }, reward: 45 }
  ],
  safehouse: [
    { id: "locker", title: "Wall Locker", cost: 60, requires: { scrap: 2 }, effect: "Storage secured. Reputation +5." },
    { id: "workbench", title: "Scrap Workbench", cost: 90, requires: { scrap: 4, circuit: 1 }, effect: "Crafting station stabilized. Crafting opens cleaner." },
    { id: "medshelf", title: "Med Shelf", cost: 75, requires: { med_gel: 1, scrap: 1 }, effect: "Rest heals +10 more health." },
    { id: "jammer", title: "Signal Jammer", cost: 120, requires: { circuit: 2, access_chip: 1 }, effect: "Heat reduced by 12." }
  ]
};

let state = getNewState();

const el = (id) => document.getElementById(id);
const createScreenEl = el("createScreen");
const gameScreenEl = el("gameScreen");
const startGameButtonEl = el("startGameButton");
const loadGameButtonEl = el("loadGameButton");
const characterNameEl = el("characterName");
const professionEl = el("profession");
const affiliationEl = el("affiliation");
const implantEl = el("implant");

function getNewState() {
  return {
    name: "Jax Veyr",
    profession: "scavenger",
    affiliation: "mp",
    implant: "clean",
    credits: 100,
    level: 1,
    xp: 0,
    health: 100,
    energy: 100,
    humanity: 100,
    heat: 6,
    reputation: 0,
    hasMap: false,
    completedJobs: [],
    safehouseUpgrades: [],
    inventory: {
      scrap: 3,
      circuit: 1,
      med_gel: 1
    },
    feed: [
      "Clinic requests med-gel delivery.",
      "Black-market power cores spotted near Dock 12.",
      "Free Cells active under the transit spine.",
      "Corporate Cells increased patrols in Grayline.",
      "The Grid flagged unusual traffic."
    ],
    log: []
  };
}

function labelProfession() {
  return DATA.professions[state.profession]?.label || "Scavenger";
}

function labelAffiliation() {
  return DATA.affiliations[state.affiliation]?.label || "M&P";
}

function labelImplant() {
  return DATA.implants[state.implant] || "Clean Body";
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function addItem(key, amount) {
  state.inventory[key] = (state.inventory[key] || 0) + amount;
  if (state.inventory[key] <= 0) delete state.inventory[key];
}

function hasItems(required = {}) {
  return Object.keys(required).every((key) => (state.inventory[key] || 0) >= required[key]);
}

function spendItems(required = {}) {
  if (!hasItems(required)) return false;
  Object.keys(required).forEach((key) => addItem(key, -required[key]));
  return true;
}

function addLog(message) {
  state.log.push(message);
  if (state.log.length > 80) state.log.shift();
  renderLog();
}

function addFeed(message) {
  state.feed.unshift(message);
  if (state.feed.length > 12) state.feed.pop();
}

function gainXp(amount) {
  state.xp += amount;
  const needed = state.level * 100;
  if (state.xp >= needed) {
    state.xp -= needed;
    state.level += 1;
    state.health = clamp(state.health + 15, 0, 100);
    state.energy = clamp(state.energy + 15, 0, 100);
    addLog("<strong>LEVEL UP:</strong> You hit level " + state.level + ".");
  }
}

function startGame() {
  state = getNewState();
  state.name = characterNameEl.value.trim() || "Unnamed Citizen";
  state.profession = professionEl.value;
  state.affiliation = affiliationEl.value;
  state.implant = implantEl.value;

  if (state.affiliation === "free-cell") {
    state.heat += 10;
    state.reputation += 10;
    addFeed("A Free Cell contact marks your name as useful.");
  }

  if (state.affiliation === "corporate-cell") {
    state.credits += 80;
    state.heat = clamp(state.heat - 2, 0, 100);
    state.reputation += 4;
    addFeed("Corporate Cell registry approved. The Ledger has your signature.");
  }

  if (state.affiliation === "mp") {
    state.credits += 25;
    state.reputation += 6;
    addFeed("M&P operators keep moving without a banner.");
  }

  if (state.implant === "old-optic") {
    state.humanity -= 6;
    state.hasMap = true;
  }

  if (state.implant === "nerve-splint") {
    state.humanity -= 10;
    state.health = 100;
  }

  if (state.implant === "black-market-core") {
    state.credits += 90;
    state.humanity -= 20;
    state.heat += 12;
    addItem("power_core", 1);
  }

  createScreenEl.style.display = "none";
  gameScreenEl.style.display = "grid";
  state.log = [];
  addLog("<strong>SYSTEM:</strong> Neural link unstable.");
  addLog("<strong>PROFILE:</strong> " + state.name + ". " + labelProfession() + ". " + labelAffiliation() + ". " + labelImplant() + ".");
  addLog("<strong>MESSAGE:</strong> Sector One opens. The city is already moving.");
  saveLocal(false);
  renderAll();
}

function renderAll() {
  el("playerName").textContent = state.name;
  el("professionText").textContent = labelProfession();
  el("affiliationText").textContent = labelAffiliation();
  el("credits").textContent = state.credits;
  el("levelText").textContent = state.level;
  renderMeters();
  renderFeed();
  renderJobs();
  renderInventory();
  renderCrafting();
  renderMarket();
  renderSafehouse();
  renderProfile();
  renderLog();
}

function renderMeters() {
  const meters = [
    ["health", state.health],
    ["energy", state.energy],
    ["humanity", state.humanity],
    ["heat", state.heat]
  ];
  meters.forEach(([key, value]) => {
    el(key + "Text").textContent = value + "%";
    el(key + "Meter").value = value;
  });
}

function renderFeed() {
  el("cityFeed").innerHTML = state.feed.map((item, index) => `
    <div class="cyrex-feed-item">
      <span>${index === 0 ? "LIVE" : "FEED"}</span>
      <p>${item}</p>
    </div>
  `).join("");
}

function renderJobs() {
  el("jobsList").innerHTML = DATA.jobs.map((job) => {
    const done = state.completedJobs.includes(job.id);
    return `
      <article class="cyrex-list-card">
        <div><strong>${job.title}</strong><span>${job.type} · ${job.difficulty}</span></div>
        <p>${job.text}</p>
        <small>Reward: ${job.reward} cr · ${job.xp} XP · Energy ${job.energy}</small>
        <button data-job="${job.id}" ${done ? "disabled" : ""}>${done ? "Completed" : "Take Job"}</button>
      </article>
    `;
  }).join("");
}

function renderInventory() {
  const entries = Object.entries(state.inventory);
  el("inventoryList").innerHTML = entries.length ? entries.map(([key, value]) => `
    <article class="cyrex-list-card compact"><strong>${formatItem(key)}</strong><span>x${value}</span></article>
  `).join("") : `<article class="cyrex-list-card"><p>No gear. No parts. Bad place to be.</p></article>`;
}

function renderCrafting() {
  el("craftingList").innerHTML = DATA.recipes.map((recipe) => {
    const canCraft = state.credits >= recipe.creditCost && hasItems(recipe.requires);
    return `
      <article class="cyrex-list-card">
        <div><strong>${recipe.title}</strong><span>${recipe.creditCost} cr</span></div>
        <p>Requires: ${formatRequirements(recipe.requires)}</p>
        <small>Creates: ${formatRequirements(recipe.gives)}</small>
        <button data-craft="${recipe.id}" ${canCraft ? "" : "disabled"}>Craft</button>
      </article>
    `;
  }).join("");
}

function renderMarket() {
  el("marketList").innerHTML = DATA.market.map((item) => `
    <article class="cyrex-list-card">
      <div><strong>${item.title}</strong><span>${item.cost ? item.cost + " cr" : "+" + item.reward + " cr"}</span></div>
      <button data-market="${item.id}">${item.cost ? "Buy" : "Sell"}</button>
    </article>
  `).join("");
}

function renderSafehouse() {
  el("safehouseList").innerHTML = DATA.safehouse.map((upgrade) => {
    const owned = state.safehouseUpgrades.includes(upgrade.id);
    const canBuy = !owned && state.credits >= upgrade.cost && hasItems(upgrade.requires);
    return `
      <article class="cyrex-list-card">
        <div><strong>${upgrade.title}</strong><span>${owned ? "Installed" : upgrade.cost + " cr"}</span></div>
        <p>${upgrade.effect}</p>
        <small>Requires: ${formatRequirements(upgrade.requires)}</small>
        <button data-upgrade="${upgrade.id}" ${canBuy ? "" : "disabled"}>${owned ? "Installed" : "Install"}</button>
      </article>
    `;
  }).join("");
}

function renderProfile() {
  const profile = [
    ["Name", state.name],
    ["Profession", labelProfession()],
    ["Affiliation", labelAffiliation()],
    ["Implant", labelImplant()],
    ["Level", state.level],
    ["XP", state.xp + " / " + state.level * 100],
    ["Credits", state.credits],
    ["Reputation", state.reputation],
    ["Profession Bonus", DATA.professions[state.profession].bonus],
    ["Affiliation Note", DATA.affiliations[state.affiliation].desc]
  ];
  el("profilePanel").innerHTML = profile.map(([label, value]) => `
    <div><span>${label}</span><strong>${value}</strong></div>
  `).join("");
}

function renderLog() {
  const log = el("log");
  if (!log) return;
  log.innerHTML = state.log.map((msg) => `<p>${msg}</p>`).join("");
  log.scrollTop = log.scrollHeight;
}

function formatItem(key) {
  return key.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatRequirements(items = {}) {
  return Object.entries(items).map(([key, val]) => `${formatItem(key)} x${val}`).join(", ");
}

function runJob(jobId) {
  const job = DATA.jobs.find((item) => item.id === jobId);
  if (!job || state.completedJobs.includes(job.id)) return;
  if (state.energy < job.energy) {
    addLog("<span class='warning'>Not enough energy for that job.</span>");
    return;
  }

  state.energy = clamp(state.energy - job.energy, 0, 100);
  let reward = job.reward;
  if (state.profession === "courier" && job.type === "Delivery") reward += 15;
  if (state.profession === "bounty-hunter" && job.type === "Combat") reward += 20;
  state.credits += reward;
  state.heat = clamp(state.heat + job.heat, 0, 100);
  state.reputation += Math.round(job.xp / 4);
  gainXp(job.xp);

  Object.entries(job.materials).forEach(([key, val]) => addItem(key, val));

  if (state.profession === "scavenger" && ["Recovery", "Survival"].includes(job.type)) addItem("scrap", 1);
  if (state.profession === "data-runner" && job.type === "Data") addItem("circuit", 1);

  state.completedJobs.push(job.id);
  addFeed(`${job.title} completed by ${state.name}.`);
  addLog(`<strong>JOB COMPLETE:</strong> ${job.title}. Paid ${reward} credits.`);
  saveLocal(false);
  renderAll();
}

function craftItem(recipeId) {
  const recipe = DATA.recipes.find((item) => item.id === recipeId);
  if (!recipe) return;
  if (state.credits < recipe.creditCost || !spendItems(recipe.requires)) {
    addLog("<span class='warning'>Missing credits or materials.</span>");
    renderAll();
    return;
  }
  state.credits -= recipe.creditCost;
  Object.entries(recipe.gives).forEach(([key, val]) => addItem(key, val));
  if (state.profession === "tech" && Math.random() > 0.5) addItem("scrap", 1);
  addLog(`<strong>CRAFTED:</strong> ${recipe.title}.`);
  saveLocal(false);
  renderAll();
}

function useMarket(itemId) {
  const item = DATA.market.find((entry) => entry.id === itemId);
  if (!item) return;
  if (item.cost) {
    if (state.credits < item.cost) {
      addLog("<span class='warning'>Not enough credits.</span>");
      return;
    }
    state.credits -= item.cost;
    Object.entries(item.gives).forEach(([key, val]) => addItem(key, val));
    addLog(`<strong>MARKET:</strong> ${item.title}.`);
  } else if (item.sell) {
    if (!spendItems(item.sell)) {
      addLog("<span class='warning'>You do not have the item to sell.</span>");
      renderAll();
      return;
    }
    state.credits += item.reward;
    addLog(`<strong>MARKET:</strong> Sale completed for ${item.reward} credits.`);
  }
  saveLocal(false);
  renderAll();
}

function installUpgrade(upgradeId) {
  const upgrade = DATA.safehouse.find((item) => item.id === upgradeId);
  if (!upgrade || state.safehouseUpgrades.includes(upgrade.id)) return;
  if (state.credits < upgrade.cost || !spendItems(upgrade.requires)) {
    addLog("<span class='warning'>Missing credits or materials for upgrade.</span>");
    renderAll();
    return;
  }
  state.credits -= upgrade.cost;
  state.safehouseUpgrades.push(upgrade.id);
  if (upgrade.id === "locker") state.reputation += 5;
  if (upgrade.id === "jammer") state.heat = clamp(state.heat - 12, 0, 100);
  addLog(`<strong>SAFEHOUSE:</strong> ${upgrade.title} installed.`);
  saveLocal(false);
  renderAll();
}

function handleAction(action) {
  if (action === "enter-district") {
    switchPanel("district");
    addLog("<strong>DISTRICT:</strong> Grayline opens under bad light.");
  }
  if (action === "refresh-feed") {
    const variants = [
      "The Towers deny reports of forced relocations.",
      "M&P vendors raised prices after the lockdown.",
      "A Corporate Cell convoy moved through Sector Nine.",
      "Free Cell graffiti appeared on a Grid checkpoint.",
      "A clinic is buying trauma kits above market."
    ];
    addFeed(variants[Math.floor(Math.random() * variants.length)]);
    addLog("<strong>FEED:</strong> City feed refreshed.");
  }
  if (action === "scavenge-run") {
    if (state.energy < 10) return addLog("<span class='warning'>Not enough energy.</span>");
    state.energy -= 10;
    addItem("scrap", state.profession === "scavenger" ? 3 : 2);
    if (Math.random() > 0.62) addItem("circuit", 1);
    state.heat = clamp(state.heat + 3, 0, 100);
    gainXp(12);
    addLog("<strong>SCAVENGE:</strong> Scrap recovered from a dead service bay.");
  }
  if (action === "scan-district") {
    if (state.profession === "data-runner") addItem("data_shard", 1);
    state.hasMap = true;
    addLog("<strong>SCAN:</strong> District map updated. Grid traffic looks wrong.");
  }
  if (action === "visit-clinic") {
    const cost = state.profession === "medic" ? 18 : 30;
    if (state.credits < cost) return addLog("<span class='warning'>Clinic refused treatment. Not enough credits.</span>");
    state.credits -= cost;
    state.health = clamp(state.health + 35, 0, 100);
    addLog(`<strong>CLINIC:</strong> Wounds patched. ${cost} credits gone.`);
  }
  if (action === "rest-cycle") {
    state.energy = clamp(state.energy + 30, 0, 100);
    state.health = clamp(state.health + (state.safehouseUpgrades.includes("medshelf") ? 20 : 10), 0, 100);
    addLog("<strong>REST:</strong> You sleep in fragments. The city keeps moving.");
  }
  if (action === "save-game") saveLocal(true);
  if (action === "reset-game") resetGame();
  renderAll();
}

function switchPanel(panel) {
  document.querySelectorAll(".cyrex-panel").forEach((item) => item.classList.toggle("is-active", item.dataset.panel === panel));
  document.querySelectorAll(".cyrex-tabs button").forEach((item) => item.classList.toggle("is-active", item.dataset.tab === panel));
}

function saveLocal(showLog = true) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  if (showLog) addLog("<strong>SAVE:</strong> Local progress saved. Supabase cloud save comes later.");
}

function loadLocal() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) {
    alert("No local Cyrex save found yet.");
    return;
  }
  state = { ...getNewState(), ...JSON.parse(raw) };
  createScreenEl.style.display = "none";
  gameScreenEl.style.display = "grid";
  addLog("<strong>LOAD:</strong> Local save restored.");
  renderAll();
}

function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  window.location.reload();
}

startGameButtonEl.addEventListener("click", startGame);
loadGameButtonEl.addEventListener("click", loadLocal);

document.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-tab]");
  if (tab) switchPanel(tab.dataset.tab);

  const action = event.target.closest("[data-action]");
  if (action) handleAction(action.dataset.action);

  const job = event.target.closest("[data-job]");
  if (job) runJob(job.dataset.job);

  const craft = event.target.closest("[data-craft]");
  if (craft) craftItem(craft.dataset.craft);

  const market = event.target.closest("[data-market]");
  if (market) useMarket(market.dataset.market);

  const upgrade = event.target.closest("[data-upgrade]");
  if (upgrade) installUpgrade(upgrade.dataset.upgrade);
});
