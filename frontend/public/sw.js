self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // A minimal fetch handler is required for PWA installability in Chrome
  // We don't need to cache anything for this basic requirement, just pass through.
});
