const CACHE_NAME = 'bluepay-v1';
const STATIC_ASSETS = [
  '/', '/index.html', '/global.css', '/app.js', 
  '/firebase-config.js', '/components.js', '/chart-utils.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(STATIC_ASSETS)));
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Never cache Firebase API calls
  if (url.origin.includes('googleapis') || url.origin.includes('firebase')) return;

  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
