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
  const href = p.slug ? `news/${p.slug}.html` : 'news.html';
  const img = p.image
    ? `<a href="${href}" class="news-thumb"><img src="${p.image}" alt="${p.title}" loading="lazy"></a>`
    : '';
  const tags = (p.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
  return `<article class="news-item" data-region="${p.region || ''}">
    ${img}
    <div class="news-item-body">
      <div class="news-meta">
        <span class="news-region">${REGION_LABEL[p.region] || ''}</span>
        <time class="news-date" datetime="${p.date}">${fmtDate(p.date)}</time>
      </div>
      <h2 class="news-item-title"><a href="${href}">${p.title}</a></h2>
      <div class="artist-tags">${tags}</div>
      <p class="news-sum">${p.summary || ''}</p>
      <p class="news-readmore"><a href="${href}">Διάβασε το άρθρο →</a></p>
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
    injectSeo(ALL_POSTS);
    renderList();
  })
  .catch(() => {
    const box = document.getElementById('newsList');
    if (box) box.innerHTML = '<p class="news-empty">Δεν φορτώθηκαν τα νέα.</p>';
  });

/* SEO: JSON-LD structured data (Article list) for Google */
function injectSeo(posts) {
  const base = 'https://flowlessmusic.gr/news.html';
  const items = posts.slice(0, 20).map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'NewsArticle',
      headline: p.title,
      datePublished: p.date,
      articleSection: p.region === 'intl' ? 'Διεθνή' : 'Ελλάδα',
      author: { '@type': 'Person', name: 'Θοδωρής Παρασχάκης Νταμάς' },
      publisher: { '@type': 'Organization', name: 'Flowless Music' },
      description: p.summary || '',
      ...(p.image ? { image: 'https://flowlessmusic.gr/' + p.image } : {}),
      url: base + '#' + p.id
    }
  }));
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Μουσικά νέα — Flowless Music',
    itemListElement: items
  };
  let tag = document.getElementById('news-ld');
  if (!tag) {
    tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.id = 'news-ld';
    document.head.appendChild(tag);
  }
  tag.textContent = JSON.stringify(ld);
}

document.getElementById('newsFilters')?.addEventListener('click', e => {
  const btn = e.target.closest('.news-filter');
  if (!btn) return;
  activeRegion = btn.dataset.region;
  document.querySelectorAll('.news-filter').forEach(b => b.classList.toggle('is-active', b === btn));
  renderList();
});

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
