// www.flowlessmusic.gr -> flowlessmusic.gr (ένα domain για τη Google)
export async function onRequest(ctx) {
  const url = new URL(ctx.request.url);
  if (url.hostname.startsWith('www.')) {
    url.hostname = url.hostname.slice(4);
    return Response.redirect(url.toString(), 301);
  }
  return ctx.next();
}
