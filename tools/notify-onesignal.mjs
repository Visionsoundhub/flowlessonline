/* ============================================================
   Flowless — OneSignal push notifications
   Στέλνει μία push ειδοποίηση για κάθε νέο άρθρο που προστέθηκε
   στο τρέξιμο του agent σήμερα. Το secret ΔΕΝ μπαίνει ποτέ στο
   git repo (δημόσιο), διαβάζεται μόνο από τοπικό αρχείο.
   Τρέξε: node tools/notify-onesignal.mjs
   ============================================================ */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://flowlessmusic.gr';

async function main() {
  let secret;
  try {
    secret = JSON.parse(await readFile(path.join(ROOT, 'onesignal.secret.json'), 'utf8'));
  } catch {
    console.log('Δεν βρέθηκε onesignal.secret.json, παράλειψη ειδοποιήσεων.');
    return;
  }

  const data = JSON.parse(await readFile(path.join(ROOT, 'news.json'), 'utf8'));
  const posts = data.posts || [];
  const today = data.updated;
  const todaysPosts = posts.filter(p => p.date === today);

  let notified = [];
  try {
    notified = JSON.parse(await readFile(path.join(ROOT, '.onesignal-notified.json'), 'utf8'));
  } catch {}
  const notifiedSet = new Set(notified);

  const toSend = todaysPosts.filter(p => !notifiedSet.has(p.id));
  if (!toSend.length) {
    console.log('Καμία νέα ειδοποίηση να σταλεί.');
    return;
  }

  for (const p of toSend) {
    const isRelease = (p.streaming || []).length > 0;
    const heading = isRelease ? '🎵 Νέα κυκλοφορία — Flowless Music' : 'Flowless Music';
    const url = `${SITE}/news/${p.slug}`;
    try {
      const res = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': `Key ${secret.restApiKey}`
        },
        body: JSON.stringify({
          app_id: secret.appId,
          included_segments: ['Subscribed Users'],
          headings: { en: heading, el: heading },
          contents: { en: p.title, el: p.title },
          url
        })
      });
      const body = await res.json();
      if (!res.ok) {
        console.error('Αποτυχία ειδοποίησης για', p.title, body);
        continue;
      }
      console.log('Στάλθηκε ειδοποίηση:', p.title, '(recipients:', body.recipients ?? 0, ')');
      notifiedSet.add(p.id);
    } catch (e) {
      console.error('Σφάλμα δικτύου για', p.title, e.message);
    }
  }

  await writeFile(path.join(ROOT, '.onesignal-notified.json'), JSON.stringify([...notifiedSet], null, 2) + '\n');
}

main().catch(e => { console.error(e); process.exit(1); });
