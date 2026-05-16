(function(){
  function $(id){return document.getElementById(id)}
  function activeId(){return (typeof state!=='undefined'&&state.activeDistrict)?state.activeDistrict:'grayline'}
  let mapMode='sector';
  const districtZones=[
    {id:'grayline',label:'Grayline',x:'45%',y:'29%'},
    {id:'dock12',label:'Dock 12',x:'30%',y:'70%'},
    {id:'blackrow',label:'Market Row',x:'67%',y:'61%'},
    {id:'clinic',label:'Clinic',x:'66%',y:'36%'}
  ];
  const districtActions={
    grayline:[{label:'Scavenge',action:'scavenge-run',x:'37%',y:'56%'},{label:'Scan',action:'scan-district',x:'59%',y:'36%'},{label:'Clinic',action:'visit-clinic',x:'67%',y:'70%'},{label:'Jobs',tab:'jobs',x:'29%',y:'28%'}],
    dock12:[{label:'Scavenge',action:'scavenge-run',x:'34%',y:'48%'},{label:'Scan',action:'scan-district',x:'65%',y:'34%'},{label:'Market',tab:'market',x:'61%',y:'68%'},{label:'Jobs',tab:'jobs',x:'28%',y:'74%'}],
    blackrow:[{label:'Market',tab:'market',x:'50%',y:'50%'},{label:'Cyber',tab:'cybernetics',x:'68%',y:'36%'},{label:'Jobs',tab:'jobs',x:'32%',y:'34%'},{label:'Scan',action:'scan-district',x:'64%',y:'73%'}],
    clinic:[{label:'Clinic',action:'visit-clinic',x:'50%',y:'42%'},{label:'Rest',action:'rest-cycle',x:'67%',y:'67%'},{label:'Scavenge',action:'scavenge-run',x:'32%',y:'67%'},{label:'Jobs',tab:'jobs',x:'30%',y:'31%'}]
  };
  function districtById(id){return DATA.districts.find(x=>x.id===id)||DATA.districts[0]}
  function mapSrc(){return mapMode==='sector'?MAPS.sector:districtById(activeId()).image}
  function mapTitle(){return mapMode==='sector'?'Sector One Overview':districtById(activeId()).title}
  function mapSubtitle(){return mapMode==='sector'?'Tap a district marker. Drag inside the map window to pan.':districtById(activeId()).status+' · tap a local marker to act. Drag inside the map window to pan.'}
  function hotspot(h){let cls=h.warn?'cyrex-map-hotspot warn':'cyrex-map-hotspot';let active=h.id&&h.id===activeId()?' active':'';return `<button class="${cls}${active}" style="--x:${h.x};--y:${h.y}" ${h.id?`data-map-district="${h.id}"`:''} ${h.action?`data-map-action="${h.action}"`:''} ${h.tab?`data-map-tab="${h.tab}"`:''}><strong>${h.label}</strong></button>`}
  function centerViewport(){
    const view=document.querySelector('.cyrex-map-viewport');
    const stage=document.querySelector('.cyrex-map-stage');
    if(!view||!stage)return;
    setTimeout(function(){view.scrollLeft=Math.max(0,(stage.scrollWidth-view.clientWidth)/2);view.scrollTop=Math.max(0,(stage.scrollHeight-view.clientHeight)/2);},30);
  }
  function renderMapNav(){
    const list=$('districtList'); if(!list||typeof MAPS==='undefined')return;
    const points=mapMode==='sector'?districtZones:(districtActions[activeId()]||[]);
    list.innerHTML=`<section class="cyrex-map-shell"><div class="cyrex-map-toolbar"><div><strong>${mapTitle()}</strong><span>${mapSubtitle()}</span></div><button type="button" data-map-mode="sector">Sector</button></div><div class="cyrex-map-viewport"><div class="cyrex-map-stage"><img src="${mapSrc()}" alt="${mapTitle()}" draggable="false">${points.map(hotspot).join('')}</div></div><div class="cyrex-map-note">Map labels and instructions stay in this panel. Only the framed map area pans.</div>${mapMode==='sector'?'':`<div class="cyrex-map-actions"><button type="button" data-map-mode="sector">Sector Overview</button><button type="button" data-map-mode="district">Current District</button></div>`}</section>`;
    centerViewport();
  }
  const oldRenderAll=window.renderAll||renderAll;
  window.renderAll=function(){oldRenderAll();renderMapNav()};
  document.addEventListener('click',function(e){
    const mode=e.target.closest('[data-map-mode]');
    if(mode){mapMode=mode.dataset.mapMode;renderMapNav();return}
    const district=e.target.closest('[data-map-district]');
    if(district){travelDistrict(district.dataset.mapDistrict);mapMode='district';switchPanel('district');renderMapNav();return}
    const action=e.target.closest('[data-map-action]');
    if(action){handleAction(action.dataset.mapAction);renderMapNav();return}
    const tab=e.target.closest('[data-map-tab]');
    if(tab){switchPanel(tab.dataset.mapTab);return}
  });
  setTimeout(renderMapNav,250);
})();