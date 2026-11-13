/* Theory service worker: everything works offline after the first visit. */
const VERSION = 'theory-v4';
const SHELL = [
  './', 'index.html', 'styles.css?v=3', 'app.js?v=4', 'manifest.webmanifest', 'data/bank.json',
  'icons/icon-192.png?v=1', 'icons/icon-512.png?v=1', 'icons/apple-touch-icon.png?v=1',
  'fonts/inter-latin-standard-normal.woff2', 'fonts/inter-latin-ext-standard-normal.woff2', 'fonts/inter-greek-standard-normal.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)));
    await self.clients.claim();
    // Warm the picture cache in the background so the whole bank works offline.
    try {
      const cache = await caches.open(VERSION);
      const res = await cache.match('data/bank.json');
      const bank = res && await res.json();
      const imgs = bank ? [...new Set(bank.questions.filter((q) => q.img).map((q) => 'img/' + q.img))] : [];
      for (let i = 0; i < imgs.length; i += 12) {
        await Promise.all(imgs.slice(i, i + 12).map(async (u) => {
          if (!(await cache.match(u))) { try { await cache.add(u); } catch (_) {} }
        }));
      }
    } catch (_) {}
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(fetch(req.url, { cache: 'no-store', credentials: 'same-origin' }).then((res) => {
      const copy = res.clone(); caches.open(VERSION).then((c) => c.put('index.html', copy)); return res;
    }).catch(() => caches.match('index.html')));
    return;
  }
  event.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
    return res;
  })));
});
