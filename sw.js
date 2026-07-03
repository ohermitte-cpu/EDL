// Service worker ultra-simple — hors-ligne uniquement
// PAS besoin de changer ce fichier à chaque mise à jour de l'app
const CACHE = 'edl-cache';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

// Stratégie : réseau d'abord, cache uniquement si hors-ligne
self.addEventListener('fetch', e => {
  // Ne pas intercepter les requêtes non-GET
  if(e.request.method !== 'GET') return;
  
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Mettre en cache la réponse fraîche
        const clone = res.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => {
        // Hors-ligne : servir depuis le cache
        return caches.match(e.request);
      })
  );
});
