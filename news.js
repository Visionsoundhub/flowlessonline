/* ============ FLOWLESS NEWS PAGE ============ */
const REGION_LABEL = { gr: 'Ελλάδα', intl: 'Εξωτερικό' };
let ALL_POSTS = [];
let activeRegion = 'all';

function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('el-GR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function postCard(p) {
  const img = p.image
    ? `<div class="news-thumb"><img src="${p.image}" alt="" loading="lazy"></div>`
    : '';
  const tags = (p.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
  const body = (p.body || []).map(par => `<p>${par}</p>`).join('');
  const sources = (p.sources || []).length
    ? `<div class="news-sources"><span>Πηγές:</span> ${p.sources.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.name}</a>`).join(' · ')}</div>`
    : '';
  return `<article class="news-item">
    ${img}
    <div class="news-item-body">
      <div class="news-meta">
        <span class="news-region">${REGION_LABEL[p.region] || ''}</span>
        <span class="news-date">${fmtDate(p.date)}</span>
      </div>
      ${p.author ? `<p class="news-byline">Γράφει ο ${p.author}</p>` : ''}
      <h3 class="news-item-title">${p.title}</h3>
      <div class="artist-tags">${tags}</div>
      ${body}
      ${sources}
    </div>
  </article>`;
}

function renderList() {
  const box = document.getElementById('newsList');
  if (!box) return;
  const posts = ALL_POSTS.filter(p => activeRegion === 'all' || p.region === activeRegion);
  box.innerHTML = posts.length
    ? posts.map(postCard).join('')
    : '<p class="news-empty">Τίποτα ακόμα σε αυτή την κατηγορία.</p>';
}

fetch('news.json?_=' + Date.now())
  .then(r => r.json())
  .then(data => {
    ALL_POSTS = (data.posts || []).sort((a, b) => (a.date < b.date ? 1 : -1));
    const up = document.getElementById('newsUpdated');
    if (up && data.updated) up.textContent = 'Τελευταία ενημέρωση: ' + fmtDate(data.updated);
    renderList();
  })
  .catch(() => {
    const box = document.getElementById('newsList');
    if (box) box.innerHTML = '<p class="news-empty">Δεν φορτώθηκαν τα νέα.</p>';
  });

document.getElementById('newsFilters')?.addEventListener('click', e => {
  const btn = e.target.closest('.news-filter');
  if (!btn) return;
  activeRegion = btn.dataset.region;
  document.querySelectorAll('.news-filter').forEach(b => b.classList.toggle('is-active', b === btn));
  renderList();
});

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
