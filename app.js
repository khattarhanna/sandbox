
const parts = [
 {id:'front-bumper',name:'Front Bumper',category:'Exterior',shape:'bumper'},
 {id:'headlight',name:'Headlight Assembly',category:'Lighting',shape:'headlight'},
 {id:'hood',name:'Hood',category:'Exterior',shape:'hood'},
 {id:'front-fender',name:'Front Fender',category:'Exterior',shape:'fender'},
 {id:'front-grille',name:'Front Grille',category:'Exterior',shape:'grille'},
 {id:'side-mirror',name:'Side Mirror',category:'Trim',shape:'mirror'},
 {id:'front-door',name:'Front Door',category:'Panels',shape:'door'},
 {id:'rear-door',name:'Rear Door',category:'Panels',shape:'doorRear'},
 {id:'rear-quarter',name:'Rear Quarter Panel',category:'Panels',shape:'quarter'},
 {id:'tail-light',name:'Tail Light',category:'Lighting',shape:'taillight'},
 {id:'rear-bumper',name:'Rear Bumper',category:'Exterior',shape:'bumperRear'},
 {id:'liftgate',name:'Liftgate',category:'Panels',shape:'liftgate'},
 {id:'rear-spoiler',name:'Rear Spoiler',category:'Trim',shape:'spoiler'},
 {id:'rocker-panel',name:'Rocker Panel',category:'Trim',shape:'rocker'},
 {id:'radiator-support',name:'Radiator Support',category:'Structure',shape:'radiator'}
];
const shapePaths = {
 bumper:'<path d="M25 105q22-31 53-31l28 15h68l28-15q35 0 53 31l-4 31-24 17H53l-24-17Z" fill="url(#partsteel)" stroke="#414b51" stroke-width="4"/><path d="M65 114h150l-25 25H90Z" fill="#20292c" stroke="#7d8a90" stroke-width="2"/><path d="m44 108 41 2-20 27-24-9Zm192 0-41 2 20 27 24-9Z" fill="#1e272c" stroke="#798488" stroke-width="2"/><path d="M89 86h104" stroke="#e8eaeb" stroke-width="3" opacity=".8"/>',
 bumperRear:'<path d="M19 103q33-24 65-24h112q35 0 65 24l-15 41q-17 24-55 24H90q-38 0-55-24Z" fill="url(#partsteel)" stroke="#626d72" stroke-width="4"/><path d="M67 108h146q16 18 9 31H58q-7-13 9-31Z" fill="#252c31" stroke="#bbc2c7" stroke-width="3"/><path d="M29 110 61 106M251 110l-32-4" stroke="#dee3e5" stroke-width="5"/>',
 headlight:'<path d="m20 114 170-44 69 29-32 69-162-1Z" fill="url(#partglass)" stroke="#a5adb3" stroke-width="5"/><path d="m41 124 141-39 55 20-21 36-145 11Z" fill="#12191e" stroke="#b4c1c7" stroke-width="3"/><path d="M56 128q91-45 160-23" stroke="#ebf1f2" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M77 150h123" stroke="#a8b4b9" stroke-width="3"/><circle cx="211" cy="129" r="14" fill="#dee6e8" stroke="#7b8b92" stroke-width="4"/>',
 taillight:'<path d="m46 59 142 34 43 51-71 40-120-52Z" fill="url(#partglass)" stroke="#66727b" stroke-width="5"/><path d="M61 83 177 111l26 30-45 23L58 124Z" fill="#27282c" stroke="#c1c7c8" stroke-width="3"/><path d="M69 93 173 120l13 17-31 12L73 117Z" fill="#929ba2" opacity=".86"/><path d="m66 132 85 37" stroke="#e9eded" stroke-width="5"/>',
 hood:'<path d="M65 45q74-23 148 0l45 134q-116 18-236 0Z" fill="url(#partsteel)" stroke="#858e93" stroke-width="5"/><path d="M74 64q65-24 129 0M36 172q112 12 207 0" stroke="#d4dcdf" stroke-width="3" fill="none"/><path d="M102 60 75 172M176 60l27 112" stroke="#6c797e" stroke-width="2"/>',
 fender:'<path d="M22 95Q69 37 148 49l62 45-11 96-50 0q0-77-67-76-26 2-41 34H19Z" fill="url(#partsteel)" stroke="#646d74" stroke-width="5"/><path d="M47 102q61-56 144 0M28 142q18-52 59-54" fill="none" stroke="#c5ced2" stroke-width="3"/>',
 grille:'<path d="m27 75 226 0-19 109H46Z" fill="#13191c" stroke="#828d92" stroke-width="8"/><path d="M49 95h182l-16 70H64Z" fill="url(#partmesh)" stroke="#acb5ba" stroke-width="2"/><path d="M70 100v62m28-62v62m28-62v62m28-62v62m28-62v62m28-62v62" stroke="#a0aeb5" stroke-width="4"/><path d="M34 86h210" stroke="#ecf0f0" stroke-width="3"/>',
 mirror:'<path d="m55 117 43-54q62-23 124 12l10 49-40 40-125-8Z" fill="url(#partsteel)" stroke="#7b858c" stroke-width="5"/><path d="M76 112 107 83q53-12 99 7l3 30-32 24-91-6Z" fill="url(#partglass)" stroke="#c4ccd0" stroke-width="3"/><path d="m105 154 21 35-19 10-31-41" fill="#505b60" stroke="#959fa5" stroke-width="4"/>',
 door:'<path d="M60 36q87-23 161 4l14 147q-87 10-190 0Z" fill="url(#partsteel)" stroke="#8b969b" stroke-width="5"/><path d="M76 48q67-15 127 3l5 49-139 2Z" fill="#131b20" stroke="#bec9ce" stroke-width="4"/><path d="M69 118h143M176 124h25" stroke="#b9c7ce" stroke-width="4"/><path d="M72 168h130" stroke="#56646b" stroke-width="2"/>',
 doorRear:'<path d="M44 42q65-13 159-3l25 141q-74 18-181 4Z" fill="url(#partsteel)" stroke="#8b969b" stroke-width="5"/><path d="M60 54q61-8 126-4l16 46-143 3Z" fill="#11191e" stroke="#c6d1d4" stroke-width="4"/><path d="M64 116h146M168 122h24" stroke="#b7c5ca" stroke-width="4"/><path d="m55 165 152 1" stroke="#6f7b81" stroke-width="2"/>',
 quarter:'<path d="m32 66 192-22 31 63-23 85h-39q3-66-49-68-48-2-59 68H34Z" fill="url(#partsteel)" stroke="#929da2" stroke-width="5"/><path d="M53 82 213 61M46 166q45-71 91-62" stroke="#d4dbde" stroke-width="3" fill="none"/>',
 liftgate:'<path d="M53 40q83-18 174 0l17 141q-102 23-208 0Z" fill="url(#partsteel)" stroke="#828b90" stroke-width="5"/><path d="M67 53q70-12 146 0l7 67q-77 10-159 0Z" fill="#11181b" stroke="#aebcc2" stroke-width="4"/><path d="M76 153h127" stroke="#d2dadd" stroke-width="5"/><path d="M103 171h74" stroke="#6f7b82" stroke-width="3"/>',
 spoiler:'<path d="m17 108 246-17-31 35-192 14Z" fill="url(#partsteel)" stroke="#8b959a" stroke-width="5"/><path d="m56 144-7 40 32-2 10-46m106-6 9 49 32-3-9-52" fill="#545e63" stroke="#9fa9ad" stroke-width="3"/><path d="m40 114 191-12" stroke="#ecf0f2" stroke-width="3"/>',
 rocker:'<path d="m23 101 234-17-18 37-193 28Z" fill="url(#partsteel)" stroke="#757f84" stroke-width="5"/><path d="m40 111 190-15" stroke="#e0e5e7" stroke-width="3"/><path d="m66 128 141-16" stroke="#6b767b" stroke-width="2"/>',
 radiator:'<path d="M57 34h164v153H57z" fill="#161e22" stroke="#929da2" stroke-width="8"/><path d="M69 47h141v127H69z" fill="url(#partmesh)" stroke="#c4cdd0" stroke-width="2"/><path d="M78 55v115m16-115v115m16-115v115m16-115v115m16-115v115m16-115v115m16-115v115m16-115v115" stroke="#737e84" stroke-width="3"/><path d="M34 43h23m164 0h26M34 177h23m164 0h26" stroke="#bec7cc" stroke-width="8"/>'
};
function partArt(shape,id) {
 const safe = id.replace(/[^a-z0-9-]/g,'');
 const art = shapePaths[shape] || shapePaths.bumper;
 return `<svg viewBox="0 0 280 220" role="img" aria-label="Illustrative component drawing"><defs>
 <linearGradient id="partsteel-${safe}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e6e8e9"/><stop offset=".25" stop-color="#77858d"/><stop offset=".52" stop-color="#c8cfd2"/><stop offset=".8" stop-color="#536068"/><stop offset="1" stop-color="#cdd1d3"/></linearGradient>
 <linearGradient id="partglass-${safe}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#647783"/><stop offset=".4" stop-color="#11191e"/><stop offset="1" stop-color="#d8e1e5"/></linearGradient>
 <pattern id="partmesh-${safe}" patternUnits="userSpaceOnUse" width="9" height="9"><path d="m0 0 9 9m0-9L0 9" fill="none" stroke="#9ea9af" stroke-width="1.4"/></pattern>
 </defs><g transform="translate(0 -4)" style="--unused:0">${art.replaceAll('url(#partsteel)',`url(#partsteel-${safe})`).replaceAll('url(#partglass)',`url(#partglass-${safe})`).replaceAll('url(#partmesh)',`url(#partmesh-${safe})`)}</g></svg>`;
}
(() => {
 const grid=document.getElementById('products-grid');
 const search=document.getElementById('product-search');
 const counter=document.getElementById('catalog-count');
 const result=document.getElementById('result-message');
 const empty=document.getElementById('no-results');
 const chips=[...document.querySelectorAll('[data-filter]')];
 const overlay=document.getElementById('drawer-overlay');
 const drawer=document.getElementById('cart-drawer');
 const cartOpen=document.getElementById('cart-open');
 const cartClose=document.getElementById('cart-close');
 const cartBody=document.getElementById('drawer-body');
 const cartCount=document.getElementById('cart-count');
 const toast=document.getElementById('toast');
 const storageKey='motorzone-preview-parts-list-v1';
 let selection=[];
 try { const parsed=JSON.parse(localStorage.getItem(storageKey)||'[]'); if(Array.isArray(parsed)) selection=[...new Set(parsed.filter(id=>parts.some(p=>p.id===id)))]; } catch (_) {}
 let active='All';
 let oldFocus=null;
 let toastTimeout=0;
 function notify(message) {
   toast.textContent=message;
   toast.classList.add('show');
   clearTimeout(toastTimeout);
   toastTimeout=setTimeout(()=>toast.classList.remove('show'),3100);
 }
 function persist(){try{localStorage.setItem(storageKey,JSON.stringify(selection));}catch(_){}}
 function syncCount(){cartCount.textContent=selection.length;cartCount.classList.toggle('active',selection.length>0);}
 function render() {
   const term=search.value.trim().toLocaleLowerCase();
   const visible=parts.filter(part=>(active==='All'||active===part.category) && (part.name+' '+part.category+' Hyundai Kona body parts').toLocaleLowerCase().includes(term));
   grid.innerHTML=visible.map((part,index)=>`<article class="product-card">
   <div class="product-image"><span class="product-index">${String(index+1).padStart(2,'0')} / 15</span><span class="label-preview">ILLUSTRATION</span>${partArt(part.shape,part.id)}</div>
   <div class="product-details"><span class="tag">HYUNDAI KONA · SAMPLE</span><h3>${part.name}</h3><p>Confirm model year and exact fitment before ordering.</p>
   <div class="product-action"><span>Price on request</span><button class="add-btn" type="button" data-add="${part.id}" ${selection.includes(part.id)?'disabled':''} aria-label="${selection.includes(part.id)?'Added':'Add '+part.name+' to parts list'}">${selection.includes(part.id)?'Added ✓':'Add to list +'}</button></div></div></article>`).join('');
   empty.hidden=visible.length!==0;
   counter.textContent='('+visible.length+')';
   result.textContent=visible.length+' illustrated catalog '+(visible.length===1?'example':'examples')+' shown · not live inventory';
 }
 function setFilter(value) {
   active=value;
   chips.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.filter===value)));
   render();
 }
 chips.forEach(btn=>btn.addEventListener('click',()=>setFilter(btn.dataset.filter)));
 document.querySelectorAll('[data-jumpcat]').forEach(btn=>btn.addEventListener('click',()=>{setFilter(btn.dataset.jumpcat);document.getElementById('products').scrollIntoView({behavior:'smooth',block:'start'});}));
 search.addEventListener('input',render);
 grid.addEventListener('click',event=>{
   const button=event.target.closest('[data-add]'); if(!button)return;
   const id=button.dataset.add;
   const found=parts.find(p=>p.id===id);if(!found||selection.includes(id))return;
   selection.push(id);persist();syncCount();render();renderDrawer();notify(found.name+' added to your parts list');
 });
 function renderDrawer(){
   if(!selection.length){cartBody.innerHTML='<p class="drawer-empty">Your parts list is empty. Browse the catalog preview and save any components you would like to discuss with Motorzone.</p>';}
   else {cartBody.innerHTML=selection.map((id,index)=>{const p=parts.find(item=>item.id===id);return `<div class="cart-row"><div><h3>${index+1}. ${p.name}</h3><p>Hyundai Kona example · compatibility unverified</p></div><button type="button" data-remove="${id}" aria-label="Remove ${p.name}">Remove</button></div>`;}).join('');}
   document.getElementById('copy-request').disabled=selection.length===0;
 }
 function openDrawer(){
  oldFocus=document.activeElement;
  overlay.hidden=false;
  requestAnimationFrame(()=>overlay.classList.add('visible'));
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden','false');
  document.body.classList.add('drawer-open');
  renderDrawer();cartClose.focus();
 }
 function closeDrawer(){
  overlay.classList.remove('visible');
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden','true');
  document.body.classList.remove('drawer-open');
  setTimeout(()=>{if(!drawer.classList.contains('open'))overlay.hidden=true;},280);
  if(oldFocus&&oldFocus.focus)oldFocus.focus();
 }
 cartOpen.addEventListener('click',openDrawer);cartClose.addEventListener('click',closeDrawer);
 document.getElementById('cta-list-open').addEventListener('click',openDrawer);
 overlay.addEventListener('click',closeDrawer);
 drawer.addEventListener('keydown',e=>{
   if(e.key==='Escape'){closeDrawer();return;}
   if(e.key!=='Tab')return;
   const focusables=[...drawer.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled)')];
   const first=focusables[0],last=focusables[focusables.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 });
 cartBody.addEventListener('click',e=>{
   const button=e.target.closest('[data-remove]');if(!button)return;
   selection=selection.filter(id=>id!==button.dataset.remove);persist();syncCount();render();renderDrawer();
 });
 document.getElementById('copy-request').addEventListener('click',async()=>{
   if(!selection.length)return;
   const message='Motorzone Auto Parts — PARTS ENQUIRY (DRAFT)\nVehicle: Hyundai Kona (year/trim not specified)\n\n'+selection.map((id,i)=>{const p=parts.find(item=>item.id===id);return (i+1)+'. '+p.name;}).join('\n')+'\n\nPlease confirm availability, price, and exact vehicle compatibility.\nThis is a draft request, not an order.';
   try{
     if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(message);
     else {const field=document.createElement('textarea');field.value=message;document.body.appendChild(field);field.select();const ok=document.execCommand('copy');field.remove();if(!ok)throw new Error('copy failed');}
     notify('Parts request copied — send it through Motorzone’s official contact channel.');
     closeDrawer();
   }catch(err){notify('Unable to copy automatically. Please try a supported browser.');}
 });
 document.getElementById('header-search').addEventListener('click',()=>{
  document.getElementById('products').scrollIntoView({behavior:'smooth',block:'start'});
  setTimeout(()=>search.focus(),520);
 });
 const menu=document.getElementById('menu-toggle'),nav=document.getElementById('main-nav');
 menu.addEventListener('click',()=>{const isOpen=nav.classList.toggle('mobile-open');menu.setAttribute('aria-expanded',String(isOpen));});
 nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('mobile-open');menu.setAttribute('aria-expanded','false');}));
 const hero=document.getElementById('exploded-hero');
 const layers=[...document.querySelectorAll('#assembly [data-part]')];
 const counterText=document.getElementById('assembly-percent');
 const statusText=document.getElementById('assembly-status');
 const rail=document.getElementById('rail-inner');
 const motion=document.getElementById('motion-note');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let framePending=false;
 function drawAssembly(){
   framePending=false;
   const bounds=hero.getBoundingClientRect();
   const runway=Math.max(1,hero.offsetHeight-window.innerHeight);
   const raw=Math.max(0,Math.min(1,-bounds.top/runway));
   const progress=reduced.matches?1:raw;
   const eased=progress<.5?2*progress*progress:1-Math.pow(-2*progress+2,2)/2;
   for(const layer of layers){
     const dx=Number(layer.dataset.x)||0,dy=Number(layer.dataset.y)||0,rot=Number(layer.dataset.r)||0;
     const cx=Number(layer.dataset.cx)||550,cy=Number(layer.dataset.cy)||300;
     const left=1-eased;
     layer.setAttribute('transform','translate('+(dx*left).toFixed(2)+' '+(dy*left).toFixed(2)+') rotate('+(rot*left).toFixed(2)+' '+cx+' '+cy+')');
     layer.setAttribute('opacity',(0.84+eased*.16).toFixed(2));
   }
   counterText.textContent=String(Math.round(progress*100)).padStart(2,'0')+'%';
   rail.style.width=(progress*100).toFixed(1)+'%';
   statusText.textContent=progress>.96?'Assembly complete':progress>.1?'Components aligning':'Components separated';
   motion.textContent=progress>.96?'Ready to explore the collection.':'Scroll to bring the components together.';
 }
 function scheduleAssembly(){if(!framePending){framePending=true;requestAnimationFrame(drawAssembly);}}
 window.addEventListener('scroll',scheduleAssembly,{passive:true});
 window.addEventListener('resize',scheduleAssembly,{passive:true});
 if(reduced.addEventListener)reduced.addEventListener('change',scheduleAssembly);
 render();renderDrawer();syncCount();drawAssembly();
})();
