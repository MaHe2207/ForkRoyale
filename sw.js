/* Fork Royale PWA – version 1.0.3 */
const CACHE = 'fork-royale-shell-v1.0.3';
const SHELL = ['./','./index.html','./manifest.json','./manifest.webmanifest','./config.js','./firebase-adapter.js','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./logo-full.png'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Optional resource failures do not prevent the service worker from activating.
    await Promise.allSettled(SHELL.map(async url => {
      const response = await fetch(url, {cache:'reload'});
      if (!response.ok) throw new Error(url + ': HTTP ' + response.status);
      await cache.put(url, response);
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('fork-royale-') && key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(response=>{
      if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put('./index.html',copy)));}
      return response;
    }).catch(async()=>await caches.match('./index.html') || Response.error()));
  }else{
    event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
  }
});
