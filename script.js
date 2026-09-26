/* ============ FLOWLESS MUSIC ============ */

/* ---------- Artist Roster Data ----------
   Φορτώνεται από το artists.json (ίδια πηγή με τις σελίδες /artists/*),
   ώστε το bio/socials/tags στο mixer να ταυτίζεται πάντα με το πλήρες προφίλ. */
let ARTISTS = [];

function loadArtists() {
  return fetch('/artists.json?_=' + Date.now())
    .then(r => r.json())
    .then(data => {
      ARTISTS = (data.artists || []).map(a => ({
        id: a.id,
        name: a.name,
        alias: a.alias,
        photo: a.photo,
        role: a.role || { el: 'Artist', en: 'Artist' },
        tags: a.tags || [],
        tagsEn: a.tagsEn || a.tags || [],
        bio: a.bio || { el: '', en: '' },
        socials: a.socials || []
      }));
    })
    .catch(() => { ARTISTS = []; });
}

/* ---------- Latest Release Registry ---------- */
// Η τελευταία κυκλοφορία έρχεται από το latest-release.js (το γράφει το Κέντρο Ελέγχου).
const LATEST_RELEASE = window.FM_LATEST || null;
const PLAYLIST_URL = 'https://open.spotify.com/playlist/766LR1ZtOxjvZ8fiRQLkMz?si=40bdc0412e1743f6';

/* ---------- Internationalization (i18n) ---------- */
const STRINGS = {
  en: {
    nav_home: 'Home',
    nav_release: 'Release',
    nav_roster: 'Roster',
    nav_playlist: 'Playlist',
    nav_news: 'News',
    nav_merch: 'Merch',
    nav_contact: 'Contact',
    hero_eyebrow: 'Independent label · Greece',
    hero_tagline: 'Label · Studio · Beats',
    release_label: 'Latest release',
    release_title: 'Latest Release',
    release_cover_soon: 'Artwork soon',
    release_name: 'Coming soon',
    release_desc: 'The next label release is in the mix right now.',
    release_listen: 'Listen — soon',
    roster_label: 'The roster',
    roster_title: 'Choose frequency',
    console_hint: 'SOLO = open channel',
    playlist_title: 'All our tracks',
    playlist_soon: 'The label Spotify playlist drops here soon.',
    news_label: 'Music news',
    news_title: "What's playing",
    news_all: 'All news',
    news_empty: 'Nothing yet.',
    contact_label: 'Contact',
    contact_title: 'Work with us?',
    contact_note: 'Beats, features, booking — email us or hit the socials.',
    merch_label: 'Merch',
    merch_title: 'Drop 001 — coming soon',
    merch_sub: 'Tees, hoodies, more. When it lands, it lands here first.',
    m_tee: 'Coming soon', m_hoodie: 'Coming soon', m_cap: 'Coming soon', m_vinyl: 'Coming soon'
  },
  el: {} // Greek defaults cached from DOM on startup
};

let lang = localStorage.getItem('fm-lang') || 'el';

/* Populate Greek strings from DOM elements */
document.querySelectorAll('[data-i18n]').forEach(el => {
  STRINGS.el[el.dataset.i18n] = el.textContent;
});

function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const dict = STRINGS[lang];
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  const toggle = document.getElementById('langToggle');
  if (toggle) toggle.textContent = lang === 'el' ? 'EN' : 'ΕΛ';
  renderConsole();
  renderRelease();
  renderPlaylist();
}

/* ---------- Render Latest Release ---------- */
function renderRelease() {
  const box = document.getElementById('releaseCard');
  if (!box || !LATEST_RELEASE) return;
  const r = LATEST_RELEASE;
  box.innerHTML = `
    <div class="release-cover">
      <img src="${r.cover}" alt="${r.artist} — ${r.title}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;border:1px solid var(--line)">
    </div>
    <div class="release-meta">
      <p class="release-artist">${r.artist}</p>
      <h3 class="release-name">${r.title}</h3>
      <p class="release-desc">${r.desc[lang]}</p>
      <div class="release-links" style="display:flex;gap:12px;flex-wrap:wrap">
        ${r.spotify ? `<a href="${r.spotify}" target="_blank" rel="noopener" class="btn btn-primary">Spotify</a>` : ''}
        ${r.youtube ? `<a href="${r.youtube}" target="_blank" rel="noopener" class="btn btn-primary" style="background:var(--smoke-2);color:var(--bone);border:1px solid var(--line)">YouTube</a>` : ''}
        ${r.appleMusic ? `<a href="${r.appleMusic}" target="_blank" rel="noopener" class="btn btn-primary" style="background:var(--smoke-2);color:var(--bone);border:1px solid var(--line)">Apple Music</a>` : ''}
      </div>
    </div>`;
}

