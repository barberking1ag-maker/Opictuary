const CACHE_NAME = 'opictuary-v2';
const STATIC_CACHE = 'opictuary-static-v2';
const DYNAMIC_CACHE = 'opictuary-dynamic-v2';
const MEMORIAL_CACHE = 'opictuary-memorials-v2';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/offline.html'
];

const CACHEABLE_API_ENDPOINTS = [
  '/api/memorials/',
  '/api/support/articles',
  '/api/support/grief-resources',
  '/api/products',
  '/api/celebrations/public'
];

self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker v2');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker v2');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return !cacheName.includes('-v2');
          })
          .map((cacheName) => {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  if (request.method !== 'GET') {
    return;
  }

  if (url.pathname.startsWith('/api/memorials/') && !url.pathname.includes('/admin')) {
    event.respondWith(handleMemorialRequest(request));
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    const isCacheable = CACHEABLE_API_ENDPOINTS.some(ep => url.pathname.startsWith(ep));
    if (isCacheable) {
      event.respondWith(handleCacheableApiRequest(request));
    } else {
      event.respondWith(handleApiRequest(request));
    }
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  event.respondWith(handleStaticRequest(request));
});

async function handleMemorialRequest(request) {
  const cache = await caches.open(MEMORIAL_CACHE);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      console.log('[SW] Serving cached memorial');
      const headers = new Headers(cached.headers);
      headers.set('X-Offline-Cache', 'true');
      return new Response(cached.body, {
        status: cached.status,
        statusText: cached.statusText,
        headers: headers
      });
    }
    return new Response(
      JSON.stringify({ 
        error: 'Memorial not available offline', 
        offline: true,
        message: 'This memorial is not saved for offline viewing. Connect to the internet to view it.'
      }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

async function handleCacheableApiRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      console.log('[SW] Serving cached API response');
      return cached;
    }
    return new Response(
      JSON.stringify({ error: 'You are offline', offline: true }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

async function handleApiRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'You are offline', 
        offline: true,
        message: 'This feature requires an internet connection.'
      }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    
    const indexCached = await caches.match('/');
    if (indexCached) return indexCached;
    
    const offlinePage = await caches.match('/offline.html');
    if (offlinePage) return offlinePage;
    
    return new Response('You are offline', { status: 503 });
  }
}

async function handleStaticRequest(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    const url = new URL(request.url);
    
    if (response.ok && shouldCacheStatic(url.pathname)) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Resource not available offline', { status: 503 });
  }
}

function shouldCacheStatic(pathname) {
  const cacheableExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.woff', '.woff2'];
  return cacheableExtensions.some(ext => pathname.endsWith(ext));
}

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_MEMORIAL') {
    event.waitUntil(cacheMemorial(event.data.memorialId));
  }
  
  if (event.data && event.data.type === 'GET_CACHED_MEMORIALS') {
    event.waitUntil(getCachedMemorials(event));
  }
});

async function cacheMemorial(memorialId) {
  try {
    const response = await fetch(`/api/memorials/${memorialId}`);
    if (response.ok) {
      const cache = await caches.open(MEMORIAL_CACHE);
      await cache.put(new Request(`/api/memorials/${memorialId}`), response);
      console.log('[SW] Cached memorial:', memorialId);
    }
  } catch (error) {
    console.error('[SW] Failed to cache memorial:', error);
  }
}

async function getCachedMemorials(event) {
  try {
    const cache = await caches.open(MEMORIAL_CACHE);
    const keys = await cache.keys();
    const memorialIds = keys
      .map(req => {
        const match = req.url.match(/\/api\/memorials\/([^/?]+)/);
        return match ? match[1] : null;
      })
      .filter(Boolean);
    
    event.source.postMessage({
      type: 'CACHED_MEMORIALS',
      memorialIds: memorialIds
    });
  } catch (error) {
    console.error('[SW] Failed to get cached memorials:', error);
  }
}
