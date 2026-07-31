/* ============================================================
   Flowless — News build step
   Διαβάζει το news.json και παράγει:
     /news/<slug>.html      στατική σελίδα ανά άρθρο (indexable)
     sitemap.xml            με όλα τα άρθρα
     news-sitemap.xml       Google News sitemap (τελευταίες 2 μέρες)
     feed.xml               RSS
   Τρέξε: node tools/build-news.mjs
   ============================================================ */

import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://flowlessmusic.gr';
const NEWS_DIR = path.join(ROOT, 'news');

/* ---------- Ελληνικά -> λατινικό slug ---------- */
const GR = {
  α:'a',β:'v',γ:'g',δ:'d',ε:'e',ζ:'z',η:'i',θ:'th',ι:'i',κ:'k',λ:'l',μ:'m',
  ν:'n',ξ:'x',ο:'o',π:'p',ρ:'r',σ:'s',ς:'s',τ:'t',υ:'y',φ:'f',χ:'ch',ψ:'ps',ω:'o',
  ά:'a',έ:'e',ή:'i',ί:'i',ό:'o',ύ:'y',ώ:'o',ϊ:'i',ϋ:'y',ΐ:'i',ΰ:'y'
};
function slugify(s) {
  return s.toLowerCase().split('').map(c => GR[c] ?? c).join('')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00Z');
  return isNaN(d) ? iso : d.toLocaleDateString('el-GR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

const REGION = { gr: 'Ελλάδα', intl: 'Εξωτερικό' };

/* ---------- Template σελίδας άρθρου ---------- */
function authorBox(ed) {
  if (!ed) return '';
  const socials = (ed.socials || []).map(s =>
    `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join('');
  return `
  <aside class="author-box">
    ${ed.photo
      ? `<img class="author-avatar" src="../${esc(ed.photo)}" alt="${esc(ed.name)} (${esc(ed.alias)})" width="72" height="72" loading="lazy">`
      : `<div class="author-avatar" aria-hidden="true">${esc((ed.alias || ed.name).charAt(0))}</div>`}
    <div class="author-info">
      <p class="author-label">Γράφτηκε και επιμελήθηκε από</p>
      <h2 class="author-name"><a href="${esc(ed.url)}">${esc(ed.name)} <span class="author-alias">(${esc(ed.alias)})</span></a></h2>
      <p class="author-role">${esc(ed.role)}</p>
      <p class="author-bio">${esc(ed.bio)}</p>
      <div class="author-socials">${socials}</div>
    </div>
  </aside>`;
}

function streamingBlock(list) {
  if (!list || !list.length) return '';
  return `
  <div class="listen-now">
    <p class="listen-now-label">Άκουσέ το τώρα στην αγαπημένη σου πλατφόρμα</p>
    <div class="listen-now-links">
      ${list.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener" class="btn btn-primary">${esc(s.name)}</a>`).join('')}
    </div>
  </div>`;
}

function shareRow(url, title) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return `
  <div class="share-row">
    <span class="share-label">Μοιράσου το</span>
    <a class="share-btn" href="https://www.facebook.com/sharer/sharer.php?u=${u}" target="_blank" rel="noopener">Facebook</a>
    <a class="share-btn" href="https://twitter.com/intent/tweet?url=${u}&text=${t}" target="_blank" rel="noopener">X</a>
    <a class="share-btn" href="https://api.whatsapp.com/send?text=${t}%20${u}" target="_blank" rel="noopener">WhatsApp</a>
    <button class="share-btn" type="button" onclick="navigator.clipboard.writeText('${esc(url)}');this.textContent='Αντιγράφηκε ✓';">Copy link</button>
  </div>`;
}

function articlePage(p, prev, next, ed) {
  const url = `${SITE}/news/${p.slug}`;
  const img = p.image ? `${SITE}/${p.image}` : `${SITE}/assets/evoid-2a1ps.jpg`;
  const desc = p.summary || (p.body || [])[0] || '';
  const body = (p.body || []).map(t => {
    const highlight = t.startsWith('@@HIGHLIGHT@@');
    const text = highlight ? t.slice('@@HIGHLIGHT@@'.length) : t;
    return highlight ? `      <p class="callout">${esc(text)}</p>` : `      <p>${esc(text)}</p>`;
  }).join('\n')
    .replace('__PODCAST_LINK__', '<a href="https://blackvybez.gr/podcasts" target="_blank" rel="noopener">blackvybez.gr/podcasts</a>');
  const tags = (p.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('');
  const sources = (p.sources || []).length
    ? `<div class="news-sources"><span>Πηγές:</span> ${p.sources.map(s =>
        `<a href="${esc(s.url)}" target="_blank" rel="noopener nofollow">${esc(s.name)}</a>`).join(' · ')}</div>`
    : '';

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: p.title,
    description: desc,
    datePublished: p.date,
    dateModified: p.date,
    inLanguage: 'el',
    articleSection: REGION[p.region] || 'Μουσική',
    keywords: (p.tags || []).join(', '),
    image: [img],
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: ed ? {
      '@type': 'Person',
      name: ed.name,
      alternateName: ed.alias,
      jobTitle: ed.role,
      description: ed.bio,
      url: ed.website || ed.url,
      ...(ed.photo ? { image: `${SITE}/${ed.photo}` } : {}),
      mainEntityOfPage: ed.url,
      sameAs: [...new Set([...(ed.socials || []).map(s => s.url), ed.website, ed.url].filter(Boolean))],
      worksFor: { '@type': 'Organization', name: 'Flowless Music', url: SITE }
    } : { '@type': 'Organization', name: 'Flowless Music', url: SITE },
    publisher: {
      '@type': 'Organization', name: 'Flowless Music', url: SITE,
      logo: { '@type': 'ImageObject', url: `${SITE}/assets/evoid-2a1ps.jpg` }
    }
  };
  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Αρχική', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: 'Νέα', item: `${SITE}/news` },
      { '@type': 'ListItem', position: 3, name: p.title, item: url }
    ]
  };

  return `<!DOCTYPE html>
<html lang="el">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(p.title)} — Flowless Music</title>
<meta name="description" content="${esc(desc).slice(0, 160)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="${url}">
<meta property="og:site_name" content="Flowless Music">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(desc).slice(0, 200)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${esc(img)}">
<meta property="og:locale" content="el_GR">
<meta property="article:published_time" content="${p.date}">
<meta property="article:section" content="${esc(REGION[p.region] || '')}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.title)}">
<meta name="twitter:description" content="${esc(desc).slice(0, 200)}">
<meta name="twitter:image" content="${esc(img)}">
<link rel="alternate" type="application/rss+xml" title="Flowless Music — Νέα" href="${SITE}/feed.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;600;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../styles.css">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%230a0a0c'/><text x='50' y='72' font-size='64' font-family='Arial Black' font-weight='900' fill='%23e02b38' text-anchor='middle'>F</text></svg>">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script type="application/ld+json">${JSON.stringify(crumbs)}</script>
</head>
<body>

<nav class="nav">
  <a href="/#top" class="nav-logo">FLOWLESS<span class="nav-logo-dot">.</span></a>
  <div class="nav-links">
    <a href="/#top">Αρχική</a>
    <a href="/#release">Release</a>
    <a href="/#roster">Roster</a>
    <a href="/#playlist">Playlist</a>
    <a href="/news">News</a>
    <a href="/merch">Merch</a>
    <a href="/#contact">Επικοινωνία</a>
  </div>
</nav>

<main>
<article class="section article-page">
  <nav class="crumbs" aria-label="Breadcrumb">
    <a href="/">Αρχική</a> <span>/</span> <a href="/news">Νέα</a>
  </nav>

  <div class="news-meta">
    <span class="news-region" data-region="${esc(p.region)}">${esc(REGION[p.region] || '')}</span>
    <time class="news-date" datetime="${p.date}">${fmtDate(p.date)}</time>
  </div>
  <h1 class="article-title">${esc(p.title)}</h1>
  <p class="news-byline">${esc((ed && ed.name) || p.author || 'Flowless Music')}</p>
${p.image ? `  <div class="article-hero"><img src="../${esc(p.image)}" alt="${esc(p.title)}" width="1200" height="675"></div>` : ''}
  <div class="artist-tags">${tags}</div>

  <div class="article-body">
${body}
  </div>
${streamingBlock(p.streaming)}
  ${sources}
${shareRow(url, p.title)}
${authorBox(ed)}

  <div class="article-nav">
    ${prev ? `<a href="${prev.slug}">← ${esc(prev.title)}</a>` : '<span></span>'}
    ${next ? `<a href="${next.slug}">${esc(next.title)} →</a>` : '<span></span>'}
  </div>
  <p class="article-back"><a href="/news" class="btn btn-primary">Όλα τα νέα</a></p>
</article>
</main>

<footer class="footer">
  <p>FLOWLESS MUSIC © ${new Date().getFullYear()} · flowlessmusic.gr · Powered by <a href="https://flowsites.gr" target="_blank" rel="noopener">flowsites</a></p>
</footer>
</body>
</html>
`;
}

/* ---------- Main ---------- */
async function main() {
  const file = path.join(ROOT, 'news.json');
  const data = JSON.parse(await readFile(file, 'utf8'));
  const posts = (data.posts || []).sort((a, b) => (a.date < b.date ? 1 : -1));

  // Σταθερά slugs
  const used = new Set();
  for (const p of posts) {
    let s = p.slug || `${p.date}-${slugify(p.title)}`;
    while (used.has(s)) s += '-2';
    used.add(s);
    p.slug = s;
    if (!p.author) p.author = 'Flowless Music';
  }

  await mkdir(NEWS_DIR, { recursive: true });

  // Καθάρισε παλιές σελίδες που δεν υπάρχουν πια
  const existing = (await readdir(NEWS_DIR).catch(() => [])).filter(f => f.endsWith('.html'));
  for (const f of existing) {
    if (!used.has(f.replace(/\.html$/, ''))) await unlink(path.join(NEWS_DIR, f));
  }

  let editor = null;
  try {
    editor = JSON.parse(await readFile(path.join(ROOT, 'artists.json'), 'utf8')).editor || null;
  } catch {}

  for (let i = 0; i < posts.length; i++) {
    const html = articlePage(posts[i], posts[i + 1], posts[i - 1], editor);
    await writeFile(path.join(NEWS_DIR, posts[i].slug + '.html'), html);
  }

  // sitemap.xml
  const staticUrls = [
    { loc: SITE + '/', freq: 'weekly', pri: '1.0' },
    { loc: SITE + '/news', freq: 'daily', pri: '0.9' },
    { loc: SITE + '/merch', freq: 'monthly', pri: '0.6' }
  ];
  let artistUrls = [];
  try {
    const ad = JSON.parse(await readFile(path.join(ROOT, 'artists.json'), 'utf8'));
    artistUrls = (ad.artists || []).map(a => `  <url><loc>${SITE}/artists/${a.id}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`);
  } catch {}

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.map(u => `  <url><loc>${u.loc}</loc><changefreq>${u.freq}</changefreq><priority>${u.pri}</priority></url>`).join('\n')}
${artistUrls.join('\n')}
${posts.map(p => `  <url><loc>${SITE}/news/${p.slug}</loc><lastmod>${p.date}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`).join('\n')}
</urlset>
`;
  await writeFile(path.join(ROOT, 'sitemap.xml'), sitemap);

  // news-sitemap.xml (Google News: μόνο τελευταίες 2 μέρες)
  const cutoff = new Date(Date.now() - 2 * 864e5).toISOString().slice(0, 10);
  const recent = posts.filter(p => p.date >= cutoff);
  const newsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${recent.map(p => `  <url>
    <loc>${SITE}/news/${p.slug}</loc>
    <news:news>
      <news:publication><news:name>Flowless Music</news:name><news:language>el</news:language></news:publication>
      <news:publication_date>${p.date}</news:publication_date>
      <news:title>${esc(p.title)}</news:title>
    </news:news>
  </url>`).join('\n')}
</urlset>
`;
  await writeFile(path.join(ROOT, 'news-sitemap.xml'), newsSitemap);

  // RSS
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>Flowless Music — Μουσικά νέα</title>
<link>${SITE}/news</link>
<description>Κυκλοφορίες, νούμερα, chart και γεγονότα από Ελλάδα και εξωτερικό.</description>
<language>el</language>
${posts.slice(0, 20).map(p => `<item>
<title>${esc(p.title)}</title>
<link>${SITE}/news/${p.slug}</link>
<guid>${SITE}/news/${p.slug}</guid>
<pubDate>${new Date(p.date + 'T08:00:00Z').toUTCString()}</pubDate>
<description>${esc(p.summary || '')}</description>
</item>`).join('\n')}
</channel></rss>
`;
  await writeFile(path.join(ROOT, 'feed.xml'), rss);

  // Γράψε πίσω τα slugs
  await writeFile(file, JSON.stringify({ updated: data.updated, posts }, null, 2) + '\n');

  console.log(`Έγιναν ${posts.length} σελίδες άρθρων, sitemap, news-sitemap, RSS.`);
}

main().catch(e => { console.error(e); process.exit(1); });
