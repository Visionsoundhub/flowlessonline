/* ============ FLOWLESS MUSIC ============ */

/* ---------- Artist Roster Data ---------- */
const ARTISTS = [
  {
    id: 'evoid',
    name: 'E VOID',
    role: { el: 'Artist', en: 'Artist' },
    tags: ['Boom Bap', 'Trap', 'Drill'],
    bio: {
      el: 'Γνωστός στο παρελθόν ως Seib, ο Evoid εκπροσωπεί τη σκηνή της Λάρισας με έναν ιδιαίτερο, σκοτεινό ήχο και ευθύ στίχο. Μετά από χρόνια παρουσίας στην τοπική underground σκηνή και συμμετοχής σε διάφορα σχήματα, σήμερα συνεργάζεται στενά με τον Black Vybez ως συνιδρυτής της Flowless Music. Η μουσική του χαρακτηρίζεται από ωμό, αφιλτράριστο ρεαλισμό και στίχους χωρίς συμβιβασμούς.',
      en: 'Formerly known as Seib, Evoid represents the Larissa scene with a dark, distinctive sound and direct lyrics. Co-founder of Flowless Music alongside Black Vybez, his music is raw, unfiltered and uncompromising.'
    },
    socials: []
  },
  {
    id: 'blackvybez',
    name: 'BLACK VYBEZ',
    alias: 'VYBEZMADETHIS',
    role: { el: 'Artist & Producer', en: 'Artist & Producer' },
    tags: ['Πολλά στυλ', 'Beats'],
    tagsEn: ['Many styles', 'Beats'],
    bio: {
      el: 'Ο Black Vybez (Θοδωρής Παρασχάκης Νταμάς) γεννήθηκε στο Μεξικό και μεγάλωσε στην Ελλάδα. Μέσα από τη μουσική και τη δημόσια παρουσία του, δίνει φωνή στη νευροδιαφορετικότητα. Η πορεία του ξεκίνησε το 2008 από τη Λάρισα (ΑΨ, Στιχουργική Αναμέτρηση, LaCoast, 2410 Squad). Το 2018 στράφηκε στη σόλο πορεία, συνίδρυσε τη Landing Mind Records και σήμερα ηγείται της ανεξάρτητης Flowless Music μαζί με τον Evoid.',
      en: 'Black Vybez (Thodoris Paraschakis Ntamas) was born in Mexico and raised in Greece. Through his music and public presence he gives voice to neurodivergence. His journey began in 2008 in Larissa; in 2018 he went solo, co-founded Landing Mind Records, and today leads independent label Flowless Music alongside Evoid.'
    },
    socials: [
      { label: 'Instagram', url: 'https://www.instagram.com/blackvybez_' },
      { label: 'Spotify', url: 'https://open.spotify.com/artist/6I1CYhPF8JMoaCh2zIeGe3?si=4DZeUhbXRsCnK5AfYMdSAg' },
      { label: 'TikTok', url: 'https://www.tiktok.com/@blackvybez' },
      { label: 'Apple Music', url: 'https://music.apple.com/gr/artist/black-vybez/1510069891?l=el' },
      { label: 'Website', url: 'https://blackvybez.gr' }
    ]
  },
  {
    id: 'diem',
    name: 'DIEM',
    role: { el: 'Artist', en: 'Artist' },
    tags: ['Newschool Trap', 'Dancehall'],
    bio: {
      el: 'Με μακρά πορεία στον χώρο, ο Diem έγινε αρχικά γνωστός ως Μάριος ΑΦ μέσα από το σχήμα Απρόσμενες Φωνές, μια ομάδα που έγραψε τα δικά της χιλιόμετρα στην underground σκηνή της Λάρισας. Σήμερα δραστηριοποιείται καλλιτεχνικά στην Αθήνα, ενσωματώνοντας κινηματογραφικές εικόνες και ατμοσφαιρικά στοιχεία στη μουσική του.',
      en: 'With a long journey in the scene, Diem first became known as Marios AF through the group Aprosmenes Fones in Larissa\'s underground scene. Now based in Athens, he blends cinematic imagery and atmosphere into his music.'
    },
    socials: []
  },
  {
    id: 'bigg',
    name: 'BIG G',
    role: { el: 'Artist', en: 'Artist' },
    tags: ['Trap', 'Drill', 'Boom Bap'],
    bio: {
      el: 'Εκπροσωπώντας τη Λάρισα, ο Big G ξεχωρίζει για την αμεσότητα και τη δύναμη του στίχου του. Φέρνει έναν δυναμικό χαρακτήρα στη Flowless Music, με κοφτερό flow και στίχους που εστιάζουν στην ουσία.',
      en: 'Representing Larissa, Big G stands out for his directness and lyrical power — a dynamic voice on Flowless Music with sharp flow and no-filler bars.'
    },
    socials: []
  },
  {
    id: 'span',
    name: 'SPAN',
    role: { el: 'Producer', en: 'Producer' },
    tags: ['Beats'],
    bio: {
      el: 'Beats για όλο το roster — bio σύντομα.',
      en: 'Beats for the whole roster — bio coming soon.'
    },
    socials: []
  }
];

/* ---------- Latest Release Registry ---------- */
const LATEST_RELEASE = {
  artist: 'E-VOID',
  title: '2 Αλήθειες & 1 Ψέμα',
  desc: {
    el: 'Η νέα κυκλοφορία του E-Void σε παραγωγή Vybezmadethis.',
    en: 'The new E-Void release, produced by Vybezmadethis.'
  },
  cover: 'assets/evoid-2a1ps.jpg',
  spotify: 'https://open.spotify.com/album/3j6VCQ3hmB8iJKgDDRQQuG?si=-zlevQl9TL--yfvqUJm0Nw',
  youtube: 'https://www.youtube.com/watch?v=6epLhvZjmWk',
  appleMusic: 'https://music.apple.com/us/artist/e-void/1739868404'
};
const PLAYLIST_URL = 'https://open.spotify.com/playlist/766LR1ZtOxjvZ8fiRQLkMz?si=40bdc0412e1743f6';

/* ---------- Internationalization (i18n) ---------- */
const STRINGS = {
  en: {
    nav_release: 'Release',
    nav_roster: 'Roster',
    nav_playlist: 'Playlist',
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

function renderDetail() {
  const box = document.getElementById('artistDetail');
  if (!box) return;
  const a = ARTISTS.find(x => x.id === soloId);
  if (!a) { box.hidden = true; box.innerHTML = ''; return; }
  const tags = (lang === 'en' && a.tagsEn) ? a.tagsEn : a.tags;
  box.hidden = false;
  box.innerHTML = `
    <div class="artist-photo">${a.name.charAt(0)}</div>
    <div>
      <h3 class="detail-name">${a.name}</h3>
      ${a.alias ? `<p class="detail-alias">aka ${a.alias}</p>` : ''}
      <div class="artist-tags">${tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <p class="artist-bio">${a.bio[lang]}</p>
      <div class="artist-socials">
        ${a.socials.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`).join('')}
      </div>
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

/* ---------- App Entry Point ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
applyLang();

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
