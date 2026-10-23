/* Perícia Digital — Service Worker
 * Estratégia:
 *  - estáticos (ícones, retratos, _next/static, webp): cache-first
 *  - páginas HTML: network-first com fallback ao shell
 *  - APIs do jogo (sessão, chat, IA): somente rede — progresso nunca usa cache
 */
const CACHE_STATIC = "pericia-static-v3";
const PRECACHE = [
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
  "/icons/icon-maskable-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => cache.addAll(PRECACHE)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_STATIC).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

const isStatic = (url) =>
  url.pathname.startsWith("/icons/") ||
  url.pathname.startsWith("/people/") ||
  url.pathname.startsWith("/_next/static") ||
  /\.(webp|png|jpg|jpeg|svg|woff2?)$/i.test(url.pathname);

const isApi = (url) => url.pathname.startsWith("/api/");

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (isApi(url)) return; // jogo sempre ao vivo

  if (isStatic(url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(CACHE_STATIC).then((c) => c.put(request, copy)).catch(() => {});
            return res;
          })
      )
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match("/");
        return (
          cached ||
          new Response(
            "<html><body style='background:#0a0a0c;color:#c9a86a;font-family:monospace;display:flex;height:100vh;align-items:center;justify-content:center;text-align:center'><p>TERMINAL FORENSE OFFLINE<br/><small style='color:#9a958e'>verifique a conexão e recarregue</small></p></body></html>",
            { headers: { "Content-Type": "text/html; charset=utf-8" } }
          )
        );
      })
    );
  }
});
