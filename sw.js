/*  Satoshi PWA — Service Worker
 *  Cache-first for app shell, network-first for API data
 */

const SHELL_CACHE = 'satoshi-v15';
const API_CACHE   = 'satoshi-api-v1';
const API_TTL     = 5 * 60 * 1000; // 5 minutes

const SHELL_FILES = [
  '/',
  '/index.html',
  '/rabbit-hole.js',
  '/manifest.json',
  '/icons/icon.svg'
];

const API_ORIGINS = [
  'blockchain.info',
  'api.coingecko.com',
  'mempool.space'
];

/* ── Install: pre-cache app shell ────────────────────────────── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

/* ── Activate: purge old caches ──────────────────────────────── */
self.addEventListener('activate', (event) => {
  const keepCaches = new Set([SHELL_CACHE, API_CACHE]);
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !keepCaches.has(key))
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* ── Message handler: skip waiting on demand ─────────────────── */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/* ── Fetch: strategy router ──────────────────────────────────── */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // API calls → network-first with TTL cache
  if (API_ORIGINS.some((origin) => url.hostname === origin || url.hostname.endsWith('.' + origin))) {
    event.respondWith(networkFirstWithTTL(request));
    return;
  }

  // Everything else (shell / static assets) → cache-first
  event.respondWith(cacheFirst(request));
});

/* ── Cache-first strategy ────────────────────────────────────── */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(SHELL_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Fallback to offline page if available
    return caches.match('/index.html');
  }
}

/* ── Network-first with TTL for API responses ────────────────── */
async function networkFirstWithTTL(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const clone = response.clone();
      const cache = await caches.open(API_CACHE);
      // Store timestamp alongside the response via a wrapper header
      const headers = new Headers(clone.headers);
      headers.set('sw-cache-time', Date.now().toString());
      const timestamped = new Response(await clone.blob(), {
        status: clone.status,
        statusText: clone.statusText,
        headers
      });
      cache.put(request, timestamped);
    }
    return response;
  } catch {
    // Network failed — try cache if within TTL
    const cached = await caches.match(request);
    if (cached) {
      const cacheTime = Number(cached.headers.get('sw-cache-time') || 0);
      if (Date.now() - cacheTime < API_TTL) {
        return cached;
      }
    }
    return new Response(JSON.stringify({ error: 'offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
