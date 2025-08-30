// Super simple service worker for basic offline support
const CACHE_NAME = "static-site-builder-v1";

// Install event - cache essential items only
self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(async cache => {
        // Cache only essential items that we know exist
        try {
          return await cache.addAll(["/favicon.ico"]);
        } catch (error) {
          console.warn("Failed to cache some items during install:", error);
          return await Promise.resolve();
        }
      })
      .then(() => self.skipWaiting())
      .catch(error => {
        console.error("Service worker installation failed:", error);
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Fetch event - serve from cache when offline
self.addEventListener("fetch", event => {
  // Only handle GET requests from same origin
  if (
    event.request.method !== "GET" ||
    !event.request.url.startsWith(self.location.origin)
  ) {
    return;
  }

  // Skip API requests - let them fail naturally when offline
  if (event.request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If online and successful, update cache with fresh content
        if (response && response.status === 200 && response.type === "basic") {
          try {
            const responseClone = response.clone();
            caches
              .open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseClone))
              .catch(error => {
                console.warn("Failed to cache response:", error);
              });
          } catch (error) {
            console.warn("Failed to clone response:", error);
          }
        }
        return response;
      })
      .catch(() => {
        // If offline, serve from cache
        return caches
          .match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }

            // For HTML pages, return offline page
            if (event.request.headers.get("accept")?.includes("text/html")) {
              return new Response(
                `
                <!DOCTYPE html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Offline - Static Site Builder</title>
                    <style>
                      body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        text-align: center; 
                        padding: 50px 20px; 
                        max-width: 500px;
                        margin: 0 auto;
                        color: #333;
                      }
                      h1 { color: #e74c3c; margin-bottom: 20px; }
                      p { color: #666; line-height: 1.6; }
                      .retry-btn {
                        background: #3498db;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-top: 20px;
                      }
                    </style>
                  </head>
                  <body>
                    <h1>🔌 You're Offline</h1>
                    <p>This page isn't available offline.</p>
                    <p>Please check your internet connection and try again.</p>
                    <button class="retry-btn" onclick="window.location.reload()">Retry</button>
                  </body>
                </html>
                `,
                {
                  status: 200,
                  headers: { "Content-Type": "text/html; charset=utf-8" },
                },
              );
            }

            // For other requests, return a simple error response
            return new Response("Offline", {
              status: 503,
              statusText: "Service Unavailable",
            });
          })
          .catch(error => {
            console.error("Cache match failed:", error);
            return new Response("Cache Error", {
              status: 500,
              statusText: "Internal Server Error",
            });
          });
      }),
  );
});
