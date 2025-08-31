const CACHE_NAME = "wa-link-generator-v1";
const urlsToCache = [
  "/regal-web-apps/wa-link-generator/",
  "/regal-web-apps/wa-link-generator/index.html",
  "/regal-web-apps/wa-link-generator/app.js",
  "/regal-web-apps/wa-link-generator/styles.css",
  "/regal-web-apps/wa-link-generator/public/favicon.ico",
  "/regal-web-apps/wa-link-generator/public/apple-touch-icon.ico",
  "/regal-web-apps/wa-link-generator/public/android-chrome-192x192.ico",
  "/regal-web-apps/wa-link-generator/public/android-chrome-512x512.ico",
  "/regal-web-apps/wa-link-generator/public/manifest.json",
];

// Install event: Cache static assets for offline use
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Opened cache");
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error("Service Worker: Cache open failed:", error);
      })
  );
  self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log("Service Worker: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
      .catch((error) => {
        console.error("Service Worker: Activation failed:", error);
      })
  );
});

// Fetch event: Serve cached assets or fetch from network
self.addEventListener("fetch", (event) => {
  // Skip caching for API requests to ensure fresh responses
  if (
    event.request.url.includes("/api/shorten-url") ||
    event.request.url.includes("/netlify/functions/shorten-url")
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        return (
          response ||
          fetch(event.request).then((networkResponse) => {
            if (event.request.method === "GET") {
              return caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
            }
            return networkResponse;
          })
        );
      })
      .catch((error) => {
        console.error("Service Worker: Fetch failed:", error);
        return caches.match("/regal-web-apps/wa-link-generator/index.html");
      })
  );
});
