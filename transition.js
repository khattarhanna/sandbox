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


/* Mercury-inspired sectional reveal: understated fades + minimal vertical lift.
   All Motorzone content and the existing neon/Kona hero motion stay unchanged. */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !('IntersectionObserver' in window)) return;
  const groups = [
    ['.between .between-inner'],
    ['.intro .section-tag', '.intro h2', '.intro > p', '.intro .intro-icons'],
    ['.light-area .section-heading', '.light-area .category-strip',
     '.light-area .shop-tools', '.light-area .filter-chips',
     '.light-area .result-meta', '.light-area .products-grid'],
    ['.vehicle-section .vehicle-layout > div', '.vehicle-section .finder'],
    ['.story .story-art', '.story .story-copy'],
    ['.cta-band .container'],
    ['.footer .footer-content', '.footer .footer-bottom']
  ];
  const viewport = window.innerHeight;
  const pending = [];
  for (const selectors of groups) {
    selectors.forEach((selector, index) => {
      document.querySelectorAll(selector).forEach(el => {
        const rect = el.getBoundingClientRect();
        // Do not obscure content already in view, including direct hash visits.
        if (rect.top < viewport * .86 && rect.bottom > 0) return;
        el.classList.add('mz-mercury-reveal');
        el.style.setProperty('--mz-mercury-delay', Math.min(index * 55, 165) + 'ms');
        pending.push(el);
      });
    });
  }
  if (!pending.length) return;
  document.documentElement.classList.add('mz-mercury-motion');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('mz-mercury-visible');
      observer.unobserve(entry.target);
    }
  }, {threshold: 0, rootMargin: '0px 0px -7% 0px'});
  pending.forEach(el => observer.observe(el));
  // Safety: user accessibility preference may change while navigating.
  if (reduced.addEventListener) reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    pending.forEach(el => {
      el.classList.add('mz-mercury-visible');
      observer.unobserve(el);
    });
    document.documentElement.classList.remove('mz-mercury-motion');
  });
})();
