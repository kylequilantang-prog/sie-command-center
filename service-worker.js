// SIE Command Center — offline shell cache.
// Bump CACHE_VERSION when shipping new HTML/CSS/JS so clients pull fresh assets.

const CACHE_VERSION = 'sie-v2.1.0';
const CACHE_FILES = [
  './',
  './index.html',
  './css/styles.css',
  './js/data.js',
  './js/storage.js',
  './js/render.js',
  './js/app.js',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(CACHE_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  // Network-first for the HTML so updates land fast; cache-first for everything else.
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(
      fetch(req).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_VERSION).then((c) => c.put(req, clone));
        return res;
      }).catch(() => caches.match(req).then((m) => m || caches.match('./index.html')))
    );
    return;
  }
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      if (res.ok && new URL(req.url).origin === self.location.origin) {
        const clone = res.clone();
        caches.open(CACHE_VERSION).then((c) => c.put(req, clone));
      }
      return res;
    }).catch(() => cached))
  );
});
