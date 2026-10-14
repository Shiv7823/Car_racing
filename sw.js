// ============================================================================
// SERVICE WORKER — APEX LEGENDS CIRCUIT PWA (Offline Cache & Install Support)
// ============================================================================
const CACHE_NAME = 'apex-circuit-v2';

// Core assets to cache for offline play (relative paths for maximum portability)
const CORE_ASSETS = [
  './',
  './index.html',
  './hud.css',
  './renderPipeline.js',
  './sceneLighting.js',
  './trackMaterialsAndArchitecture.js',
  './carShaderSetup.js',
  './touchController.js',
  './manifest.json',
  './icons/icon-512.svg',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// CDN resources to cache (Three.js post-processing & PeerJS)
const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/CopyShader.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/LuminosityHighPassShader.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/EffectComposer.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/RenderPass.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/ShaderPass.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/UnrealBloomPass.js',
  'https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js'
];

// Install event — cache core assets gracefully
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Cache local assets
      await Promise.allSettled(
        CORE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[SW] Core asset cache skip:', url, err);
          })
        )
      );

      // Cache CDN assets
      await Promise.allSettled(
        CDN_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[SW] CDN asset cache skip:', url, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// Activate event — clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event — stale-while-revalidate for assets, network-first for navigation
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // For HTML navigation requests — network first with cache fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() =>
          caches.match(event.request).then((cached) =>
            cached || caches.match('./index.html') || caches.match('index.html')
          )
        )
    );
    return;
  }

  // For static assets — cache first, network update in background
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Refresh cache in background
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      // Not cached — fetch from network and cache
      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          if (event.request.destination === 'image') {
            return new Response('', { status: 404, statusText: 'Not Found' });
          }
          return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        });
    })
  );
});
