const CACHE_NAME='fork-royale-shell-v1.0.0';
const SHELL=['./','./index.html','./manifest.webmanifest','./config.js','./firebase-adapter.js','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png','./icons/logo-full.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('fork-royale-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  // Never cache sign-in tokens, Firestore, Storage, or third-party APIs.
  if(url.origin!==location.origin)return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE_NAME).then(c=>c.put('./index.html',copy));}return r}).catch(()=>caches.match('./index.html')));
  }else e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)));
});
