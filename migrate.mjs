import fs from 'fs';
import path from 'path';

const outDir = 'src/content';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Home
fs.writeFileSync(path.join(outDir, 'home.json'), JSON.stringify({
  heroTitle: "Flowless Music",
  heroImage: "/assets/flbg.jpg",
  showRelease: true,
  releaseTitle: "Πρόσφατη Κυκλοφορία",
  releaseCover: "/assets/supersaiyan-artwork-1-.jpg",
  releaseSong: "Super Saiyan",
  releaseDesc: "Άκου την νέα κυκλοφορία του Big G σε συνεργασία με Vybezmadethis",
  releaseLinkUrl: "https://open.spotify.com/album/796fz2olD6KcrYUHPSaPQh?si=zrpsaLiLR_OW9RNxK_JfKw",
  releaseLinkType: "Spotify",
  aboutTitle: "About Flowless Music",
  aboutImage: "/assets/fmlogo.png",
  aboutText: "Η Flowless Music είναι ένα ανεξάρτητο label, θυγατρική της Landing Mind Records, που γεννήθηκε από την ανάγκη για αυθεντική καλλιτεχνική έκφραση. Χωρίς φίλτρα, χωρίς συμβιβασμούς.\n\nΔημιουργήθηκε από τους Black Vybez και Evoid, δύο καλλιτεχνες με ρίζες στη rap σκηνή, με έναν και μόνο στόχο: να δώσουμε στους καλλιτέχνες μας τα εργαλεία και την πλατφόρμα για να μοιραστούν την αλήθεια τους.\n\nΚάθε βήμα, κάθε παραγωγή, χρηματοδοτείται αποκλειστικά από εμάς. Η δική σας στήριξη είναι η κινητήρια δύναμη μας.",
  aboutTagline: "Δεν βάζουμε όρια στη μουσική. Είναι raw, είναι unfiltered, είναι Flowless."
}, null, 2));

// Radio
fs.writeFileSync(path.join(outDir, 'radio.json'), JSON.stringify({
  bannerImage: "/assets/scr-for-media-site-banner.jpg",
  heroTagline: "Η φωνή της underground σκηνής.",
  introTitle: "Soundcheck",
  introText: "ΝΕΑ ΣΕΖΟΝ ΕΡΧΕΤΑΙ ΣΥΝΤΟΜΑ",
  status: "OFF AIR",
  showSpotify: true
}, null, 2));

// Appearance
fs.writeFileSync(path.join(outDir, 'appearance.json'), JSON.stringify({
  accent: "#00FFD1"
}, null, 2));

// Roster
const rosterDir = path.join(outDir, 'roster');
if (!fs.existsSync(rosterDir)) fs.mkdirSync(rosterDir, { recursive: true });

const artists = [
  { featured: false, name: "Evoid", image: "/assets/160884503_548152709887793_4551602193781782500_n-1-.jpg", bio: "evoid" },
  { featured: true, name: "Big G", image: "/assets/587556159_18538878097040988_4265228645981321847_n-1-.jpg", bio: "Big G" },
  { featured: false, name: "Black vybez", image: "/assets/499664663_17878887024313464_4676727723261788379_n.jpg", bio: "black vybez" },
  { featured: false, name: "Diem", image: "/assets/image_202601312146-1-.jpeg", bio: "Diem" }
];

artists.forEach(a => {
  const slug = a.name.toLowerCase().replace(/ /g, '-');
  fs.writeFileSync(path.join(rosterDir, slug + '.json'), JSON.stringify(a, null, 2));
});

console.log('Migration complete');
