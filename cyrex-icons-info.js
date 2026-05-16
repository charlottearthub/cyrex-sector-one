(function(){
  const ICONS={portal:'▣',district:'⌖',jobs:'!',inventory:'▤',crafting:'⚙',market:'◆',safehouse:'⌂',cybernetics:'◉',cells:'✦',cot:'☾',door:'⇱',power:'⚡',locker:'▣',workbench:'⚙',medshelf:'✚',jammer:'◌',scavenge:'◇',scan:'◎',clinic:'✚',rest:'☾',map:'⌖',cyber:'◉'};
  const INFO={
    portal:['Feed','Main city feed and active district status. Use this to see what is happening right now.'],
    district:['Map','Main navigation map. Tap districts to travel or tap local points to act.'],
    jobs:['Jobs','Contracts and work. Jobs pay credits, XP, materials, heat, and reputation.'],
    inventory:['Inventory','Your carried materials and gear. Storage comes through the safehouse locker.'],
    crafting:['Crafting','Build tools, medical supplies, mods, and utility gear from materials.'],
    market:['Market','Buy and sell materials. Later this becomes the auction/player economy.'],
    safehouse:['House','Your personal room. Installed upgrades become usable objects.'],
    cybernetics:['Cybernetics','Install body upgrades. They improve ability but cost humanity and raise heat.'],
    cells:['Cells','Your standing with Free Cells, Corporate Cells, and M&P operators.'],
    cot:['Cot','Rest here. A rest cycle restores energy and some health. Deep rest restores more.'],
    door:['Door','Exit the safehouse and return to the larger district or sector map.'],
    power:['Breaker','Room power status. Later this can run utilities, defenses, and upgrades.'],
    locker:['Wall Locker','Store and retrieve materials from safehouse storage.'],
    workbench:['Workbench','Access crafting from inside your safehouse.'],
    medshelf:['Med Shelf','Recover health from safehouse medical supplies.'],
    jammer:['Signal Jammer','Reduce heat by scrambling your local trace.'],
    scavenge:['Scavenge','Search the district for materials. Costs energy and may raise heat.'],
    scan:['Scan','Update district intel. Data Runners and optic implants gain more from scans.'],
    clinic:['Clinic','Spend credits to recover health. Medics pay less.'],
    rest:['Rest','Recover energy and some health.'],
    map:['Zone Map','Open the larger navigation map.'],
    cyber:['Cybernetics','Open the cybernetic body ledger.']
  };
  let pressTimer=null,lastTarget=null,longPressed=false;
  function icon(k){return `<span class="cyrex-icon" aria-hidden="true">${ICONS[k]||'•'}</span>`}
  function showInfo(key){const data=INFO[key];if(!data)return;hideInfo();const pop=document.createElement('section');pop.className='cyrex-info-popover';pop.id='cyrexInfoPopover';pop.innerHTML=`<div class="cyrex-info-popover-head"><strong>${icon(key)}${data[0]}</strong><button type="button" data-info-close>×</button></div><p>${data[1]}</p>`;document.body.appendChild(pop)}
  function hideInfo(){const p=document.getElementById('cyrexInfoPopover');if(p)p.remove()}
  function tagElement(node,key){if(!node||node.dataset.infoKey)return;node.dataset.infoKey=key;node.classList.add('cyrex-longpress-ready')}
  function applyIcons(){
    document.querySelectorAll('.cyrex-tabs button[data-tab]').forEach(btn=>{const key=btn.dataset.tab;tagElement(btn,key);if(!btn.dataset.iconified){btn.innerHTML=`${icon(key)}<span>${btn.textContent}</span>`;btn.dataset.iconified='true'}});
    document.querySelectorAll('[data-house-object]').forEach(node=>tagElement(node,node.dataset.houseObject));
    document.querySelectorAll('[data-map-action]').forEach(node=>{let a=node.dataset.mapAction;let key=a==='scavenge-run'?'scavenge':a==='scan-district'?'scan':a==='visit-clinic'?'clinic':a==='rest-cycle'?'rest':a;tagElement(node,key);if(!node.dataset.iconified){node.insertAdjacentHTML('afterbegin',icon(key));node.dataset.iconified='true'}});
    document.querySelectorAll('[data-map-tab]').forEach(node=>{let key=node.dataset.mapTab;tagElement(node,key);if(!node.dataset.iconified){node.insertAdjacentHTML('afterbegin',icon(key));node.dataset.iconified='true'}});
    document.querySelectorAll('[data-map-district]').forEach(node=>tagElement(node,'district'));
    document.querySelectorAll('[data-house-action]').forEach(node=>{let a=node.dataset.houseAction;let key=a==='deep-rest'?'rest':a==='map'?'map':a==='district'?'district':a==='crafting'?'crafting':a==='clinic'?'clinic':a==='heal'?'medshelf':a==='jam'?'jammer':a;tagElement(node,key);if(!node.dataset.iconified){node.insertAdjacentHTML('afterbegin',icon(key));node.dataset.iconified='true'}});
    document.querySelectorAll('[data-store-item],[data-retrieve-item]').forEach(node=>tagElement(node,'locker'));
    document.querySelectorAll('[data-action="rest-cycle"]').forEach(node=>tagElement(node,'rest'));
  }
  const oldRenderAll=window.renderAll||null;
  if(oldRenderAll){window.renderAll=function(){oldRenderAll();setTimeout(applyIcons,30)}}
  document.addEventListener('pointerdown',function(e){const t=e.target.closest('[data-info-key]');if(!t)return;lastTarget=t;longPressed=false;clearTimeout(pressTimer);pressTimer=setTimeout(function(){longPressed=true;showInfo(t.dataset.infoKey)},650)});
  document.addEventListener('pointerup',function(e){clearTimeout(pressTimer);setTimeout(function(){longPressed=false},80)});
  document.addEventListener('pointercancel',function(){clearTimeout(pressTimer)});
  document.addEventListener('contextmenu',function(e){const t=e.target.closest('[data-info-key]');if(!t)return;e.preventDefault();showInfo(t.dataset.infoKey)});
  document.addEventListener('click',function(e){if(e.target.closest('[data-info-close]')){hideInfo();return}if(longPressed&&lastTarget&&lastTarget.contains(e.target)){e.preventDefault();e.stopPropagation();longPressed=false}} ,true);
  setInterval(applyIcons,900);
  setTimeout(applyIcons,350);
})();
