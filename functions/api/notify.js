/* ============================================================
   Flowless — Cloudflare Pages Function
   POST /api/notify  { email, audienceId }
   Προσθέτει το email στο σωστό Resend Audience. Το κλειδί
   RESEND_API_KEY διαβάζεται από τα Cloudflare env vars, ΠΟΤΕ
   από τον κώδικα (το repo είναι δημόσιο).
   ============================================================ */

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' }
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.RESEND_API_KEY) {
    return json({ error: 'Λείπει το RESEND_API_KEY στις ρυθμίσεις του Cloudflare' }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid body' }, 400);
  }

  const email = String(body.email || '').trim().toLowerCase();
  const audienceId = String(body.audienceId || '').trim();

  if (!EMAIL_RE.test(email)) return json({ error: 'Μη έγκυρο email' }, 400);
  if (!audienceId) return json({ error: 'Λείπει το audienceId' }, 400);

  const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ email, unsubscribed: false })
  });

  if (!res.ok) {
    const err = await res.text();
    // Το Resend επιστρέφει σφάλμα και για ήδη υπάρχον email, το δεχόμαστε ως επιτυχία
    if (res.status === 409 || /already exists/i.test(err)) {
      return json({ ok: true, already: true });
    }
    return json({ error: 'Απέτυχε η εγγραφή', detail: err }, 502);
  }

  return json({ ok: true });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type'
    }
  });
}
