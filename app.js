(() => {
  const input = document.getElementById('category-search');
  const cards = [...document.querySelectorAll('.category-card')];
  const counter = document.getElementById('results-count');
  const empty = document.getElementById('empty-results');
  if (!input || !counter || !empty) return;
  function filterCategories() {
    const query = input.value.trim().toLocaleLowerCase();
    let visible = 0;
    for (const card of cards) {
      const matches = (card.dataset.search + ' ' + card.textContent).toLocaleLowerCase().includes(query);
      card.hidden = !matches;
      card.style.display = matches ? '' : 'none';
      if (matches) visible++;
    }
    counter.textContent = String(visible).padStart(2, '0') + ' ' + (visible === 1 ? 'CATEGORY' : 'CATEGORIES');
    empty.hidden = visible !== 0;
  }
  input.addEventListener('input', filterCategories);
})();