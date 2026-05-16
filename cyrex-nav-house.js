(function(){
  function qsa(s){return Array.from(document.querySelectorAll(s))}
  function safeState(){return typeof state!=='undefined'?state:null}
  function ensureStorage(){const s=safeState();if(!s)return{};if(!s.safehouseStorage)s.safehouseStorage={};return s.safehouseStorage}
  function houseItems(){
    const s=safeState();
    const upgrades=s&&Array.isArray(s.safehouseUpgrades)?s.safehouseUpgrades:[];
    const base=[
      {id:'bed',name:'Cot',sub:'Sleep / Rest',slot:13,type:'cot'},
      {id:'door',name:'Door',sub:'Zone Map',slot:4,type:'door'},
      {id:'power',name:'Breaker',sub:'Power',slot:8,type:'power'}
    ];
    const upgradeMap={
      locker:{name:'Wall Locker',sub:'Storage',slot:1,type:'locker'},
      workbench:{name:'Workbench',sub:'Craft',slot:6,type:'workbench'},
      medshelf:{name:'Med Shelf',sub:'Recover',slot:10,type:'medshelf'},
      jammer:{name:'Signal Jammer',sub:'Heat Control',slot:15,type:'jammer'}
    };
    upgrades.forEach(id=>{if(upgradeMap[id])base.push({id,...upgradeMap[id]})});
    return base;
  }
  function itemLabel(k){return k.replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase())}
  function invEntries(){const s=safeState();return Object.entries((s&&s.inventory)||{})}
  function storeEntries(){return Object.entries(ensureStorage())}
  function addToBag(bag,key,amt){bag[key]=(bag[key]||0)+amt;if(bag[key]<=0)delete bag[key]}
  function writeLog(msg){if(typeof log==='function')log(msg);else if(typeof addLog==='function')addLog(msg)}
  function redraw(){if(typeof save==='function')save(false);if(typeof renderAll==='function')renderAll();setTimeout(renderHouseGrid,20)}
  function moveToStorage(key){const s=safeState();if(!s||!s.inventory||!s.inventory[key])return;const storage=ensureStorage();addToBag(s.inventory,key,-1);addToBag(storage,key,1);writeLog('<strong>LOCKER:</strong> Stored '+itemLabel(key)+'.');redraw()}
  function moveToInventory(key){const s=safeState();const storage=ensureStorage();if(!s||!storage[key])return;addToBag(storage,key,-1);addToBag(s.inventory,key,1);writeLog('<strong>LOCKER:</strong> Retrieved '+itemLabel(key)+'.');redraw()}
  function panelTemplate(title,body){return `<section class="cyrex-house-service" id="cyrexHouseService"><div class="cyrex-house-service-head"><strong>${title}</strong><button type="button" data-house-close>×</button></div><div class="cyrex-house-service-body">${body}</div></section>`}
  function showService(type){
    const old=document.getElementById('cyrexHouseService');if(old)old.remove();
    let html='';
    if(type==='cot'){
      html=panelTemplate('Cot',`<p>Sleep in short cycles. Restore energy now, or take a deeper rest for better recovery.</p><div class="cyrex-house-service-actions"><button data-house-action="rest">Rest Cycle</button><button data-house-action="deep-rest">Deep Rest</button></div>`);
    }else if(type==='door'){
      html=panelTemplate('Door',`<p>The door leads back out into the larger sector map.</p><div class="cyrex-house-service-actions"><button data-house-action="map">Open Zone Map</button><button data-house-action="district">Current District</button></div>`);
    }else if(type==='power'){
      html=panelTemplate('Breaker',`<p>Weak power. Enough to keep the room lit. Later this can run utilities, defenses, and automated crafting.</p><div class="cyrex-house-status-row"><span>Power</span><strong>Unstable</strong></div><div class="cyrex-house-status-row"><span>Grid Noise</span><strong>High</strong></div>`);
    }else if(type==='locker'){
      const inv=invEntries();const stored=storeEntries();
      html=panelTemplate('Wall Locker',`<p>Store or retrieve materials. This is the first pass of safehouse storage.</p><h4>Inventory</h4><div class="cyrex-house-storage-list">${inv.length?inv.map(([k,v])=>`<button data-store-item="${k}">${itemLabel(k)} <span>x${v}</span></button>`).join(''):'<em>Inventory empty.</em>'}</div><h4>Locker</h4><div class="cyrex-house-storage-list">${stored.length?stored.map(([k,v])=>`<button data-retrieve-item="${k}">${itemLabel(k)} <span>x${v}</span></button>`).join(''):'<em>Locker empty.</em>'}</div>`);
    }else if(type==='workbench'){
      html=panelTemplate('Workbench',`<p>Use the workbench to craft parts, medical supplies, and utility gear.</p><div class="cyrex-house-service-actions"><button data-house-action="crafting">Open Crafting</button></div>`);
    }else if(type==='medshelf'){
      html=panelTemplate('Med Shelf',`<p>Patch yourself up from stored supplies.</p><div class="cyrex-house-service-actions"><button data-house-action="heal">Recover Health</button><button data-house-action="clinic">Visit Clinic</button></div>`);
    }else if(type==='jammer'){
      html=panelTemplate('Signal Jammer',`<p>Burn some power and scramble your local trace.</p><div class="cyrex-house-service-actions"><button data-house-action="jam">Reduce Heat</button></div>`);
    }
    const shell=document.getElementById('cyrexHouseGridShell');
    if(shell) shell.insertAdjacentHTML('beforeend',html);
  }
  function runHouseAction(action){
    const s=safeState();if(!s)return;
    if(action==='rest'){if(typeof handleAction==='function')handleAction('rest-cycle');return}
    if(action==='deep-rest'){s.energy=100;s.health=Math.min(100,(s.health||0)+25);writeLog('<strong>REST:</strong> Deep rest completed. Energy restored.');redraw();return}
    if(action==='map'){if(typeof switchPanel==='function')switchPanel('district');setTimeout(function(){const btn=document.querySelector('[data-map-mode="sector"]');if(btn)btn.click()},40);return}
    if(action==='district'){if(typeof switchPanel==='function')switchPanel('district');return}
    if(action==='crafting'){if(typeof switchPanel==='function')switchPanel('crafting');return}
    if(action==='clinic'){if(typeof handleAction==='function')handleAction('visit-clinic');return}
    if(action==='heal'){s.health=Math.min(100,(s.health||0)+20);writeLog('<strong>MED SHELF:</strong> Health recovered.');redraw();return}
    if(action==='jam'){s.heat=Math.max(0,(s.heat||0)-10);writeLog('<strong>JAMMER:</strong> Local trace reduced.');redraw();return}
  }
  function renderHouseGrid(){
    const target=document.getElementById('safehouseList');
    if(!target)return;
    const existing=document.getElementById('cyrexHouseGridShell');
    if(existing)existing.remove();
    const shell=document.createElement('section');
    shell.className='cyrex-house-shell';
    shell.id='cyrexHouseGridShell';
    const cells=Array.from({length:16},(_,i)=>`<button class="cyrex-house-cell" type="button" data-house-slot="${i}" aria-label="Empty floor slot"></button>`).join('');
    shell.innerHTML=`<div class="cyrex-house-head"><strong>Lower Stack Room</strong><span>Tap objects to use services. Upgrades become functional room pieces.</span></div><div class="cyrex-house-stage"><div class="cyrex-house-grid">${cells}<div class="cyrex-house-player"></div></div></div><div class="cyrex-house-options"><button type="button" data-tab-target="safehouse">Install Upgrades</button><button type="button" data-house-action="rest">Rest Cycle</button></div>`;
    target.parentNode.insertBefore(shell,target);
    houseItems().forEach(item=>{
      const cell=shell.querySelector(`[data-house-slot="${item.slot}"]`);
      if(!cell)return;
      cell.setAttribute('data-house-object',item.type);
      cell.setAttribute('aria-label',item.name);
      const div=document.createElement('div');
      div.className='cyrex-house-item';
      div.innerHTML=`<div><strong>${item.name}</strong><span>${item.sub}</span></div>`;
      cell.appendChild(div);
    });
  }
  function validateNav(){
    qsa('.cyrex-tabs button[data-tab]').forEach(btn=>{
      const panel=document.querySelector(`.cyrex-panel[data-panel="${btn.dataset.tab}"]`);
      btn.disabled=!panel;
      btn.title=panel?`Open ${btn.dataset.tab}`:'Missing panel';
    });
  }
  function forceTab(tab){const panel=document.querySelector(`.cyrex-panel[data-panel="${tab}"]`);if(!panel)return;if(typeof switchPanel==='function')switchPanel(tab);if(tab==='safehouse')setTimeout(renderHouseGrid,30)}
  const oldRenderAll=window.renderAll||null;
  if(oldRenderAll){window.renderAll=function(){oldRenderAll();validateNav();renderHouseGrid()}}
  document.addEventListener('click',function(e){
    const close=e.target.closest('[data-house-close]');if(close){const p=document.getElementById('cyrexHouseService');if(p)p.remove();return}
    const object=e.target.closest('[data-house-object]');if(object){showService(object.dataset.houseObject);return}
    const houseAction=e.target.closest('[data-house-action]');if(houseAction){runHouseAction(houseAction.dataset.houseAction);return}
    const store=e.target.closest('[data-store-item]');if(store){moveToStorage(store.dataset.storeItem);return}
    const retrieve=e.target.closest('[data-retrieve-item]');if(retrieve){moveToInventory(retrieve.dataset.retrieveItem);return}
    const target=e.target.closest('[data-tab-target]');if(target){forceTab(target.dataset.tabTarget);return}
    const tab=e.target.closest('.cyrex-tabs button[data-tab]');if(tab){setTimeout(()=>{validateNav();if(tab.dataset.tab==='safehouse')renderHouseGrid()},30)}
  });
  setTimeout(()=>{validateNav();renderHouseGrid()},350);
})();
