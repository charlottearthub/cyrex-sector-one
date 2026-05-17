(function(){
  function qsa(s){return Array.from(document.querySelectorAll(s))}
  function safeState(){return typeof state!=='undefined'?state:null}
  function ensureStorage(){const s=safeState();if(!s)return{};if(!s.safehouseStorage)s.safehouseStorage={};return s.safehouseStorage}
  function ensureLayout(){const s=safeState();if(!s)return{};if(!s.safehouseLayout)s.safehouseLayout={};return s.safehouseLayout}
  function defaultSlot(id,fallback){const layout=ensureLayout();return Number.isInteger(layout[id])?layout[id]:fallback}
  function setSlot(id,slot){const layout=ensureLayout();layout[id]=slot;if(typeof save==='function')save(false)}
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
    return base.map(item=>({...item,slot:defaultSlot(item.id,item.slot)}));
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
      html=panelTemplate('Breaker',`<p>Weak power. Enough to keep the room lit. Later this can run utilities, defenses, and automated crafting.</p><div class="cyrex-house-status-row"><span>Power</span><strong>Unstable</strong></div><div class="cyrex-house-status-row"><span>Grid Noise</span><strong>High</strong></div><div class="cyrex-house-service-actions"><button data-house-action="power-cycle">Power Cycle</button></div>`);
    }else if(type==='locker'){
      const inv=invEntries();const stored=storeEntries();
      html=panelTemplate('Wall Locker',`<p>Store or retrieve materials. This is the first pass of safehouse storage.</p><h4>Inventory</h4><div class="cyrex-house-storage-list">${inv.length?inv.map(([k,v])=>`<button data-store-item="${k}">${itemLabel(k)} <span>x${v}</span></button>`).join(''):'<em>Inventory empty.</em>'}</div><h4>Locker</h4><div class="cyrex-house-storage-list">${stored.length?stored.map(([k,v])=>`<button data-retrieve-item="${k}">${itemLabel(k)} <span>x${v}</span></button>`).join(''):'<em>Locker empty.</em>'}</div>`);
    }else if(type==='workbench'){
      html=panelTemplate('Workbench',`<p>Use the workbench to craft parts, medical supplies, and utility gear.</p><div class="cyrex-house-service-actions"><button data-house-action="crafting">Open Crafting</button><button data-house-action="quick-scrap">Break Down Scrap</button></div>`);
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
    if(action==='map'){if(typeof switchPanel==='function')switchPanel('district');return}
    if(action==='district'){if(typeof switchPanel==='function')switchPanel('district');return}
    if(action==='crafting'){if(typeof switchPanel==='function')switchPanel('crafting');return}
    if(action==='clinic'){if(typeof handleAction==='function')handleAction('visit-clinic');return}
    if(action==='heal'){s.health=Math.min(100,(s.health||0)+20);writeLog('<strong>MED SHELF:</strong> Health recovered.');redraw();return}
    if(action==='jam'){s.heat=Math.max(0,(s.heat||0)-10);writeLog('<strong>JAMMER:</strong> Local trace reduced.');redraw();return}
    if(action==='power-cycle'){s.energy=Math.min(100,(s.energy||0)+8);writeLog('<strong>BREAKER:</strong> Power cycled. Energy recovered slightly.');redraw();return}
    if(action==='quick-scrap'){if(s.inventory&&s.inventory.scrap){addToBag(s.inventory,'scrap',-1);addToBag(s.inventory,'circuit',1);writeLog('<strong>WORKBENCH:</strong> Scrap broken down into a circuit.');redraw()}else writeLog('<span class="warning">No scrap to break down.</span>');return}
  }
  function occupiedMap(items){const m={};items.forEach(it=>{m[it.slot]=it.id});return m}
  function renderHouseGrid(){
    const target=document.getElementById('safehouseList');
    if(!target)return;
    const existing=document.getElementById('cyrexHouseGridShell');
    if(existing)existing.remove();
    const items=houseItems();
    const shell=document.createElement('section');
    shell.className='cyrex-house-shell';
    shell.id='cyrexHouseGridShell';
    const cells=Array.from({length:16},(_,i)=>`<button class="cyrex-house-cell" type="button" data-house-slot="${i}" aria-label="Empty floor slot"></button>`).join('');
    shell.innerHTML=`<div class="cyrex-house-head"><strong>Lower Stack Room</strong><span>Tap objects to use them. Drag objects to rearrange the room.</span></div><div class="cyrex-house-stage"><div class="cyrex-house-grid">${cells}<div class="cyrex-house-player"></div></div></div><div class="cyrex-house-options"><button type="button" data-tab-target="safehouse">Install Upgrades</button><button type="button" data-house-action="rest">Rest Cycle</button></div>`;
    target.parentNode.insertBefore(shell,target);
    items.forEach(item=>{
      const cell=shell.querySelector(`[data-house-slot="${item.slot}"]`);
      if(!cell)return;
      cell.setAttribute('data-house-object',item.type);
      cell.setAttribute('data-house-item-id',item.id);
      cell.setAttribute('draggable','true');
      cell.setAttribute('aria-label',item.name);
      const div=document.createElement('div');
      div.className='cyrex-house-item';
      div.innerHTML=`<div><strong>${item.name}</strong><span>${item.sub}</span></div>`;
      cell.appendChild(div);
    });
  }
  function cellFromPoint(x,y){return document.elementFromPoint(x,y)?.closest?.('[data-house-slot]')||null}
  function moveHouseItem(itemId,toSlot){
    const items=houseItems();
    const moving=items.find(i=>i.id===itemId);if(!moving)return;
    const targetSlot=parseInt(toSlot,10);if(Number.isNaN(targetSlot))return;
    const occupied=occupiedMap(items);
    const otherId=occupied[targetSlot];
    if(otherId&&otherId!==itemId)setSlot(otherId,moving.slot);
    setSlot(itemId,targetSlot);
    writeLog('<strong>ROOM:</strong> Moved '+moving.name+'.');
    renderHouseGrid();
  }
  let dragState=null;
  function beginDrag(cell,ev){
    if(!cell||!cell.dataset.houseItemId)return;
    dragState={id:cell.dataset.houseItemId,startSlot:cell.dataset.houseSlot,startX:ev.clientX,startY:ev.clientY,moved:false};
    cell.classList.add('is-dragging');
  }
  function moveDrag(ev){
    if(!dragState)return;
    const dx=Math.abs(ev.clientX-dragState.startX),dy=Math.abs(ev.clientY-dragState.startY);
    if(dx>8||dy>8)dragState.moved=true;
    qsa('.cyrex-house-cell.is-drop-target').forEach(c=>c.classList.remove('is-drop-target'));
    const cell=cellFromPoint(ev.clientX,ev.clientY);
    if(cell)cell.classList.add('is-drop-target');
  }
  function endDrag(ev){
    if(!dragState)return false;
    qsa('.cyrex-house-cell.is-dragging,.cyrex-house-cell.is-drop-target').forEach(c=>c.classList.remove('is-dragging','is-drop-target'));
    const drop=cellFromPoint(ev.clientX,ev.clientY);
    const wasDrag=dragState.moved;
    if(wasDrag&&drop)moveHouseItem(dragState.id,drop.dataset.houseSlot);
    dragState=null;
    return wasDrag;
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
  document.addEventListener('pointerdown',function(e){const cell=e.target.closest('[data-house-object]');if(cell){beginDrag(cell,e);try{cell.setPointerCapture(e.pointerId)}catch(err){}}});
  document.addEventListener('pointermove',function(e){if(dragState){e.preventDefault();moveDrag(e)}});
  document.addEventListener('pointerup',function(e){if(dragState){const dragged=endDrag(e);if(dragged){e.preventDefault();e.stopPropagation();}}},true);
  document.addEventListener('dragstart',function(e){const cell=e.target.closest('[data-house-object]');if(cell){e.dataTransfer.setData('text/plain',cell.dataset.houseItemId);cell.classList.add('is-dragging')}});
  document.addEventListener('dragover',function(e){const cell=e.target.closest('[data-house-slot]');if(cell){e.preventDefault();cell.classList.add('is-drop-target')}});
  document.addEventListener('dragleave',function(e){const cell=e.target.closest('[data-house-slot]');if(cell)cell.classList.remove('is-drop-target')});
  document.addEventListener('drop',function(e){const cell=e.target.closest('[data-house-slot]');if(cell){e.preventDefault();moveHouseItem(e.dataTransfer.getData('text/plain'),cell.dataset.houseSlot);qsa('.cyrex-house-cell.is-dragging,.cyrex-house-cell.is-drop-target').forEach(c=>c.classList.remove('is-dragging','is-drop-target'))}});
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