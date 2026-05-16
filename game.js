const SAVE_KEY = "cyrex_sector_one_v03";

const DATA = {
  professions: {
    scavenger: { label: "Scavenger", bonus: "Scavenge runs find +1 scrap when successful." },
    courier: { label: "Courier", bonus: "Delivery jobs pay +15 credits." },
    medic: { label: "Street Medic", bonus: "Clinic visits cost less and med recipes are cheaper." },
    tech: { label: "Cybernetic Tech", bonus: "Crafting has a chance to refund 1 scrap. Cyber installs cost less." },
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
  districts: [
    { id: "grayline", title: "Grayline District", status: "Transit Lockdown", danger: "Medium", heat: 4, text: "Clinics, transit scaffolds, sleeping blocks, and bad light. Good work if you can survive the wrong eyes.", resources: { scrap: 2, circuit: 1 }, feed: "Grayline reports another rolling blackout." },
    { id: "dock12", title: "Dock 12", status: "Core Smuggling", danger: "High", heat: 9, text: "A cargo wound in the side of Prima One. Power cores, stolen freight, and people nobody claims.", resources: { scrap: 2, power_core: 1 }, feed: "Black-market power cores moved through Dock 12." },
    { id: "blackrow", title: "Black Market Row", status: "Open Trade", danger: "Medium", heat: 6, text: "If it can be bought, sold, installed, erased, or denied, someone here has a price for it.", resources: { circuit: 1, data_shard: 1 }, feed: "Black Market Row prices shifted after a Corporate Cell raid." },
    { id: "clinic", title: "Clinic Quarter", status: "Emergency Load", danger: "Low", heat: 2, text: "Red-white light, burned nerves, clean blades, dirty credit. Everybody comes here eventually.", resources: { med_gel: 2, scrap: 1 }, feed: "Clinic Quarter is paying above market for trauma kits." }
  ],
  jobs: [
    { id: "medgel", title: "Clinic Med-Gel Delivery", type: "Delivery", difficulty: "Low", reward: 90, xp: 24, energy: 14, heat: 4, materials: { med_gel: 1 }, text: "A clinic needs med-gel moved through a locked transit corridor." },
    { id: "cores", title: "Recover Power Cores", type: "Recovery", difficulty: "Medium", reward: 140, xp: 36, energy: 22, heat: 10, materials: { power_core: 1, scrap: 2 }, text: "Black-market cores were spotted near Dock 12. Bring back what still holds a charge." },
    { id: "sweep", title: "Avoid Corporate Sweep", type: "Survival", difficulty: "Medium", reward: 110, xp: 32, energy: 18, heat: -8, materials: { access_chip: 1 }, text: "Suits are walking the lower platforms. Stay quiet and move clean." },
    { id: "bounty", title: "Street Bounty: Red Voss", type: "Combat", difficulty: "Hard", reward: 190, xp: 52, energy: 30, heat: 16, materials: { weapon_part: 1 }, text: "A fixer wants Red Voss alive. The contract does not say why." },
    { id: "grid", title: "Grid Echo Scan", type: "Data", difficulty: "Low", reward: 70, xp: 22, energy: 12, heat: 5, materials: { data_shard: 1 }, text: "Trace a ghost signal before the Grid closes the window." },
    { id: "cell-aid", title: "Free Cell Supply Run", type: "Cell", difficulty: "Medium", reward: 120, xp: 34, energy: 20, heat: 11, materials: { access_chip: 1, med_gel: 1 }, text: "A Free Cell needs supplies moved under the Grid." },
    { id: "corp-audit", title: "Corporate Compliance Audit", type: "Corporate", difficulty: "Low", reward: 160, xp: 26, energy: 15, heat: -6, materials: { circuit: 1 }, text: "The Towers need quiet bodies to check records and look away." }
  ],
  recipes: [
    { id: "medkit", title: "Trauma Kit", requires: { med_gel: 1, scrap: 1 }, gives: { trauma_kit: 1 }, creditCost: 10 },
    { id: "weaponmod", title: "Crude Weapon Mod", requires: { weapon_part: 1, scrap: 2 }, gives: { weapon_mod: 1 }, creditCost: 25 },
    { id: "corecharger", title: "Core Charger", requires: { power_core: 1, circuit: 2, scrap: 2 }, gives: { core_charger: 1 }, creditCost: 40 },
    { id: "scrambler", title: "Grid Scrambler", requires: { data_shard: 1, access_chip: 1, circuit: 1 }, gives: { grid_scrambler: 1 }, creditCost: 35 }
  ],
  cybernetics: [
    { id: "optic", title: "Old Optic Rebuild", cost: 90, humanity: 6, heat: 3, requires: { circuit: 1, data_shard: 1 }, effect: "Scans improve. Adds data shard chance on district scans." },
    { id: "splint", title: "Nerve Splint Mk.I", cost: 130, humanity: 9, heat: 5, requires: { circuit: 2, scrap: 2 }, effect: "Combat jobs pay +15 credits. Energy max feels steadier." },
    { id: "grip", title: "Chrome Grip Tendons", cost: 110, humanity: 7, heat: 4, requires: { scrap: 3, weapon_part: 1 }, effect: "Scavenge runs recover more scrap." },
    { id: "blackcore", title: "Black-Market Core Socket", cost: 220, humanity: 16, heat: 14, requires: { power_core: 1, access_chip: 1 }, effect: "High output. Better rewards. People notice." }
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
    activeDistrict: "grayline",
    hasMap: false,
    completedJobs: [],
    safehouseUpgrades: [],
    installedCybernetics: [],
    standing: { free: 0, corporate: 0, mp: 8 },
    inventory: { scrap: 3, circuit: 1, med_gel: 1 },
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

function activeDistrict() { return DATA.districts.find((d) => d.id === state.activeDistrict) || DATA.districts[0]; }
function labelProfession() { return DATA.professions[state.profession]?.label || "Scavenger"; }
function labelAffiliation() { return DATA.affiliations[state.affiliation]?.label || "M&P"; }
function labelImplant() { return DATA.implants[state.implant] || "Clean Body"; }
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function addItem(key, amount) { state.inventory[key] = (state.inventory[key] || 0) + amount; if (state.inventory[key] <= 0) delete state.inventory[key]; }
function hasItems(required = {}) { return Object.keys(required).every((key) => (state.inventory[key] || 0) >= required[key]); }
function spendItems(required = {}) { if (!hasItems(required)) return false; Object.keys(required).forEach((key) => addItem(key, -required[key])); return true; }
function formatItem(key) { return key.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()); }
function formatRequirements(items = {}) { return Object.entries(items).map(([key, val]) => `${formatItem(key)} x${val}`).join(", "); }

function addLog(message) { state.log.push(message); if (state.log.length > 80) state.log.shift(); renderLog(); }
function addFeed(message) { state.feed.unshift(message); if (state.feed.length > 12) state.feed.pop(); }
function gainXp(amount) { state.xp += amount; const needed = state.level * 100; if (state.xp >= needed) { state.xp -= needed; state.level += 1; state.health = clamp(state.health + 15, 0, 100); state.energy = clamp(state.energy + 15, 0, 100); addLog("<strong>LEVEL UP:</strong> You hit level " + state.level + "."); } }

function startGame() {
  state = getNewState();
  state.name = characterNameEl.value.trim() || "Unnamed Citizen";
  state.profession = professionEl.value;
  state.affiliation = affiliationEl.value;
  state.implant = implantEl.value;

  if (state.affiliation === "free-cell") { state.heat += 10; state.reputation += 10; state.standing.free += 20; addFeed("A Free Cell contact marks your name as useful."); }
  if (state.affiliation === "corporate-cell") { state.credits += 80; state.heat = clamp(state.heat - 2, 0, 100); state.reputation += 4; state.standing.corporate += 22; addFeed("Corporate Cell registry approved. The Ledger has your signature."); }
  if (state.affiliation === "mp") { state.credits += 25; state.reputation += 6; state.standing.mp += 18; addFeed("M&P operators keep moving without a banner."); }
  if (state.implant === "old-optic") { state.humanity -= 6; state.hasMap = true; state.installedCybernetics.push("optic"); }
  if (state.implant === "nerve-splint") { state.humanity -= 10; state.installedCybernetics.push("splint"); }
  if (state.implant === "black-market-core") { state.credits += 90; state.humanity -= 20; state.heat += 12; addItem("power_core", 1); state.installedCybernetics.push("blackcore"); }

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
  renderDistrictHero();
  renderMeters();
  renderFeed();
  renderDistricts();
  renderJobs();
  renderInventory();
  renderCrafting();
  renderMarket();
  renderSafehouse();
  renderCybernetics();
  renderCells();
  renderProfile();
  renderLog();
}

function renderDistrictHero() {
  const district = activeDistrict();
  el("sceneTitle").textContent = district.title;
  el("sceneDesc").textContent = `${district.status}. Danger ${district.danger}. ${district.text}`;
  el("districtName").textContent = district.title;
  el("districtCopy").textContent = district.text;
}

function renderMeters() {
  [["health", state.health], ["energy", state.energy], ["humanity", state.humanity], ["heat", state.heat]].forEach(([key, value]) => { el(key + "Text").textContent = value + "%"; el(key + "Meter").value = value; });
}

function renderFeed() {
  el("cityFeed").innerHTML = state.feed.map((item, index) => `<div class="cyrex-feed-item"><span>${index === 0 ? "LIVE" : "FEED"}</span><p>${item}</p></div>`).join("");
}

function renderDistricts() {
  el("districtList").innerHTML = DATA.districts.map((district) => `
    <article class="cyrex-list-card ${district.id === state.activeDistrict ? "selected" : ""}">
      <div><strong>${district.title}</strong><span>${district.status}</span></div>
      <p>${district.text}</p>
      <small>Danger: ${district.danger} · Heat on entry: +${district.heat}</small>
      <button data-district="${district.id}">${district.id === state.activeDistrict ? "Active" : "Travel"}</button>
    </article>
  `).join("");
}

function renderJobs() {
  el("jobsList").innerHTML = DATA.jobs.map((job) => { const done = state.completedJobs.includes(job.id); return `<article class="cyrex-list-card"><div><strong>${job.title}</strong><span>${job.type} · ${job.difficulty}</span></div><p>${job.text}</p><small>Reward: ${job.reward} cr · ${job.xp} XP · Energy ${job.energy}</small><button data-job="${job.id}" ${done ? "disabled" : ""}>${done ? "Completed" : "Take Job"}</button></article>`; }).join("");
}

function renderInventory() {
  const entries = Object.entries(state.inventory);
  el("inventoryList").innerHTML = entries.length ? entries.map(([key, value]) => `<article class="cyrex-list-card compact"><strong>${formatItem(key)}</strong><span>x${value}</span></article>`).join("") : `<article class="cyrex-list-card"><p>No gear. No parts. Bad place to be.</p></article>`;
}

function renderCrafting() {
  el("craftingList").innerHTML = DATA.recipes.map((recipe) => { const canCraft = state.credits >= recipe.creditCost && hasItems(recipe.requires); return `<article class="cyrex-list-card"><div><strong>${recipe.title}</strong><span>${recipe.creditCost} cr</span></div><p>Requires: ${formatRequirements(recipe.requires)}</p><small>Creates: ${formatRequirements(recipe.gives)}</small><button data-craft="${recipe.id}" ${canCraft ? "" : "disabled"}>Craft</button></article>`; }).join("");
}

function renderMarket() {
  el("marketList").innerHTML = DATA.market.map((item) => `<article class="cyrex-list-card"><div><strong>${item.title}</strong><span>${item.cost ? item.cost + " cr" : "+" + item.reward + " cr"}</span></div><button data-market="${item.id}">${item.cost ? "Buy" : "Sell"}</button></article>`).join("");
}

function renderSafehouse() {
  el("safehouseList").innerHTML = DATA.safehouse.map((upgrade) => { const owned = state.safehouseUpgrades.includes(upgrade.id); const canBuy = !owned && state.credits >= upgrade.cost && hasItems(upgrade.requires); return `<article class="cyrex-list-card"><div><strong>${upgrade.title}</strong><span>${owned ? "Installed" : upgrade.cost + " cr"}</span></div><p>${upgrade.effect}</p><small>Requires: ${formatRequirements(upgrade.requires)}</small><button data-upgrade="${upgrade.id}" ${canBuy ? "" : "disabled"}>${owned ? "Installed" : "Install"}</button></article>`; }).join("");
}

function renderCybernetics() {
  el("cyberneticsList").innerHTML = DATA.cybernetics.map((cyber) => {
    const installed = state.installedCybernetics.includes(cyber.id);
    const installCost = state.profession === "tech" ? Math.max(20, cyber.cost - 25) : cyber.cost;
    const canInstall = !installed && state.credits >= installCost && hasItems(cyber.requires) && state.humanity > cyber.humanity;
    return `<article class="cyrex-list-card ${installed ? "selected" : ""}"><div><strong>${cyber.title}</strong><span>${installed ? "Installed" : installCost + " cr"}</span></div><p>${cyber.effect}</p><small>Humanity -${cyber.humanity} · Heat +${cyber.heat} · Requires: ${formatRequirements(cyber.requires)}</small><button data-cyber="${cyber.id}" ${canInstall ? "" : "disabled"}>${installed ? "Installed" : "Install"}</button></article>`;
  }).join("");
}

function renderCells() {
  const affiliation = DATA.affiliations[state.affiliation];
  el("cellsPanel").innerHTML = `
    <article class="cyrex-list-card"><div><strong>Current Standing</strong><span>${labelAffiliation()}</span></div><p>${affiliation.desc}</p></article>
    <article class="cyrex-list-card compact"><strong>Free Cell Standing</strong><span>${state.standing.free}</span></article>
    <article class="cyrex-list-card compact"><strong>Corporate Cell Standing</strong><span>${state.standing.corporate}</span></article>
    <article class="cyrex-list-card compact"><strong>M&P Standing</strong><span>${state.standing.mp}</span></article>
    <article class="cyrex-list-card"><div><strong>Cell Base</strong><span>Locked</span></div><p>Communal cell bases come later. Freeholds, Corporate facilities, allied access, and shared crafting will build from here.</p></article>
  `;
}

function renderProfile() {
  const profile = [["Name", state.name], ["Profession", labelProfession()], ["Affiliation", labelAffiliation()], ["Implant", labelImplant()], ["Level", state.level], ["XP", state.xp + " / " + state.level * 100], ["Credits", state.credits], ["Reputation", state.reputation], ["District", activeDistrict().title], ["Cybernetics", state.installedCybernetics.length], ["Profession Bonus", DATA.professions[state.profession].bonus], ["Affiliation Note", DATA.affiliations[state.affiliation].desc]];
  el("profilePanel").innerHTML = profile.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("");
}

function renderLog() { const log = el("log"); if (!log) return; log.innerHTML = state.log.map((msg) => `<p>${msg}</p>`).join(""); log.scrollTop = log.scrollHeight; }

function runJob(jobId) {
  const job = DATA.jobs.find((item) => item.id === jobId);
  if (!job || state.completedJobs.includes(job.id)) return;
  if (state.energy < job.energy) return addLog("<span class='warning'>Not enough energy for that job.</span>");
  state.energy = clamp(state.energy - job.energy, 0, 100);
  let reward = job.reward;
  if (state.profession === "courier" && job.type === "Delivery") reward += 15;
  if (state.profession === "bounty-hunter" && job.type === "Combat") reward += 20;
  if (state.installedCybernetics.includes("splint") && job.type === "Combat") reward += 15;
  if (state.installedCybernetics.includes("blackcore")) reward += 12;
  state.credits += reward;
  state.heat = clamp(state.heat + job.heat, 0, 100);
  state.reputation += Math.round(job.xp / 4);
  if (job.type === "Cell") state.standing.free += 6;
  if (job.type === "Corporate") state.standing.corporate += 6;
  if (["Delivery", "Recovery"].includes(job.type)) state.standing.mp += 2;
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
  if (state.credits < recipe.creditCost || !spendItems(recipe.requires)) { addLog("<span class='warning'>Missing credits or materials.</span>"); renderAll(); return; }
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
  if (item.cost) { if (state.credits < item.cost) return addLog("<span class='warning'>Not enough credits.</span>"); state.credits -= item.cost; Object.entries(item.gives).forEach(([key, val]) => addItem(key, val)); addLog(`<strong>MARKET:</strong> ${item.title}.`); }
  else if (item.sell) { if (!spendItems(item.sell)) { addLog("<span class='warning'>You do not have the item to sell.</span>"); renderAll(); return; } state.credits += item.reward; addLog(`<strong>MARKET:</strong> Sale completed for ${item.reward} credits.`); }
  saveLocal(false);
  renderAll();
}

function installUpgrade(upgradeId) {
  const upgrade = DATA.safehouse.find((item) => item.id === upgradeId);
  if (!upgrade || state.safehouseUpgrades.includes(upgrade.id)) return;
  if (state.credits < upgrade.cost || !spendItems(upgrade.requires)) { addLog("<span class='warning'>Missing credits or materials for upgrade.</span>"); renderAll(); return; }
  state.credits -= upgrade.cost;
  state.safehouseUpgrades.push(upgrade.id);
  if (upgrade.id === "locker") state.reputation += 5;
  if (upgrade.id === "jammer") state.heat = clamp(state.heat - 12, 0, 100);
  addLog(`<strong>SAFEHOUSE:</strong> ${upgrade.title} installed.`);
  saveLocal(false);
  renderAll();
}

function installCyber(cyberId) {
  const cyber = DATA.cybernetics.find((item) => item.id === cyberId);
  if (!cyber || state.installedCybernetics.includes(cyber.id)) return;
  const installCost = state.profession === "tech" ? Math.max(20, cyber.cost - 25) : cyber.cost;
  if (state.credits < installCost || !spendItems(cyber.requires) || state.humanity <= cyber.humanity) { addLog("<span class='warning'>Install denied. Missing credits, parts, or humanity margin.</span>"); renderAll(); return; }
  state.credits -= installCost;
  state.humanity = clamp(state.humanity - cyber.humanity, 0, 100);
  state.heat = clamp(state.heat + cyber.heat, 0, 100);
  state.installedCybernetics.push(cyber.id);
  addLog(`<strong>CYBERNETIC INSTALLED:</strong> ${cyber.title}. Humanity reduced.`);
  addFeed(`${state.name} registered new chrome activity in ${activeDistrict().title}.`);
  saveLocal(false);
  renderAll();
}

function travelDistrict(districtId) {
  const district = DATA.districts.find((d) => d.id === districtId);
  if (!district) return;
  state.activeDistrict = district.id;
  state.energy = clamp(state.energy - 6, 0, 100);
  state.heat = clamp(state.heat + district.heat, 0, 100);
  addFeed(district.feed);
  addLog(`<strong>TRAVEL:</strong> Entered ${district.title}.`);
  saveLocal(false);
  renderAll();
}

function handleAction(action) {
  if (action === "enter-district") { switchPanel("district"); addLog("<strong>DISTRICT:</strong> " + activeDistrict().title + " opens under bad light."); }
  if (action === "refresh-feed") { const variants = ["The Towers deny reports of forced relocations.", "M&P vendors raised prices after the lockdown.", "A Corporate Cell convoy moved through Sector Nine.", "Free Cell graffiti appeared on a Grid checkpoint.", "A clinic is buying trauma kits above market."]; addFeed(variants[Math.floor(Math.random() * variants.length)]); addLog("<strong>FEED:</strong> City feed refreshed."); }
  if (action === "scavenge-run") { if (state.energy < 10) return addLog("<span class='warning'>Not enough energy.</span>"); const district = activeDistrict(); state.energy -= 10; Object.entries(district.resources).forEach(([key, val]) => addItem(key, val)); if (state.profession === "scavenger" || state.installedCybernetics.includes("grip")) addItem("scrap", 1); state.heat = clamp(state.heat + 3, 0, 100); gainXp(12); addLog("<strong>SCAVENGE:</strong> Materials recovered from " + district.title + "."); }
  if (action === "scan-district") { if (state.profession === "data-runner" || state.installedCybernetics.includes("optic")) addItem("data_shard", 1); state.hasMap = true; addLog("<strong>SCAN:</strong> District map updated. Grid traffic looks wrong."); }
  if (action === "visit-clinic") { const cost = state.profession === "medic" ? 18 : 30; if (state.credits < cost) return addLog("<span class='warning'>Clinic refused treatment. Not enough credits.</span>"); state.credits -= cost; state.health = clamp(state.health + 35, 0, 100); addLog(`<strong>CLINIC:</strong> Wounds patched. ${cost} credits gone.`); }
  if (action === "rest-cycle") { state.energy = clamp(state.energy + 30, 0, 100); state.health = clamp(state.health + (state.safehouseUpgrades.includes("medshelf") ? 20 : 10), 0, 100); addLog("<strong>REST:</strong> You sleep in fragments. The city keeps moving."); }
  if (action === "save-game") saveLocal(true);
  if (action === "reset-game") resetGame();
  renderAll();
}

function switchPanel(panel) { document.querySelectorAll(".cyrex-panel").forEach((item) => item.classList.toggle("is-active", item.dataset.panel === panel)); document.querySelectorAll(".cyrex-tabs button").forEach((item) => item.classList.toggle("is-active", item.dataset.tab === panel)); }
function saveLocal(showLog = true) { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); if (showLog) addLog("<strong>SAVE:</strong> Local progress saved. Supabase cloud save comes later."); }
function loadLocal() { const raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem("cyrex_sector_one_v02"); if (!raw) { alert("No local Cyrex save found yet."); return; } state = { ...getNewState(), ...JSON.parse(raw) }; state.standing = { ...getNewState().standing, ...(state.standing || {}) }; state.installedCybernetics = state.installedCybernetics || []; state.activeDistrict = state.activeDistrict || "grayline"; createScreenEl.style.display = "none"; gameScreenEl.style.display = "grid"; addLog("<strong>LOAD:</strong> Local save restored."); renderAll(); }
function resetGame() { localStorage.removeItem(SAVE_KEY); localStorage.removeItem("cyrex_sector_one_v02"); window.location.reload(); }

startGameButtonEl.addEventListener("click", startGame);
loadGameButtonEl.addEventListener("click", loadLocal);

document.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-tab]"); if (tab) switchPanel(tab.dataset.tab);
  const action = event.target.closest("[data-action]"); if (action) handleAction(action.dataset.action);
  const district = event.target.closest("[data-district]"); if (district) travelDistrict(district.dataset.district);
  const job = event.target.closest("[data-job]"); if (job) runJob(job.dataset.job);
  const craft = event.target.closest("[data-craft]"); if (craft) craftItem(craft.dataset.craft);
  const market = event.target.closest("[data-market]"); if (market) useMarket(market.dataset.market);
  const upgrade = event.target.closest("[data-upgrade]"); if (upgrade) installUpgrade(upgrade.dataset.upgrade);
  const cyber = event.target.closest("[data-cyber]"); if (cyber) installCyber(cyber.dataset.cyber);
});
