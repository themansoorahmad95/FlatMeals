// FlatMeals Service Worker
const CACHE_NAME = 'flatmeals-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Background sync for offline headcount submissions
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync-headcount') {
    event.waitUntil(syncHeadcount());
  }
});

async function syncHeadcount() {
  // Sync any pending headcount data when back online
  const pendingData = await getStoredHeadcountData();
  if (pendingData) {
    try {
      await submitHeadcountToServer(pendingData);
      await clearStoredHeadcountData();
    } catch (error) {
      console.log('Sync failed, will retry later');
    }
  }
}

async function getStoredHeadcountData() {
  // Implementation would get data from IndexedDB
  return null;
}

async function submitHeadcountToServer(data) {
  // Implementation would submit to your API
}

async function clearStoredHeadcountData() {
  // Implementation would clear stored data
}