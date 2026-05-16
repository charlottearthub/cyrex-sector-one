(function(){
  function qs(s){return document.querySelector(s)}
  function qsa(s){return Array.from(document.querySelectorAll(s))}
  function safeState(){return typeof state!=='undefined'?state:null}
  function houseItems(){
    const s=safeState();
    const upgrades=s&&Array.isArray(s.safehouseUpgrades)?s.safehouseUpgrades:[];
    const base=[{id:'bed',name:'Cot',sub:'Rest',slot:13},{id:'door',name:'Door',sub:'Exit',slot:4},{id:'power',name:'Breaker',sub:'Weak Power',slot:8}];
    const upgradeMap={locker:{name:'Wall Locker',sub:'Storage',slot:1},workbench:{name:'Workbench',sub:'Craft',slot:6},medshelf:{name:'Med Shelf',sub:'Heal',slot:10},jammer:{name:'Signal Jammer',sub:'Heat -',slot:15}};
    upgrades.forEach(id=>{if(upgradeMap[id])base.push({id,...upgradeMap[id]})});
    return base;
  }
  function renderHouseGrid(){
    const target=document.getElementById('safehouseList');
    if(!target)return;
    const existing=document.getElementById('cyrexHouseGridShell');
    if(existing)existing.remove();
    const shell=document.createElement('section');
    shell.className='cyrex-house-shell';
    shell.id='cyrexHouseGridShell';
    const cells=Array.from({length:16},(_,i)=>`<div class="cyrex-house-cell" data-house-slot="${i}"></div>`).join('');
    shell.innerHTML=`<div class="cyrex-house-head"><strong>Lower Stack Room</strong><span>A small 2D safehouse grid. Installed upgrades populate into the room.</span></div><div class="cyrex-house-stage"><div class="cyrex-house-grid">${cells}<div class="cyrex-house-player"></div></div></div><div class="cyrex-house-options"><button type="button" data-tab-target="safehouse">Install Upgrades</button><button type="button" data-action="rest-cycle">Rest Cycle</button></div>`;
    target.parentNode.insertBefore(shell,target);
    houseItems().forEach(item=>{
      const cell=shell.querySelector(`[data-house-slot="${item.slot}"]`);
      if(!cell)return;
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
  function forceTab(tab){
    const panel=document.querySelector(`.cyrex-panel[data-panel="${tab}"]`);
    if(!panel)return;
    if(typeof switchPanel==='function')switchPanel(tab);
    if(tab==='safehouse')setTimeout(renderHouseGrid,30);
  }
  const oldRenderAll=window.renderAll||null;
  if(oldRenderAll){
    window.renderAll=function(){oldRenderAll();validateNav();renderHouseGrid()};
  }
  document.addEventListener('click',function(e){
    const target=e.target.closest('[data-tab-target]');
    if(target){forceTab(target.dataset.tabTarget);return}
    const tab=e.target.closest('.cyrex-tabs button[data-tab]');
    if(tab){setTimeout(()=>{validateNav();if(tab.dataset.tab==='safehouse')renderHouseGrid()},30)}
  });
  setTimeout(()=>{validateNav();renderHouseGrid()},350);
})();
