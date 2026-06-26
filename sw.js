const CACHE_NAME = "ghostlayer-v1-old";

const OLD_FILES = [
  "./old/index.html",
  "./old/ghost-note.txt",
  "./old/recovered-manifest.txt",
  "./attachments/ghostlayer_meetup.png",
  "./tools/decrypt_vault.html"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(OLD_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
