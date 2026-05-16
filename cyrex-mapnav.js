(function(){
  function $(id){return document.getElementById(id)}
  function activeId(){return (typeof state!=='undefined'&&state.activeDistrict)?state.activeDistrict:'grayline'}
  let mapMode='sector';

  const sectorLocations=[
    {id:'grayline',label:'Grayline District',x:'50%',y:'31%',w:'48%',h:'34%',desc:'Transit lockdown, clinics, blocks, and lower-stack trouble.'},
    {id:'dock12',label:'Dock 12',x:'63%',y:'64%',w:'44%',h:'36%',desc:'Industrial port, cargo lanes, cores, freight, and customs gates.'},
    {id:'blackrow',label:'Black Market Row',x:'30%',y:'67%',w:'42%',h:'36%',desc:'Undercity market access. Buy, sell, vanish, or get noticed.'},
    {id:'clinic',label:'Clinic Quarter',x:'55%',y:'84%',w:'44%',h:'28%',desc:'Medical quarter. Recovery, chrome work, and quiet debts.'}
  ];

  const districtLocations={
    grayline:[
      {id:'gray-clinic',label:'Clinic',x:'34%',y:'48%',w:'34%',h:'22%',desc:'Patch wounds and recover health.',actions:[['Visit Clinic','visit-clinic'],['Scan Area','scan-district']]},
      {id:'gray-contracts',label:'Contracts',x:'35%',y:'34%',w:'36%',h:'22%',desc:'Local work, small jobs, ugly favors.',tabs:[['Open Jobs','jobs']]},
      {id:'gray-transit',label:'Transit Spine',x:'55%',y:'61%',w:'38%',h:'24%',desc:'Locked transit artery through the district.',actions:[['Scan Transit','scan-district'],['Scavenge','scavenge-run']]},
      {id:'gray-safehouse',label:'Housing / Safehouse',x:'60%',y:'22%',w:'40%',h:'24%',desc:'Your room in the Lower Stack.',tabs:[['Enter House','safehouse']]}
    ],
    dock12:[
      {id:'dock-cargo',label:'Cargo Spine',x:'50%',y:'25%',w:'44%',h:'22%',desc:'Main cargo spine. Good for scans and courier work.',actions:[['Scan Cargo','scan-district']],tabs:[['Jobs','jobs']]},
      {id:'dock-crane',label:'Crane Yard',x:'32%',y:'39%',w:'38%',h:'22%',desc:'Scrap, freight chains, broken loaders.',actions:[['Scavenge Yard','scavenge-run'],['Scan Yard','scan-district']]},
      {id:'dock-core',label:'Power Core Warehouse',x:'50%',y:'52%',w:'48%',h:'24%',desc:'Power core storage and stolen industrial parts.',actions:[['Scavenge Cores','scavenge-run'],['Scan Warehouse','scan-district']]},
      {id:'dock-smuggler',label:'Smuggler Pier',x:'78%',y:'46%',w:'40%',h:'24%',desc:'Black freight moves through here.',tabs:[['Market','market'],['Jobs','jobs']]},
      {id:'dock-customs',label:'Customs Gate',x:'30%',y:'63%',w:'40%',h:'23%',desc:'Corporate checkpoints and search lights.',actions:[['Scan Gate','scan-district']],tabs:[['Jobs','jobs']]},
      {id:'dock-safehouse',label:'Safehouse',x:'52%',y:'82%',w:'40%',h:'22%',desc:'A hidden room near the freight lifts.',tabs:[['Enter House','safehouse']]}
    ],
    blackrow:[
      {id:'row-auction',label:'Auction Hall',x:'48%',y:'28%',w:'40%',h:'19%',desc:'A loud room for silent bids. Rare parts, stolen art, dead men’s gear.',tabs:[['Open Market','market']],actions:[['Scan Lots','scan-district']]},
      {id:'row-implant',label:'Implant Chop Shop',x:'80%',y:'33%',w:'40%',h:'22%',desc:'Cheap chrome. Bad anesthesia. Worse paperwork.',tabs:[['Cybernetics','cybernetics']],actions:[['Scan Shop','scan-district']]},
      {id:'row-arcade',label:'Contraband Arcade',x:'78%',y:'53%',w:'42%',h:'22%',desc:'Games, dead drops, illegal rigs, and dirty credit sinks.',tabs:[['Open Market','market'],['Jobs','jobs']]},
      {id:'row-data',label:'Data Tunnel',x:'22%',y:'69%',w:'38%',h:'21%',desc:'A hidden network crawl under the market grid.',actions:[['Scan Tunnel','scan-district'],['Scavenge Data','scavenge-run']]},
      {id:'row-ghost',label:'Ghost Stair',x:'48%',y:'70%',w:'38%',h:'22%',desc:'Old access stairs used by runners, fixers, and people who do not want cameras.',actions:[['Scavenge Stairs','scavenge-run']],tabs:[['Jobs','jobs']]},
      {id:'row-safehouse',label:'Safehouse',x:'79%',y:'80%',w:'38%',h:'21%',desc:'A hidden room off the lower market routes.',tabs:[['Enter House','safehouse']]},
      {id:'row-undercity',label:'Undercity Gate',x:'50%',y:'92%',w:'44%',h:'16%',desc:'The lower access gate. Everything gets worse below this line.',tabs:[['Jobs','jobs']],actions:[['Scan Gate','scan-district']]},
      {id:'row-den',label:'Runner Den',x:'7%',y:'48%',w:'28%',h:'32%',desc:'A half-hidden den on the left edge of the row. Runners, smugglers, and bad leads.',tabs:[['Jobs','jobs']],actions:[['Scavenge Den','scavenge-run']]}
    ],
    clinic:[
      {id:'clinic-main',label:'Clinic',x:'50%',y:'42%',w:'44%',h:'28%',desc:'Patch wounds. Pay now. Owe later.',actions:[['Visit Clinic','visit-clinic']]},
      {id:'clinic-rest',label:'Recovery Block',x:'65%',y:'66%',w:'38%',h:'24%',desc:'Rest cycle and recovery bay.',actions:[['Rest Cycle','rest-cycle']]},
      {id:'clinic-supply',label:'Supply Closet',x:'32%',y:'67%',w:'36%',h:'24%',desc:'Useful supplies if nobody is watching.',actions:[['Scavenge Supplies','scavenge-run'],['Scan Closet','scan-district']]},
      {id:'clinic-work',label:'Clinic Jobs',x:'30%',y:'31%',w:'36%',h:'24%',desc:'Small medical delivery work.',tabs:[['Jobs','jobs']]}
    ]
  };

  function districtById(id){return DATA.districts.find(x=>x.id===id)||DATA.districts[0]}
  function mapSrc(){return mapMode==='sector'?MAPS.sector:districtById(activeId()).image}
  function mapTitle(){return mapMode==='sector'?'Sector One':districtById(activeId()).title}
  function points(){return mapMode==='sector'?sectorLocations:(districtLocations[activeId()]||[])}
  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
  function pct(v){return parseFloat(String(v).replace('%',''))||0}

  function hotspot(h){
    const cls='cyrex-map-tapzone'+(h.id===activeId()?' active':'');
    const data=h.id&&mapMode==='sector'?`data-map-district="${h.id}"`:`data-map-location="${h.id}"`;
    return `<button class="${cls}" aria-label="${esc(h.label)}" title="${esc(h.label)}" style="--x:${h.x};--y:${h.y};--w:${h.w};--h:${h.h}" ${data}><span>${esc(h.label)}</span></button>`;
  }

  function closeLocationPanel(){
    const old=document.getElementById('cyrexMapLocationPanel');
    if(old)old.remove();
  }

  function showLocationPanel(id){
    const loc=(districtLocations[activeId()]||[]).find(x=>x.id===id);
    if(!loc)return;
    closeLocationPanel();
    const actions=(loc.actions||[]).map(([label,action])=>`<button type="button" data-map-panel-action="${action}">${esc(label)}</button>`).join('');
    const tabs=(loc.tabs||[]).map(([label,tab])=>`<button type="button" data-map-panel-tab="${tab}">${esc(label)}</button>`).join('');
    const panel=document.createElement('section');
    panel.className='cyrex-map-location-panel';
    panel.id='cyrexMapLocationPanel';
    panel.innerHTML=`<div class="cyrex-map-location-head"><strong>${esc(loc.label)}</strong><button type="button" data-map-panel-close>×</button></div><p>${esc(loc.desc)}</p><div class="cyrex-map-location-actions">${actions}${tabs}</div>`;
    const shell=document.querySelector('.cyrex-map-shell');
    if(shell)shell.appendChild(panel);
  }

  function activatePoint(p){
    if(!p)return;
    if(mapMode==='sector'){
      travelDistrict(p.id);
      mapMode='district';
      if(typeof switchPanel==='function')switchPanel('district');
      renderMapNav();
      return;
    }
    showLocationPanel(p.id);
  }

  function activateNearestFromEvent(e){
    if(e.target.closest('[data-map-exit], .cyrex-map-location-panel'))return false;
    const stage=document.querySelector('.cyrex-map-stage');
    if(!stage)return false;
    const rect=stage.getBoundingClientRect();
    const clientX=e.clientX ?? (e.changedTouches&&e.changedTouches[0]&&e.changedTouches[0].clientX);
    const clientY=e.clientY ?? (e.changedTouches&&e.changedTouches[0]&&e.changedTouches[0].clientY);
    if(clientX==null||clientY==null)return false;
    const x=((clientX-rect.left)/rect.width)*100;
    const y=((clientY-rect.top)/rect.height)*100;
    let best=null;
    let bestScore=999999;
    points().forEach(function(p){
      const px=pct(p.x), py=pct(p.y), hw=pct(p.w)/2, hh=pct(p.h)/2;
      const dx=Math.abs(x-px), dy=Math.abs(y-py);
      const inside=dx<=hw && dy<=hh;
      const score=(inside?0:10000)+(dx*dx)+(dy*dy);
      if(score<bestScore){best=p;bestScore=score;}
    });
    if(best){
      activatePoint(best);
      return true;
    }
    return false;
  }

  function renderMapNav(){
    const list=$('districtList');
    if(!list||typeof MAPS==='undefined')return;
    const returnLabel=mapMode==='sector'?'EXIT MAP':'SECTOR MAP';
    list.innerHTML=`<section class="cyrex-map-shell"><button type="button" class="cyrex-map-exit" data-map-exit>${returnLabel}</button><div class="cyrex-map-title">${esc(mapTitle())}</div><div class="cyrex-map-viewport"><div class="cyrex-map-stage" data-map-surface style="--map-url:url('${mapSrc()}')"><div class="cyrex-map-image" aria-label="${esc(mapTitle())}"></div>${points().map(hotspot).join('')}</div></div></section>`;
  }

  const oldRenderAll=window.renderAll||renderAll;
  window.renderAll=function(){oldRenderAll();renderMapNav()};

  document.addEventListener('click',function(e){
    const exit=e.target.closest('[data-map-exit]');
    if(exit){
      if(mapMode==='sector'){
        if(typeof switchPanel==='function')switchPanel('portal');
      }else{
        mapMode='sector';
        renderMapNav();
      }
      return;
    }
    const close=e.target.closest('[data-map-panel-close]');
    if(close){closeLocationPanel();return}
    const action=e.target.closest('[data-map-panel-action]');
    if(action){handleAction(action.dataset.mapPanelAction);closeLocationPanel();renderMapNav();return}
    const tab=e.target.closest('[data-map-panel-tab]');
    if(tab){if(typeof switchPanel==='function')switchPanel(tab.dataset.mapPanelTab);return}
    const district=e.target.closest('[data-map-district]');
    if(district){
      const p=sectorLocations.find(x=>x.id===district.dataset.mapDistrict);
      activatePoint(p);
      return;
    }
    const loc=e.target.closest('[data-map-location]');
    if(loc){
      const p=(districtLocations[activeId()]||[]).find(x=>x.id===loc.dataset.mapLocation);
      activatePoint(p);
      return;
    }
    if(e.target.closest('[data-map-surface], .cyrex-map-image, .cyrex-map-tapzone')){
      activateNearestFromEvent(e);
    }
  });

  document.addEventListener('touchend',function(e){
    if(e.target.closest('[data-map-exit], .cyrex-map-location-panel'))return;
    if(e.target.closest('[data-map-surface], .cyrex-map-image, .cyrex-map-tapzone')){
      e.preventDefault();
      activateNearestFromEvent(e);
    }
  },{passive:false});

  setTimeout(renderMapNav,250);
})();