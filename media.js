/* Motorzone: genuinely independent photographic parts, derived from the same assembled perspective. */
(() => {
  const hero = document.querySelector('.hero-canvas');
  const zone = document.getElementById('exploded-hero');
  if (!hero || !zone) return;
  const pieces = [{"name":"hood","path":"assembly-hood.webp","motion":[-95,-275,-10,1.05],"center":[422,266]},{"name":"grille","path":"assembly-grille.webp","motion":[-305,40,-13,1.04],"center":[269,387]},{"name":"front-bumper","path":"assembly-front-bumper.webp","motion":[-390,182,15,1.12],"center":[322,469]},{"name":"left-drl","path":"assembly-left-drl.webp","motion":[-320,-105,-26,1.18],"center":[171,300]},{"name":"right-drl","path":"assembly-right-drl.webp","motion":[135,-225,18,1.12],"center":[501,319]},{"name":"fog-headlight","path":"assembly-fog-headlight.webp","motion":[-290,142,19,1.08],"center":[497,408]},{"name":"front-fender","path":"assembly-front-fender.webp","motion":[40,-212,16,1.08],"center":[687,342]},{"name":"front-wheel","path":"assembly-front-wheel.webp","motion":[-205,255,-38,1.09],"center":[653,482]},{"name":"mirror","path":"assembly-mirror.webp","motion":[270,-265,45,1.15],"center":[814,221]},{"name":"front-door","path":"assembly-front-door.webp","motion":[260,145,17,1.09],"center":[843,345]},{"name":"rear-door","path":"assembly-rear-door.webp","motion":[410,-120,-17,1.07],"center":[997,321]},{"name":"rear-quarter","path":"assembly-rear-quarter.webp","motion":[305,-142,14,1.08],"center":[1083,290]},{"name":"rear-tail-light","path":"assembly-rear-tail-light.webp","motion":[398,-230,22,1.18],"center":[1108,222]},{"name":"rear-wheel","path":"assembly-rear-wheel.webp","motion":[320,245,28,1.08],"center":[1093,433]},{"name":"roof-rack","path":"assembly-roof-rack.webp","motion":[-20,-318,-5,1.08],"center":[755,99]}];
  const asset = filename => '/assets/' + filename;
  hero.replaceChildren();
  hero.className = 'hero-canvas mz-photographic-assembly';
  const group = document.createElement('div');
  group.className = 'mz-parts-group';
  group.setAttribute('aria-label', 'Scroll-controlled assembly of fifteen independently moving Kona exterior components');
  hero.append(group);
  for (const part of pieces) {
    const pic = document.createElement('img');
    pic.className = 'mz-car-piece';
    pic.src = asset(part.path);
    pic.alt = '';
    pic.setAttribute('aria-hidden', 'true');
    pic.decoding = 'async';
    pic.loading = 'eager';
    pic.dataset.part = part.name;
    pic.style.transformOrigin = part.center[0] / 1280 * 100 + '% ' + part.center[1] / 720 * 100 + '%';
    group.append(pic);
    part.el = pic;
  }
  const final = document.createElement('img');
  final.className = 'mz-final-car';
  final.src = asset('kona-final-assembled.webp');
  final.alt = 'Photorealistic AI concept of a complete lime-green Hyundai Kona-style SUV, fully assembled.';
  final.fetchPriority = 'high';
  final.decoding = 'async';
  hero.append(final);
  const percent = document.getElementById('assembly-percent');
  const rail = document.getElementById('rail-inner');
  const cue = document.getElementById('motion-note');
  const status = document.getElementById('assembly-status');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // One animation owner. Damp scroll input for a fluid, frame-rate-independent response.
  const clamp = n => Math.min(1, Math.max(0, n));
  const ease = t => t * t * (3 - 2 * t);
  const range = (p, from, to) => clamp((p - from) / (to - from));
  let target = 0;
  let current = 0;
  let animating = false;
  let lastFrameTime = 0;
  function paint(p){
    const stageWidth = hero.getBoundingClientRect().width;
    const multiplier = Math.min(1, stageWidth / 1280);
    const mobileFactor = window.innerWidth < 680 ? .78 : 1;
    pieces.forEach((part, i) => {
      // Compact stagger; parts individually travel and finish before the complete car appears.
      const start = Math.min(.105, i * .007);
      const t = ease(range(p, start, .85));
      const leftover = 1 - t;
      const [x,y,rotation,scale] = part.motion;
      part.el.style.transform = `translate3d(${(x*multiplier*mobileFactor*leftover).toFixed(2)}px, ${(y*multiplier*mobileFactor*leftover).toFixed(2)}px, 0) rotate(${(rotation*leftover).toFixed(2)}deg) scale(${(1+(scale-1)*leftover).toFixed(4)})`;
    });
    // Pure black behind independent parts; crossfade only once the layers have docked.
    const reveal = ease(range(p, .87, .985));
    group.style.opacity = String(1 - reveal);
    final.style.opacity = String(reveal);
    if(percent) percent.textContent = String(Math.round(p*100)).padStart(2,'0') + '%';
    if(rail) rail.style.width = (p*100).toFixed(2) + '%';
    if(status) status.textContent = p > .985 ? 'FULLY ASSEMBLED · HYUNDAI KONA CONCEPT' : '15 INDEPENDENT COMPONENTS';
    if(cue) cue.textContent = p > .985 ? 'Assembly complete. Explore the parts collection.' : 'Scroll to assemble the Kona, part by part.';
  }
  function updateTarget() {
    const distance = Math.max(1, zone.offsetHeight - window.innerHeight);
    target = reduced.matches ? 1 : clamp(-zone.getBoundingClientRect().top / distance);
    if(!animating) {
      animating = true;
      lastFrameTime = 0;
      requestAnimationFrame(frame);
    }
  }
  function frame(now) {
    const elapsed = lastFrameTime ? Math.min(64, now - lastFrameTime) : 16.7;
    lastFrameTime = now;
    // Exponential smoothing: responsive yet soft at 60/120 Hz and on touch scroll.
    const blend = reduced.matches ? 1 : 1 - Math.exp(-elapsed / 130);
    current += (target - current) * blend;
    if(Math.abs(target - current) < .00035) current = target;
    paint(current);
    if(current !== target) {
      requestAnimationFrame(frame);
    } else {
      animating = false;
      lastFrameTime = 0;
    }
  }
  window.addEventListener('scroll',updateTarget,{passive:true});
  window.addEventListener('resize',updateTarget,{passive:true});
  if(reduced.addEventListener) reduced.addEventListener('change',updateTarget);
  updateTarget();
  // Maintain photorealistic catalog images from the previous media update.
  const images = {
    'front-bumper':'hyundai-kona-front-bumper.webp',
    'headlight':'hyundai-kona-headlight.webp',
    'hood':'hyundai-kona-hood.webp',
    'front-fender':'hyundai-kona-front-fender.webp',
    'front-grille':'hyundai-kona-front-grille.webp',
    'side-mirror':'hyundai-kona-side-mirror.webp',
    'front-door':'hyundai-kona-front-door.webp',
    'rear-door':'hyundai-kona-rear-door.webp',
    'tail-light':'hyundai-kona-tail-light.webp'
  };
  const grid = document.getElementById('products-grid');
  if(grid){
    let updating=false;
    function updateCards(){
      if(updating)return;
      updating=true;
      for(const button of grid.querySelectorAll('[data-add]')){
        const filename=images[button.dataset.add];
        if(!filename)continue;
        const box=button.closest('.product-card')?.querySelector('.product-image');
        if(!box||box.querySelector('.motorzone-product-image'))continue;
        box.querySelector('svg')?.remove();
        const img=document.createElement('img');
        img.className='motorzone-product-image';
        img.src=asset(filename);
        img.alt='AI-generated sample render of '+button.dataset.add.replaceAll('-',' ')+'; verify exact fitment before ordering.';
        img.loading='lazy';
        img.decoding='async';
        box.append(img);
        box.classList.add('photo-loaded');
        const tag=box.querySelector('.label-preview');
        if(tag)tag.textContent='AI RENDER';
      }
      updating=false;
    }
    new MutationObserver(updateCards).observe(grid,{childList:true});
    updateCards();
  }
  const story=document.querySelector('.story-art svg.story-svg');
  if(story){const img=document.createElement('img');img.src=asset('hyundai-kona-headlight.webp');img.className='motorzone-story-photo';img.alt='AI-generated headlight product concept';img.loading='lazy';story.replaceWith(img);}
})();