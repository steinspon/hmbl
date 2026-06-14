/*
 * Himmelblå service worker.
 *
 * - Precaches the app shell (pages, styles, scripts, logos, icons) so the app
 *   opens instantly and works fully offline after the first visit.
 * - Caches photos and PDFs on first access (they are large, so they are not
 *   precached up front).
 *
 * Bump CACHE_VERSION whenever shell assets change, to retire the old cache.
 */
const CACHE_VERSION = "hmbl-v1";

const SHELL = [
  "./",
  "index.html",
  "contacts.html",
  "guides.html",
  "guide.html",
  "navigate.html",
  "rigdown.html",
  "search.html",
  "settings.html",
  "specs.html",
  "styles/common.css",
  "scripts/theme.js",
  "scripts/search-target.js",
  "scripts/site-data.js",
  "manifest.json",
  "logo_winter_daytime.webp",
  "logo_summer_daytime.webp",
  "logo-night.webp",
  "favicon-32.png",
  "icon-180.png",
  "icon-192.png",
  "icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // let cross-origin (CDN, Bosch) pass through

  event.respondWith(
    caches.match(request).then((cached) => {
      // Serve from cache, refresh in the background (stale-while-revalidate).
      const network = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => null);

      if (cached) {
        network; // fire-and-forget refresh
        return cached;
      }

      return network.then((response) => {
        if (response) return response;
        // Offline and uncached: fall back to the app shell for page navigations.
        if (request.mode === "navigate") return caches.match("index.html");
        return new Response("", { status: 504, statusText: "Offline" });
      });
    })
  );
});
