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
  const url = `${SITE}/artists/${a.id}`;
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
    url: a.website || url,
    mainEntityOfPage: url,
    ...(a.photo ? { image: `${SITE}/${a.photo}` } : {}),
    ...(sameAs.length || a.website
      ? { sameAs: [...new Set([...sameAs, a.website].filter(Boolean))] }
      : {}),
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
      { '@type': 'ListItem', position: 2, name: 'Roster', item: `${SITE}/#roster` },
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
<script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
<script>
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  OneSignalDeferred.push(async function(OneSignal) {
    await OneSignal.init({ appId: "2a3474b4-7d5d-483a-a23d-12305dd0a9a7" });
  });
</script>
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
    <a href="/">Αρχική</a> <span>/</span> <a href="/#roster">Roster</a>
  </nav>

  <p class="section-label">${esc(a.role.el)} · Flowless Music</p>
  <h1 class="article-title">${esc(a.displayName || a.name)}</h1>
  ${a.realName ? `<p class="news-byline">${esc(a.realName)}</p>` : ''}

  <div class="artist-tags">${(a.genres || []).map(g => `<span class="tag">${esc(g)}</span>`).join('')}</div>

  ${a.photo ? `<div class="artist-portrait"><img src="../${esc(a.photo)}" alt="${esc(a.displayName || a.name)}" width="447" height="447"></div>` : ''}

  <div class="article-body">
    <p>${esc(bio)}</p>
    ${a.website ? `<p>Επίσημη ιστοσελίδα: <a href="${esc(a.website)}" target="_blank" rel="noopener">${esc(a.website.replace(/^https?:\/\//, ''))}</a></p>` : ''}
    ${alsoKnown.length ? `<p>Έχει εμφανιστεί και ως ${alsoKnown.map(esc).join(', ')}.</p>` : ''}
    <p>Ο ${esc(a.displayName || a.name)} ανήκει στο roster της Flowless Music, ανεξάρτητου ελληνικού μουσικού label με έδρα τη Λάρισα${a.origin ? `. Βάση του είναι ${esc(a.origin)}` : ''}. Κινείται σε ${(a.genres || []).slice(0, -1).map(esc).join(', ')}${(a.genres || []).length > 1 ? ' και ' + esc(a.genres[a.genres.length - 1]) : ''}.</p>
  </div>

  ${socials}

  <div class="article-body" style="margin-top:38px">
    <h2 class="news-item-title">Υπόλοιπο roster</h2>
    <p class="roster-links">${others.map(o =>
      `<a href="${o.id}">${esc(o.displayName || o.name)}</a>`).join(' · ')}</p>
  </div>

  <p class="article-back"><a href="/#roster" class="btn btn-primary">Όλο το roster</a></p>
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
