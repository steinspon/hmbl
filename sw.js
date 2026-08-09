/*
 * Himmelblå service worker.
 *
 * Strategy:
 * - Pages (navigations, *.html) and the content file (site-data.js) are
 *   NETWORK-FIRST: always fresh when online, falling back to the cached copy
 *   only when offline. This means content edits show up immediately.
 * - Everything else (CSS, scripts, logos, icons, photos, PDFs) is
 *   STALE-WHILE-REVALIDATE: served instantly from cache and refreshed in the
 *   background.
 *
 * The app still works fully offline after the first visit. Bump CACHE_VERSION
 * whenever the shell asset list changes, to retire the old cache.
 */
const CACHE_VERSION = "hmbl-v23";

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
  "things-to-do.html",
  "bicycle-trips.html",
  "walks.html",
  "sightseeing.html",
  "activity.html",
  "styles/common.css",
  "scripts/theme.js",
  "scripts/search-target.js",
  "scripts/site-data.js",
  "scripts/trip-list.js",
  "scripts/electricity-price.js",
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

function isContent(request, url) {
  return request.mode === "navigate" ||
    url.pathname.endsWith(".html") ||
    url.pathname.endsWith("/site-data.js");
}

// Network-first: fresh when online, cached copy as offline fallback.
function networkFirst(request) {
  return fetch(request)
    .then((response) => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
      }
      return response;
    })
    .catch(() =>
      caches.match(request).then((cached) => {
        if (cached) return cached;
        if (request.mode === "navigate") return caches.match("index.html");
        return new Response("", { status: 504, statusText: "Offline" });
      })
    );
}

// Stale-while-revalidate: instant from cache, refreshed in the background.
function staleWhileRevalidate(request) {
  return caches.match(request).then((cached) => {
    const network = fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => null);

    if (cached) return cached;
    return network.then((response) => {
      if (response) return response;
      return new Response("", { status: 504, statusText: "Offline" });
    });
  });
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // let cross-origin (CDN, Bosch) pass through

  event.respondWith(isContent(request, url) ? networkFirst(request) : staleWhileRevalidate(request));
});
