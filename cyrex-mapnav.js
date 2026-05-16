(function(){
  function $(id){return document.getElementById(id)}
  function activeId(){return (typeof state!=='undefined'&&state.activeDistrict)?state.activeDistrict:'grayline'}
  let mapMode='sector';

  const sectorLocations=[
    {id:'grayline',label:'Grayline',x:'45%',y:'31%',icon:'⌖',desc:'Transit lockdown, clinics, blocks, and lower-stack trouble.'},
    {id:'dock12',label:'Dock 12',x:'64%',y:'67%',icon:'⇣',desc:'Industrial port, cargo lanes, cores, freight, and customs gates.'},
    {id:'blackrow',label:'Black Row',x:'25%',y:'71%',icon:'◆',desc:'Undercity market access. Buy, sell, vanish, or get noticed.'},
    {id:'clinic',label:'Clinic',x:'56%',y:'82%',icon:'✚',desc:'Medical quarter. Recovery, chrome work, and quiet debts.'}
  ];

  const districtLocations={
    grayline:[
      {id:'gray-clinic',label:'Clinic',x:'32%',y:'49%',icon:'✚',desc:'Patch wounds and recover health.',actions:[['Visit Clinic','visit-clinic'],['Scan Area','scan-district']]},
      {id:'gray-contracts',label:'Contracts',x:'28%',y:'36%',icon:'!',desc:'Local work, small jobs, ugly favors.',tabs:[['Open Jobs','jobs']]},
      {id:'gray-transit',label:'Transit',x:'54%',y:'62%',icon:'⌖',desc:'Locked transit artery through the district.',actions:[['Scan Transit','scan-district'],['Scavenge','scavenge-run']]},
      {id:'gray-safehouse',label:'Safehouse',x:'63%',y:'76%',icon:'⌂',desc:'Your room in the Lower Stack.',tabs:[['Enter House','safehouse']]}
    ],
    dock12:[
      {id:'dock-cargo',label:'Cargo Spine',x:'47%',y:'26%',icon:'⇣',desc:'Main cargo spine. Good for scans and courier work.',actions:[['Scan Cargo','scan-district']],tabs:[['Jobs','jobs']]},
      {id:'dock-crane',label:'Crane Yard',x:'32%',y:'39%',icon:'⚒',desc:'Scrap, freight chains, broken loaders.',actions:[['Scavenge Yard','scavenge-run'],['Scan Yard','scan-district']]},
      {id:'dock-core',label:'Core Warehouse',x:'50%',y:'52%',icon:'⚡',desc:'Power core storage and stolen industrial parts.',actions:[['Scavenge Cores','scavenge-run'],['Scan Warehouse','scan-district']]},
      {id:'dock-smuggler',label:'Smuggler Pier',x:'79%',y:'46%',icon:'▣',desc:'Black freight moves through here.',tabs:[['Market','market'],['Jobs','jobs']]},
      {id:'dock-customs',label:'Customs Gate',x:'29%',y:'62%',icon:'▨',desc:'Corporate checkpoints and search lights.',actions:[['Scan Gate','scan-district']],tabs:[['Jobs','jobs']]},
      {id:'dock-safehouse',label:'Safehouse',x:'52%',y:'83%',icon:'⌂',desc:'A hidden room near the freight lifts.',tabs:[['Enter House','safehouse']]}
    ],
    blackrow:[
      {id:'row-market',label:'Market',x:'50%',y:'48%',icon:'◆',desc:'Buy, sell, trade, and disappear.',tabs:[['Open Market','market']]},
      {id:'row-cyber',label:'Chrome Stall',x:'66%',y:'37%',icon:'◉',desc:'Body work with bad warranties.',tabs:[['Cybernetics','cybernetics']]},
      {id:'row-jobs',label:'Fixer Table',x:'35%',y:'36%',icon:'!',desc:'Contracts paid in credits and risk.',tabs:[['Jobs','jobs']]},
      {id:'row-scan',label:'Grid Echo',x:'61%',y:'72%',icon:'◎',desc:'Signal traffic and hidden data.',actions:[['Scan Echo','scan-district'],['Scavenge','scavenge-run']]}
    ],
    clinic:[
      {id:'clinic-main',label:'Clinic',x:'50%',y:'42%',icon:'✚',desc:'Patch wounds. Pay now. Owe later.',actions:[['Visit Clinic','visit-clinic']]},
      {id:'clinic-rest',label:'Recovery',x:'65%',y:'66%',icon:'☾',desc:'Rest cycle and recovery bay.',actions:[['Rest Cycle','rest-cycle']]},
      {id:'clinic-supply',label:'Supply Closet',x:'32%',y:'67%',icon:'◇',desc:'Useful supplies if nobody is watching.',actions:[['Scavenge Supplies','scavenge-run'],['Scan Closet','scan-district']]},
      {id:'clinic-work',label:'Clinic Jobs',x:'30%',y:'31%',icon:'!',desc:'Small medical delivery work.',tabs:[['Jobs','jobs']]}
    ]
  };

  function districtById(id){return DATA.districts.find(x=>x.id===id)||DATA.districts[0]}
  function mapSrc(){return mapMode==='sector'?MAPS.sector:districtById(activeId()).image}
  function mapTitle(){return mapMode==='sector'?'Sector One':districtById(activeId()).title}
  function points(){return mapMode==='sector'?sectorLocations:(districtLocations[activeId()]||[])}
  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

  function hotspot(h){
    const cls='cyrex-map-hotspot'+(h.id===activeId()?' active':'');
    const data=h.id&&mapMode==='sector'?`data-map-district="${h.id}"`:`data-map-location="${h.id}"`;
    return `<button class="${cls}" aria-label="${esc(h.label)}" title="${esc(h.label)}" style="--x:${h.x};--y:${h.y}" ${data}><span class="cyrex-map-symbol">${h.icon||'•'}</span><strong>${esc(h.label)}</strong></button>`;
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
    panel.innerHTML=`<div class="cyrex-map-location-head"><strong>${esc(loc.icon)} ${esc(loc.label)}</strong><button type="button" data-map-panel-close>×</button></div><p>${esc(loc.desc)}</p><div class="cyrex-map-location-actions">${actions}${tabs}</div>`;
    const shell=document.querySelector('.cyrex-map-shell');
    if(shell)shell.appendChild(panel);
  }

  function renderMapNav(){
    const list=$('districtList');
    if(!list||typeof MAPS==='undefined')return;
    const returnLabel=mapMode==='sector'?'EXIT MAP':'SECTOR MAP';
    list.innerHTML=`<section class="cyrex-map-shell"><button type="button" class="cyrex-map-exit" data-map-exit>${returnLabel}</button><div class="cyrex-map-title">${esc(mapTitle())}</div><div class="cyrex-map-viewport"><div class="cyrex-map-stage" style="--map-url:url('${mapSrc()}')"><div class="cyrex-map-image" aria-label="${esc(mapTitle())}"></div>${points().map(hotspot).join('')}</div></div></section>`;
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
    const district=e.target.closest('[data-map-district]');
    if(district){
      travelDistrict(district.dataset.mapDistrict);
      mapMode='district';
      if(typeof switchPanel==='function')switchPanel('district');
      renderMapNav();
      return;
    }
    const loc=e.target.closest('[data-map-location]');
    if(loc){showLocationPanel(loc.dataset.mapLocation);return}
    const close=e.target.closest('[data-map-panel-close]');
    if(close){closeLocationPanel();return}
    const action=e.target.closest('[data-map-panel-action]');
    if(action){handleAction(action.dataset.mapPanelAction);closeLocationPanel();renderMapNav();return}
    const tab=e.target.closest('[data-map-panel-tab]');
    if(tab){if(typeof switchPanel==='function')switchPanel(tab.dataset.mapPanelTab);return}
  });

  setTimeout(renderMapNav,250);
})();