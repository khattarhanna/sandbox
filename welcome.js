/* Futuristic welcome effects, paused offscreen, respecting reduced motion. */
(() => {
  const section = document.getElementById('mz-welcome');
  if (!section) return;
  const canvas = document.getElementById('mz-welcome-stars');
  const ctx = canvas && canvas.getContext('2d', { alpha: true });
  const portal = section.querySelector('.mz-welcome-portal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0, height = 0, stars = [], active = false, frame = null, previous = 0;
  let pointerX = 0, pointerY = 0;
  let shiftX = 0, shiftY = 0;
  const rand = ((seed) => () => {seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296;})(3601026);
  const resetStar = (s,initial) => {
    s.x = rand() * width;
    s.y = rand() * height;
    s.z = 0.2 + rand() * 0.8;
    s.v = 0.6 + rand() * 1.8;
    s.orange = rand() > .67;
    if(!initial) s.x = width + 10;
    return s;
  };
  function resize() {
    if(!ctx || !canvas) return;
    const rect=section.getBoundingClientRect();
    width=Math.max(1,Math.round(rect.width));
    height=Math.max(1,Math.round(rect.height));
    const ratio=Math.min(window.devicePixelRatio || 1,1.5);
    canvas.width=Math.round(width*ratio);
    canvas.height=Math.round(height*ratio);
    ctx.setTransform(ratio,0,0,ratio,0,0);
    const count=Math.min(85,Math.max(30,Math.round(width*height/13000)));
    stars=Array.from({length:count},()=>resetStar({},true));
  }
  function draw(t) {
    if(!active || reduceMotion.matches || document.hidden) {frame=null;return;}
    const dt=Math.min(40, previous ? t-previous : 16.7);
    previous=t;
    if(ctx){
      ctx.clearRect(0,0,width,height);
      for(const s of stars){
        s.x -= s.v * s.z * (dt/16.7) * .52;
        s.y += Math.sin(t*.00028+s.x*.006)*.024*(dt/16.7);
        if(s.x < -15) resetStar(s,false);
        ctx.beginPath();
        ctx.strokeStyle=s.orange ? 'rgba(255,105,52,'+(.15+s.z*.34)+')':'rgba(86,201,248,'+(.12+s.z*.26)+')';
        ctx.lineWidth=.45+s.z*.85;
        ctx.moveTo(s.x,s.y);
        ctx.lineTo(s.x+1.3+s.z*6,s.y);
        ctx.stroke();
      }
    }
    if(portal){
      const amt=Math.min(1,dt/16.7)*.047;
      shiftX+=(pointerX-shiftX)*amt;
      shiftY+=(pointerY-shiftY)*amt;
      portal.style.setProperty('--mz-shift-x',shiftX.toFixed(2)+'px');
      portal.style.setProperty('--mz-shift-y',shiftY.toFixed(2)+'px');
    }
    frame=requestAnimationFrame(draw);
  }
  function update(){
    if(active && !reduceMotion.matches && !document.hidden){
      if(!frame){previous=0;frame=requestAnimationFrame(draw);}
    }else if(frame){
      cancelAnimationFrame(frame);frame=null;
    }
  }
  if(ctx) resize();
  const observer=new IntersectionObserver((entries)=>{
    active=entries[0].isIntersecting;
    section.classList.toggle('mz-is-active',active);
    update();
  },{threshold:.03});
  observer.observe(section);
  section.addEventListener('pointermove',(event)=>{
    if(!active || reduceMotion.matches || event.pointerType==='touch') return;
    const rect=section.getBoundingClientRect();
    pointerX=((event.clientX-rect.left)/rect.width-.5)*24;
    pointerY=((event.clientY-rect.top)/rect.height-.5)*18;
  },{passive:true});
  section.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;});
  window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',update);
  if(reduceMotion.addEventListener) reduceMotion.addEventListener('change',update);
})();