const CACHE_NAME = 'coast-fire-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/chart.js',
    '/fonts.css',
    '/fonts/Inter-Regular.woff2',
    '/fonts/Inter-Medium.woff2',
    '/fonts/Inter-SemiBold.woff2',
    '/fonts/Inter-Bold.woff2'
];

const CACHE_CONFIG = {
    // Cache for 1 year
    CACHE_TTL: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
    // Maximum number of items to cache
    MAX_ITEMS: 50,
    // Cache version
    VERSION: 'v1'
};

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return Promise.all([
                    cache.addAll(urlsToCache),
                    cache.put(new Request('/offline.html'), new Response('<h1>Offline</h1>', {
                        headers: { 'Content-Type': 'text/html' }
                    }))
                ]);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request).then(networkResponse => {
                    // Clone the response to store in cache
                    const responseToCache = networkResponse.clone();

                    // Open the cache and add the response
                    event.waitUntil(
                        caches.open(CACHE_NAME).then(cache => {
                            // Only cache GET requests
                            if (event.request.method === 'GET') {
                                return cache.put(event.request, responseToCache);
                            }
                        })
                    );

                    return networkResponse;
                }).catch(() => {
                    // Return cached response if available
                    return caches.match(event.request);
                });
            })
    );
});
