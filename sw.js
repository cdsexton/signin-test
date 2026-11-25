// Keeps a copy of this page so it can reopen offline. Never touches sign-in, tokens, or photos.
const CACHE = 'signin-test-v1';
self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE).then(c => c.add(new Request('./', { cache: 'reload' }))).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('signin-test-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.mode !== 'navigate' || e.request.url.split(/[?#]/)[0] !== self.registration.scope) return;
  e.respondWith(fetch(e.request).catch(() => caches.match('./', { ignoreSearch: true })));
});
