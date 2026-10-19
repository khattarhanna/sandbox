/* Continuous handoff: welcome lighting and typography dissolve as the assembly
   stage scrolls into the same pinned environment. No forced scroll or sections snaps. */
(() => {
  const scene=document.getElementById('mz-experience-scene');
  const welcome=document.getElementById('mz-welcome');
  const assembly=document.getElementById('exploded-hero');
  if(!scene||!welcome||!assembly) return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=n=>Math.max(0,Math.min(1,n));
  const easing=n=>n*n*(3-2*n);
  let scheduled=false;
  function paint(){
    scheduled=false;
    if(reduced.matches){
      scene.style.setProperty('--mz-welcome-art','1');
      scene.style.setProperty('--mz-welcome-copy','1');
      scene.style.setProperty('--mz-welcome-footer','1');
      scene.style.setProperty('--mz-assembly-entrance','1');
      return;
    }
    const viewport=Math.max(1,window.innerHeight);
    const edge=welcome.getBoundingClientRect().bottom;
    // The two sections touch: the neon portal hands off to the car as it enters.
    const p=easing(clamp((viewport*0.83-edge)/(viewport*0.75)));
    scene.style.setProperty('--mz-welcome-art',(1-0.93*p).toFixed(3));
    scene.style.setProperty('--mz-welcome-copy',(1-0.65*p).toFixed(3));
    scene.style.setProperty('--mz-welcome-footer',(1-0.48*p).toFixed(3));
    const assemblyEdge=assembly.getBoundingClientRect().top;
    const reveal=easing(clamp((viewport-assemblyEdge)/(viewport*0.88)));
    scene.style.setProperty('--mz-assembly-entrance',reveal.toFixed(3));
  }
  const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(paint);}};
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  if(reduced.addEventListener) reduced.addEventListener('change',schedule);
  paint();
})();
