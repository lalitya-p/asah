const CACHE = 'asah-shell-v1';
const PAGES = ['/', '/tersimpan', '/perkembangan', '/riwayat', '/pengaturan', '/transparansi', '/dukungan', '/manifest.webmanifest', '/asah-icon.svg'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(async cache => { await Promise.all(PAGES.map(async url => { try { const response = await fetch(url); if (response.ok) await cache.put(url,response); } catch {} })); })); self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k.startsWith('asah-shell-') && k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('message', event => {
  if (event.data?.type !== 'CACHE_RESOURCES' || !Array.isArray(event.data.urls)) return;
  event.waitUntil(caches.open(CACHE).then(cache => Promise.all(event.data.urls.map(async value => {
    try { const url = new URL(value); if (url.origin !== self.location.origin || url.pathname.includes('/api/') || url.pathname.includes('__vite')) return; if (await cache.match(url.href)) return; const response = await fetch(url.href); if (response.ok) await cache.put(url.href,response); } catch {}
  }))));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.includes('/api/') || url.pathname.includes('__vite')) return;
  event.respondWith((async()=>{
    const cache = await caches.open(CACHE);
    try { const response = await fetch(event.request); if (response.ok && response.status===200) await cache.put(event.request,response.clone()); return response; }
    catch { const saved = await cache.match(event.request, {ignoreVary:true}); if (saved) return saved; if (event.request.mode === 'navigate') { const shell = await cache.match('/', {ignoreVary:true}); if (shell) return shell; } return new Response('Konten belum tersimpan. Sambungkan perangkat untuk membukanya.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}}); }
  })());
});