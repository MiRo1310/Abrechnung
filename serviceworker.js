


self.addEventListener('install', event => {
    event.waitUntil(
        addResourcesToCache([
          "/",
          "/index.html",
          "/css/style.css",
          "/app.js",
          "/zaehlen.html",
          "/zeit.html",
          "/img/branding.png"
        ])
      );
});
self.addEventListener('fetch', event => {
});

self.addEventListener('activate', event => {
});

const addResourcesToCache = async (resources) => {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
  };