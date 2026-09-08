/* ============================================================
   Flowless — Smart links (fan links)
   Διαβάζει links.json και παράγει /listen/<slug>.html
   Κάθε κουμπί δείχνει κατευθείαν στο κανονικό https link της
   πλατφόρμας. Το iOS/Android αναγνωρίζει τα domains αυτά
   (Universal Links / App Links) και ανοίγει μόνο του την
   εφαρμογή αντί για browser, ακόμα και μέσα από Instagram.
   Δεν χρειάζεται τίποτα άλλο από εμάς, το κάνει το ίδιο το OS.
   Τρέξε: node tools/build-links.mjs
   ============================================================ */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://flowlessmusic.gr';
const OUT = path.join(ROOT, 'listen');

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const PLATFORM_ICON = {
  Spotify: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M7 9.5c3.5-1 7-.5 9.5 1M7.5 12.5c3-.8 5.8-.4 8 .9M8 15.3c2.4-.6 4.6-.3 6.4.8"/></svg>',
  'Apple Music': '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M16.5 3c.3 1.6-.3 3.2-1.2 4.3-1 1.1-2.5 2-4 1.9-.3-1.5.4-3.1 1.3-4.1C13.6 4 15.1 3.1 16.5 3zM20 17.2c-.5 1.2-.8 1.8-1.5 2.8-1 1.4-2.3 3.2-4 3.2-1.5 0-1.9-1-3.9-1s-2.5 1-4 1c-1.7 0-3-1.6-4-3-2.6-3.7-2.9-8-1.3-10.4 1.2-1.7 3-2.7 4.7-2.7 1.7 0 2.8 1 4.2 1s2.3-1.1 4.2-1c1.4.1 3 .8 4 2.1-3.5 2-2.9 7.2 1.6 8z"/></svg>',
  YouTube: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><rect x="2" y="5" width="20" height="14" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 9.5v5l4.5-2.5z"/></svg>',
  Deezer: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><rect x="2" y="14" width="3" height="5"/><rect x="7" y="10" width="3" height="9"/><rect x="12" y="6" width="3" height="13"/><rect x="17" y="2" width="3" height="17"/></svg>'
};

function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return isNaN(d) ? iso : d.toLocaleDateString('el-GR', { day: 'numeric', month: 'long' });
}

function page(l) {
  const url = `${SITE}/listen/${l.slug}`;
  const isComingSoon = !l.platforms || !l.platforms.length;

  const body = isComingSoon
    ? `
    <p class="listen-soon-date">Κυκλοφορεί ${esc(fmtDate(l.releaseDate))}</p>
    <p class="listen-soon-text">Άφησε το email σου, θα σου στείλουμε το link μόλις βγει.</p>
    <form class="listen-form" data-audience="${esc(l.audienceId || '')}">
      <input type="email" name="email" placeholder="το email σου" required>
      <button type="submit" class="btn btn-primary">Ενημέρωσέ με</button>
      <p class="listen-form-msg" hidden></p>
    </form>`
    : `
    <div class="listen-buttons">${l.platforms.map(p => `
        <a class="listen-btn" href="${esc(p.url)}">
          <span class="listen-btn-icon">${PLATFORM_ICON[p.name] || ''}</span>
          <span>${esc(p.name)}</span>
        </a>`).join('')}
    </div>`;

  const script = isComingSoon ? `
<script>
document.querySelector('.listen-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button');
  const msg = form.querySelector('.listen-form-msg');
  const email = form.email.value;
  const audienceId = form.dataset.audience;
  btn.disabled = true; btn.textContent = 'Στέλνεται...';
  try {
    const res = await fetch('/api/notify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, audienceId })
    });
    const data = await res.json();
    if (res.ok) {
      form.email.hidden = true; btn.hidden = true;
      msg.hidden = false; msg.textContent = 'Έγινες μέλος. Θα σου στείλουμε το link μόλις βγει.';
    } else {
      msg.hidden = false; msg.style.color = 'var(--blood)';
      msg.textContent = data.error || 'Κάτι πήγε στραβά, δοκίμασε ξανά.';
      btn.disabled = false; btn.textContent = 'Ενημέρωσέ με';
    }
  } catch {
    msg.hidden = false; msg.style.color = 'var(--blood)';
    msg.textContent = 'Κάτι πήγε στραβά, δοκίμασε ξανά.';
    btn.disabled = false; btn.textContent = 'Ενημέρωσέ με';
  }
});
</script>` : '';

  return `<!DOCTYPE html>
<html lang="el">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(l.artist)} — ${esc(l.title)}</title>
<meta name="description" content="${isComingSoon ? `Έρχεται σύντομα: ${esc(l.title)} του ${esc(l.artist)}.` : `Άκουσε ${esc(l.title)} του ${esc(l.artist)} σε όλες τις πλατφόρμες.`}">
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="${url}">
<meta property="og:site_name" content="Flowless Music">
<meta property="og:title" content="${esc(l.artist)} — ${esc(l.title)}">
<meta property="og:description" content="Άκουσε το κομμάτι τώρα.">
<meta property="og:image" content="${SITE}/${esc(l.cover)}">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;600;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../styles.css">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%230a0a0c'/><text x='50' y='72' font-size='64' font-family='Arial Black' font-weight='900' fill='%23e02b38' text-anchor='middle'>F</text></svg>">
</head>
<body>
<main class="listen-page">
  <div class="listen-card">
    <img class="listen-cover" src="../${esc(l.cover)}" alt="${esc(l.artist)} — ${esc(l.title)}" width="600" height="600">
    <p class="listen-artist">${esc(l.artist)}</p>
    <h1 class="listen-title">${esc(l.title)}</h1>${body}
    <a class="listen-back" href="/">FLOWLESS<span style="color:var(--blood)">.</span> MUSIC</a>
  </div>
</main>${script}
</body>
</html>
`;
}

async function main() {
  const data = JSON.parse(await readFile(path.join(ROOT, 'links.json'), 'utf8'));
  const all = data.links || [];
  await mkdir(OUT, { recursive: true });
  for (const l of all) {
    await writeFile(path.join(OUT, l.slug + '.html'), page(l));
  }
  console.log(`Έγιναν ${all.length} smart links.`);
  all.forEach(l => console.log(`  ${SITE}/listen/${l.slug}`));
}

main().catch(e => { console.error(e); process.exit(1); });
