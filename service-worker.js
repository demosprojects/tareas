const CACHE_NAME = 'tareas-cache-v1';
const urlsToCache = [
  '/tareas/',
  '/tareas/index.html',
  '/tareas/estilo.css',
  '/tareas/script.js',
  '/tareas/logo2-.png',
  
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Archivos cacheados correctamente');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response; // Devolver desde la caché
        }
        return fetch(event.request); // Hacer una petición de red si no está en la caché
      })
  );
});
