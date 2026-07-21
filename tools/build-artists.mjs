/* ============================================================
   Flowless — Artist pages build step
   Διαβάζει artists.json και παράγει /artists/<id>.html
   Κάθε σελίδα δηλώνει ρητά την ταυτότητα του καλλιτέχνη
   (MusicGroup + sameAs) ώστε ο Google/AI να διορθώσει
   παλιές ή λάθος συσχετίσεις.
   Τρέξε: node tools/build-artists.mjs
   ============================================================ */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://flowlessmusic.gr';
const OUT = path.join(ROOT, 'artists');

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function page(a, all) {
  const url = `${SITE}/artists/${a.id}.html`;
  const bio = a.bio.el;
  const sameAs = (a.socials || []).map(s => s.url);
  const others = all.filter(x => x.id !== a.id);

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    '@id': url,
    name: a.displayName || a.name,
    alternateName: a.alternateNames || [],
    description: bio,
    genre: a.genres || [],
    foundingLocation: a.origin ? { '@type': 'Place', name: a.origin } : undefined,
    url,
    ...(sameAs.length ? { sameAs } : {}),
    memberOf: {
      '@type': 'MusicGroup',
      name: 'Flowless Music',
      url: SITE,
      description: 'Ανεξάρτητο ελληνικό μουσικό label με έδρα τη Λάρισα.'
    },
    ...(a.realName ? { member: { '@type': 'Person', name: a.realName } } : {})
  };
  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Αρχική', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: 'Roster', item: `${SITE}/index.html#roster` },
      { '@type': 'ListItem', position: 3, name: a.displayName || a.name, item: url }
    ]
  };

  const socials = (a.socials || []).length
    ? `<div class="artist-socials">${a.socials.map(s =>
        `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join('')}</div>`
    : '';

  const alsoKnown = (a.alternateNames || []).filter(n => n !== (a.displayName || a.name));

  return `<!DOCTYPE html>
<html lang="el">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(a.displayName || a.name)} — Flowless Music</title>
<meta name="description" content="${esc(bio).slice(0, 160)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${url}">
<meta property="og:site_name" content="Flowless Music">
<meta property="og:type" content="profile">
<meta property="og:title" content="${esc(a.displayName || a.name)} — Flowless Music">
<meta property="og:description" content="${esc(bio).slice(0, 200)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/assets/evoid-2a1ps.jpg">
<meta property="og:locale" content="el_GR">
<meta name="twitter:card" content="summary_large_image">
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
  <a href="../index.html#top" class="nav-logo">FLOWLESS<span class="nav-logo-dot">.</span></a>
  <div class="nav-links">
    <a href="../index.html#release">Release</a>
    <a href="../index.html#roster">Roster</a>
    <a href="../index.html#playlist">Playlist</a>
    <a href="../news.html">News</a>
    <a href="../merch.html">Merch</a>
    <a href="../index.html#contact">Επικοινωνία</a>
  </div>
</nav>

<main>
<article class="section article-page">
  <nav class="crumbs" aria-label="Breadcrumb">
    <a href="../index.html">Αρχική</a> <span>/</span> <a href="../index.html#roster">Roster</a>
  </nav>

  <p class="section-label">${esc(a.role.el)} · Flowless Music</p>
  <h1 class="article-title">${esc(a.displayName || a.name)}</h1>
  ${a.realName ? `<p class="news-byline">${esc(a.realName)}</p>` : ''}

  <div class="artist-tags">${(a.genres || []).map(g => `<span class="tag">${esc(g)}</span>`).join('')}</div>

  <div class="article-body">
    <p>${esc(bio)}</p>
    ${alsoKnown.length ? `<p>Έχει εμφανιστεί και ως ${alsoKnown.map(esc).join(', ')}.</p>` : ''}
    <p>Ο ${esc(a.displayName || a.name)} ανήκει στο roster της Flowless Music, ανεξάρτητου ελληνικού μουσικού label με έδρα τη Λάρισα. Το είδος του κινείται στο ελληνικό hip hop και rap${a.origin ? `, με βάση ${esc(a.origin)}` : ''}.</p>
  </div>

  ${socials}

  <div class="article-body" style="margin-top:38px">
    <h2 class="news-item-title">Υπόλοιπο roster</h2>
    <p class="roster-links">${others.map(o =>
      `<a href="${o.id}.html">${esc(o.displayName || o.name)}</a>`).join(' · ')}</p>
  </div>

  <p class="article-back"><a href="../index.html#roster" class="btn btn-primary">Όλο το roster</a></p>
</article>
</main>

<footer class="footer">
  <p>FLOWLESS MUSIC © ${new Date().getFullYear()} · flowlessmusic.gr · Powered by <a href="https://flowsites.gr" target="_blank" rel="noopener">flowsites</a></p>
</footer>
</body>
</html>
`;
}

async function main() {
  const data = JSON.parse(await readFile(path.join(ROOT, 'artists.json'), 'utf8'));
  const all = data.artists || [];
  await mkdir(OUT, { recursive: true });
  for (const a of all) {
    await writeFile(path.join(OUT, a.id + '.html'), page(a, all));
  }
  console.log(`Έγιναν ${all.length} σελίδες καλλιτεχνών.`);
}

main().catch(e => { console.error(e); process.exit(1); });
