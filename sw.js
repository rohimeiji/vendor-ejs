var cacheName = 'app'

var offlinePage = [
    '/dashboard',
]

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    self.skipWaiting();
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                return caches.delete(key);
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('message', function(event){
    self.message = event.data
    if(self.message.onLine) caches.open(cacheName).then(function (cache) {
        self.offlinePage.forEach((page)=>{
            fetch(self.message.base_url+page,{
                credentials: "same-origin"
            }).then(function(response) {
                cache.put(self.message.base_url+page, response);
            }).catch((e)=>{  });
        })
    })
});

self.addEventListener('fetch', function (e) {
    e.respondWith(
        e.request.method == "GET" ? 
        caches.open(cacheName).then(function (cache) {
            return cache.match(e.request).then(function (response) {
                return fetch(e.request).then(function(response) {
                    cache.add(e.request)
                    return response
                }).catch(function () {
                    return response || cache.match('/fidelis-bakery/public/pos/dashboard')
                })
            })
        }) : fetch(e.request)
    );
});