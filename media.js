
/* Motorzone realistic imagery enhancement; the renders are illustrative, NOT validated inventory photos. */
(() => {
  const photos = Object.freeze({
    'front-bumper': 'hyundai-kona-front-bumper.webp',
    'headlight': 'hyundai-kona-headlight.webp',
    'hood': 'hyundai-kona-hood.webp',
    'front-fender': 'hyundai-kona-front-fender.webp',
    'front-grille': 'hyundai-kona-front-grille.webp',
    'side-mirror': 'hyundai-kona-side-mirror.webp',
    'front-door': 'hyundai-kona-front-door.webp',
    'rear-door': 'hyundai-kona-rear-door.webp',
    'tail-light': 'hyundai-kona-tail-light.webp'
  });
  const hero = document.querySelector('.hero-canvas');
  const scrollZone = document.getElementById('exploded-hero');
  if (hero && scrollZone) {
    const photo = document.createElement('img');
    photo.className = 'motorzone-kona-hero';
    photo.src = '/assets/hero-hyundai-kona-exploded.webp';
    photo.alt = 'AI-generated realistic exploded-view concept of a lime green Hyundai Kona-style SUV with separated front bumper, hood, doors, mirrors, rear panels, and lights.';
    photo.fetchPriority = 'high';
    photo.decoding = 'async';
    hero.replaceChildren(photo);
    hero.classList.add('motorzone-kona-canvas');
    const cue = document.getElementById('motion-note');
    const status = document.getElementById('assembly-status');
    const counter = document.getElementById('assembly-percent');
    const rail = document.getElementById('rail-inner');
    const reduced = window.matchMedia('(prefers-reduced-motion:reduce)');
    let scheduled = false;
    const frame = () => {
      scheduled = false;
      const distance = Math.max(1,scrollZone.offsetHeight - window.innerHeight);
      const progress = Math.min(1,Math.max(0,-scrollZone.getBoundingClientRect().top / distance));
      const amount = reduced.matches ? 1 : progress;
      const eased = amount * amount * (3 - 2 * amount);
      photo.style.transform = reduced.matches ? 'none' : 'translate3d(0,' + (18 - 36 * eased).toFixed(2) + 'px,0) scale(' + (1.13 - eased * .13).toFixed(3) + ')';
      if(counter) counter.textContent=String(Math.round(progress*100)).padStart(2,'0') + '%';
      if(rail) rail.style.width = (progress*100).toFixed(1)+'%';
      if(status) status.textContent = 'Hyundai Kona exploded-view concept';
      if(cue) cue.textContent = 'Scroll to examine this exploded automotive concept.';
    };
    const schedule = () => {if(!scheduled){scheduled=true;requestAnimationFrame(frame);}};
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule,{passive:true});
    if(reduced.addEventListener) reduced.addEventListener('change',schedule);
    schedule();
  }
  const grid = document.getElementById('products-grid');
  if (grid) {
    let applying = false;
    const applyProductImages = () => {
      if (applying) return;
      applying = true;
      for(const button of grid.querySelectorAll('button[data-add]')) {
        const id = button.getAttribute('data-add');
        const file = photos[id];
        if (!file) continue;
        const card = button.closest('.product-card');
        const slot = card && card.querySelector('.product-image');
        if (!slot || slot.querySelector('.motorzone-product-image'))continue;
        const drawing = slot.querySelector('svg');
        if(drawing)drawing.remove();
        const img = document.createElement('img');
        img.className='motorzone-product-image';
        img.src='/assets/'+file;
        img.alt='AI-generated photorealistic concept render of a ' + id.replaceAll('-',' ') + ' vehicle part on a dark studio background. Exact compatibility has not been verified.';
        img.loading='lazy';
        img.decoding='async';
        slot.appendChild(img);
        slot.classList.add('photo-loaded');
        const label = slot.querySelector('.label-preview');
        if(label)label.textContent='AI RENDER';
      }
      applying=false;
    };
    new MutationObserver(applyProductImages).observe(grid,{childList:true});
    applyProductImages();
  }
  const story=document.querySelector('.story-art');
  if(story){
    const illustration=story.querySelector('svg.story-svg');
    if(illustration){
      const img=document.createElement('img');
      img.src='/assets/hyundai-kona-headlight.webp';
      img.alt='AI-generated photorealistic close-up concept of a Hyundai Kona-style headlight assembly.';
      img.className='motorzone-story-photo';
      img.loading='lazy';
      img.decoding='async';
      illustration.replaceWith(img);
    }
  }
})();