/* ---------- Render Playlist Embed ---------- */
function renderPlaylist() {
  const box = document.getElementById('playlistFrame');
  if (!box) return;
  if (PLAYLIST_URL) {
    const m = PLAYLIST_URL.match(/playlist\/([a-zA-Z0-9]+)/);
    const id = m ? m[1] : null;
    box.innerHTML = id
      ? `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/${id}?theme=0" width="100%" height="420" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
      : `<a href="${PLAYLIST_URL}" target="_blank" rel="noopener" class="btn btn-primary">Spotify Playlist</a>`;
  } else {
    box.innerHTML = `<div class="playlist-placeholder"><p data-i18n="playlist_soon">${STRINGS[lang].playlist_soon || ''}</p></div>`;
  }
}

const toggleBtn = document.getElementById('langToggle');
if (toggleBtn) toggleBtn.addEventListener('click', () => {
  lang = lang === 'el' ? 'en' : 'el';
  localStorage.setItem('fm-lang', lang);
  applyLang();
});

/* ---------- Mobile Burger Menu ---------- */
const navBurger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
if (navBurger && navLinks) {
  const closeMenu = () => {
    navLinks.classList.remove('open');
    navBurger.setAttribute('aria-expanded', 'false');
  };
  navBurger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navBurger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}

/* ---------- Roster Console Strip Logic ---------- */
let soloId = null;
const meterTimers = [];

function renderConsole() {
  const wrap = document.getElementById('consoleStrips');
  if (!wrap) return;
  meterTimers.forEach(clearInterval);
  meterTimers.length = 0;
  wrap.innerHTML = '';
  const faderPositions = ['34%', '22%', '40%', '28%', '36%']; // Default fader resting heights

  ARTISTS.forEach((a, idx) => {
    const strip = document.createElement('button');
    strip.className = 'strip' + (a.id === soloId ? ' solo' : '');
    strip.dataset.id = a.id;
    strip.setAttribute('aria-expanded', a.id === soloId ? 'true' : 'false');
    strip.style.setProperty('--fader', faderPositions[idx]);
    strip.innerHTML = `
      <span class="meter" aria-hidden="true">${'<b></b>'.repeat(10)}</span>
      <span class="fader-track" aria-hidden="true"><span class="fader-cap"></span></span>
      <span class="solo-led">SOLO</span>
      <span class="strip-name">${a.name}</span>
      <span class="strip-role">${a.role[lang]}</span>`;
    strip.addEventListener('click', () => toggleSolo(a.id));
    wrap.appendChild(strip);
    animateMeter(strip, idx);
  });

  wrap.classList.toggle('has-solo', !!soloId);
  renderDetail();
}

function animateMeter(strip, idx) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const leds = strip.querySelectorAll('.meter b');
  const tick = () => {
    const isSolo = strip.classList.contains('solo');
    const dimmed = strip.parentElement.classList.contains('has-solo') && !isSolo;
    // Channel visualizer audio simulation dynamics
    const base = dimmed ? 1.5 : 4 + Math.sin(Date.now() / (700 + idx * 160)) * 2.5;
    const level = Math.max(0, Math.round(base + Math.random() * 3.2));
    leds.forEach((led, i) => {
      led.className = '';
      if (i < level) {
        led.classList.add('on');
        if (i >= 8) led.classList.add('peak');
        else if (i >= 6) led.classList.add('hot');
      }
    });
  };
  tick();
  meterTimers.push(setInterval(tick, 120 + idx * 22));
}

function toggleSolo(id) {
  soloId = soloId === id ? null : id;
  renderConsole();
}

/* Βγάλε το Spotify artist ID από ένα link, μόνο αν είναι πραγματικά artist link (όχι album/track) */
function spotifyArtistId(url) {
  const m = String(url || '').match(/open\.spotify\.com\/(?:intl-\w+\/)?artist\/([a-zA-Z0-9]+)/);
  return m ? m[1] : null;
}

function discographyHtml(a) {
  const socials = a.socials || [];
  const spotify = socials.find(s => /spotify/i.test(s.label));
  const youtube = socials.find(s => /youtube/i.test(s.label));
  const apple = socials.find(s => /apple/i.test(s.label));
  const artistId = spotify ? spotifyArtistId(spotify.url) : null;

  const embed = artistId
    ? `<div class="discog-embed"><iframe src="https://open.spotify.com/embed/artist/${artistId}?utm_source=generator&theme=0" width="100%" height="352" frameborder="0" allowfullscreen loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe></div>`
    : '';

  const btns = [];
  if (!artistId && spotify) btns.push(`<a class="discog-platform-btn" href="${spotify.url}" target="_blank" rel="noopener">▶ Άνοιξε στο Spotify</a>`);
  if (youtube) btns.push(`<a class="discog-platform-btn" href="${youtube.url}" target="_blank" rel="noopener">▶ Άνοιξε στο YouTube</a>`);
  if (apple) btns.push(`<a class="discog-platform-btn" href="${apple.url}" target="_blank" rel="noopener">♪ Άνοιξε στο Apple Music</a>`);

  if (!embed && !btns.length) return '';
  return `<div class="discog-block">
    <h3 class="news-item-title" style="font-size:1.1rem;margin-bottom:0">Δισκογραφία</h3>
    ${embed}
    ${btns.length ? `<div class="discog-platforms">${btns.join('')}</div>` : ''}
  </div>`;
}

function renderDetail() {
  const box = document.getElementById('artistDetail');
  if (!box) return;
  const a = ARTISTS.find(x => x.id === soloId);
  if (!a) { box.hidden = true; box.innerHTML = ''; return; }
  const tags = (lang === 'en' && a.tagsEn) ? a.tagsEn : a.tags;
  box.hidden = false;
  box.innerHTML = `
    ${a.photo ? `<img class="artist-photo" src="${a.photo}" alt="${a.name}" loading="lazy">` : `<div class="artist-photo">${a.name.charAt(0)}</div>`}
    <div>
      <h3 class="detail-name">${a.name}</h3>
      ${a.alias ? `<p class="detail-alias">aka ${a.alias}</p>` : ''}
      <div class="artist-tags">${tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <p class="artist-bio">${a.bio[lang]}</p>
      <div class="artist-socials">
        ${a.socials.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`).join('')}
        <a href="/artists/${a.id}" class="artist-page-link">Πλήρες προφίλ →</a>
      </div>
      ${discographyHtml(a)}
    </div>`;
}

/* ---------- Hero Bottom Spectrum Visualizer ---------- */
const spectrum = document.getElementById('spectrum');
if (spectrum) {
  const N = 48;
  for (let i = 0; i < N; i++) {
    const bar = document.createElement('i');
    // Asynchronous frequency oscillations
    bar.style.animationDuration = (0.7 + Math.random() * 1.1).toFixed(2) + 's';
    bar.style.animationDelay = '-' + (Math.random() * 2).toFixed(2) + 's';
    bar.style.height = (18 + Math.random() * 38).toFixed(0) + 'px';
    spectrum.appendChild(bar);
  }
}

/* ---------- Hero Wordmark Character Warp ---------- */
const wordmark = document.querySelector('.hero-wordmark');
if (wordmark && matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Segment text into spans to target individual characters
  const splitLetters = el => {
    [...el.childNodes].forEach(node => {
      if (node.nodeType === 3) {
        if (!node.textContent.trim()) { node.remove(); return; } // Ignore empty nodes
        const frag = document.createDocumentFragment();
        [...node.textContent].forEach(ch => {
          if (!ch.trim()) { frag.appendChild(document.createTextNode(ch)); return; }
          const s = document.createElement('span');
          s.className = 'wm-l';
          s.textContent = ch;
          frag.appendChild(s);
        });
        node.replaceWith(frag);
      } else if (node.nodeType === 1) splitLetters(node);
    });
  };
  splitLetters(wordmark);
  wordmark.addEventListener('mouseover', e => {
    const l = e.target.closest('.wm-l');
    if (!l || l.classList.contains('warp')) return;
    l.classList.add('warp');
    l.addEventListener('animationend', () => l.classList.remove('warp'), { once: true });
  });
}

/* ---------- Interactive Dot Matrix Canvas ---------- */
const dotsCanvas = document.getElementById('heroDots');
if (dotsCanvas && !matchMedia('(prefers-reduced-motion: reduce)').matches && matchMedia('(pointer: fine)').matches) {
  const ctx = dotsCanvas.getContext('2d');
  const hero = dotsCanvas.parentElement;
  let dots = [], W = 0, H = 0, raf = null;
  const mouse = { x: -9999, y: -9999 };
  const SPACING = 30, RADIUS = 150;

  function build() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = hero.clientWidth; H = hero.clientHeight;
    dotsCanvas.width = W * dpr; dotsCanvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dots = [];
    for (let y = SPACING; y < H - 40; y += SPACING)
      for (let x = SPACING / 2 + (y / SPACING % 2) * (SPACING / 2); x < W; x += SPACING)
        dots.push({ x, y, glow: 0 });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const d of dots) {
      const dx = d.x - mouse.x, dy = d.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      const target = dist < RADIUS ? 1 - dist / RADIUS : 0;
      d.glow += (target - d.glow) * 0.09; // Smooth transitions via linear interpolation
      const g = d.glow;
      // Calculate coordinates and alpha values
      const r = 1.1 + g * 0.9;
      ctx.beginPath();
      ctx.arc(d.x, d.y, r, 0, 6.2832);
      ctx.fillStyle = g > 0.02
        ? `rgba(224,43,56,${(0.10 + g * 0.45).toFixed(3)})`
        : 'rgba(236,232,225,0.055)';
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  }

  hero.addEventListener('mousemove', e => {
    const rect = dotsCanvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  /* Freeze animations when hero is out of viewport */
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { if (!raf) raf = requestAnimationFrame(draw); }
    else { cancelAnimationFrame(raf); raf = null; }
  }).observe(hero);

  let rto;
  addEventListener('resize', () => { clearTimeout(rto); rto = setTimeout(build, 200); });
  build();
  raf = requestAnimationFrame(draw);
}

/* ---------- Interactive SVG Cable Simulation ---------- */
const cablesSvg = document.getElementById('cablesSvg');
if (cablesSvg) {
  const NS = 'http://www.w3.org/2000/svg';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const N = 48;                 // Number of cable segments
  const PULL_R = 130;           // Cursor interaction radius
  const PULL_MAX = 44;          // Max translation distance (px)
  const K = 0.12, DAMP = 0.84; // Hooke stiffness / damping coefficients
  let W = 0, H = 0, cables = [], raf = null;
  const mouse = { x: -9999, y: -9999 };

  // Establish quadratic bezier path with offscreen endpoints
  const DEFS = [
    { y0: -30, cy: 1.9, y1: -60, w: [6, 2.5], cols: ['#232128', '#2e2b34'] },
    { y0: -60, cy: 1.55, y1: -35, w: [7, 3], cols: ['#1e1c22', '#292630'] },
    { y0: -80, cy: 1.15, y1: -70, w: [4.5, 0], cols: ['#26232b'] }
  ];

  function qPoint(p0, p1, p2, t) {
    const a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t;
    return { x: a * p0.x + b * p1.x + c * p2.x, y: a * p0.y + b * p1.y + c * p2.y };
  }

  function build() {
    W = cablesSvg.parentElement.clientWidth;
    H = cablesSvg.parentElement.clientHeight;
    cablesSvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    cablesSvg.innerHTML = '';
    cables = DEFS.map(def => {
      const p0 = { x: -50, y: def.y0 };
      const p2 = { x: W + 50, y: def.y1 };
      const p1 = { x: W * (0.3 + Math.random() * 0.4), y: H * def.cy };
      const pts = [];
      for (let i = 0; i <= N; i++) {
        const b = qPoint(p0, p1, p2, i / N);
        pts.push({ bx: b.x, by: b.y, ox: 0, oy: 0, vx: 0, vy: 0 });
      }
      const paths = def.cols.map((col, i) => {
        const el = document.createElementNS(NS, 'path');
        el.setAttribute('stroke', col);
        el.setAttribute('stroke-width', def.w[i] || 2);
        el.setAttribute('stroke-linecap', 'round');
        cablesSvg.appendChild(el);
        return el;
      });
      return { pts, paths };
    });
    drawAll();
  }

  function drawAll() {
    for (const c of cables) {
      let d = '';
      c.pts.forEach((p, i) => {
        d += (i ? 'L' : 'M') + (p.bx + p.ox).toFixed(1) + ' ' + (p.by + p.oy).toFixed(1);
      });
      c.paths.forEach(el => el.setAttribute('d', d));
    }
  }

  function step() {
    let alive = false;
    for (const c of cables) {
      for (const p of c.pts) {
        const px = p.bx + p.ox, py = p.by + p.oy;
        const dx = mouse.x - px, dy = mouse.y - py;
        const dist = Math.hypot(dx, dy);
        let tx = 0, ty = 0;
        if (dist < PULL_R && dist > 0.01) {
          const f = (1 - dist / PULL_R);
          const pull = Math.min(PULL_MAX, PULL_R) * f * f; // Force dissipation curve
          tx = (dx / dist) * pull;
          ty = (dy / dist) * pull;
        }
        p.vx = (p.vx + (tx - p.ox) * K) * DAMP;
        p.vy = (p.vy + (ty - p.oy) * K) * DAMP;
        p.ox += p.vx; p.oy += p.vy;
        if (Math.abs(p.vx) + Math.abs(p.vy) + Math.abs(p.ox - tx) + Math.abs(p.oy - ty) > 0.15) alive = true;
      }
    }
    drawAll();
    raf = alive || mouse.x > -9000 ? requestAnimationFrame(step) : null;
  }

  if (!reduced && fine) {
    document.addEventListener('mousemove', e => {
      const r = cablesSvg.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(step);
    });
    document.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
  }
  let cto;
  addEventListener('resize', () => { clearTimeout(cto); cto = setTimeout(build, 200); });
  build();
}

/* ---------- Scroll Reveals ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- Homepage News (latest 3) ---------- */
function renderNews() {
  const grid = document.getElementById('newsGrid');
  if (!grid) return;
  fetch('/news.json?_=' + Date.now())
    .then(r => r.json())
    .then(data => {
      const posts = (data.posts || []).sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 3);
      if (!posts.length) { grid.innerHTML = `<p class="news-empty">${STRINGS[lang].news_empty || ''}</p>`; return; }
      grid.innerHTML = posts.map(p => {
        const img = p.image ? `<div class="news-thumb"><img src="${p.image}" alt="${p.title}" loading="lazy"></div>` : '';
        const region = p.region === 'gr' ? 'Ελλάδα' : p.region === 'intl' ? 'Εξωτερικό' : '';
        const href = p.slug ? `/news/${p.slug}` : '/news';
        return `<a class="news-card" href="${href}">
          ${img}
          <div class="news-card-body">
            <span class="news-region">${region}</span>
            <h3 class="news-card-title">${p.title}</h3>
            <p class="news-card-sum">${p.summary || ''}</p>
          </div>
        </a>`;
      }).join('');
    })
    .catch(() => { grid.innerHTML = ''; });
}

/* ---------- App Entry Point ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
loadArtists().then(applyLang);
renderNews();

console.log(
  String.raw`%c
  ___ _    ___  _      __  ___ ___ _____ ___  ___ 
 | __| |  / _ \| | /\ / / / __|_ _|_   _| __|/ __|
 | _| | |_| (_) | |/  \| |  \__ \| |  | | | _| \__ \
 |_|  |____\___/|__/ \__/ |___/___| |_| |___|___/
                                                   
  🕵️‍♂️ Inspector Gadget detected!
 
  [!] ΠΡΟΣΟΧΗ: Αν κοιτάς αυτόν τον κώδικα για πολλή ώρα, μπορεί να συνειδητοποιήσεις
  πόσο αργό είναι το δικό σου site. Η αντιγραφή κώδικα απαγορεύεται αυστηρά 
  από τους νόμους του καλού γούστου.
 
  Θέλεις ένα πραγματικά premium & γρήγορο site; Φτιάξ' το μαζί μας στο flowsites.gr
`,
  "color: #e02b38; font-family: monospace; font-size: 11px; font-weight: bold;"
);
