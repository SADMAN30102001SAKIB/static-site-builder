// Enhanced service worker with pre-caching of important pages
const CACHE_NAME = "static-site-builder-v2";

// Define important pages to pre-cache
const ESSENTIAL_PAGES = [
  "/", // Home page
  "/login", // Login page
  "/register", // Register page
  "/dashboard", // Dashboard
  "/dashboard/websites", // Websites list
  "/dashboard/templates", // Templates
  "/favicon.ico", // Favicon
];

// Install event - pre-cache essential pages
self.addEventListener("install", event => {
  console.log("🔧 SW: Installing and pre-caching essential pages...");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(async cache => {
        // Pre-cache essential pages
        try {
          console.log("📦 SW: Pre-caching", ESSENTIAL_PAGES.length, "pages");

          // Cache pages one by one to handle failures gracefully
          const cachePromises = ESSENTIAL_PAGES.map(async url => {
            try {
              const response = await fetch(url);
              if (response.ok) {
                await cache.put(url, response);
                console.log("✅ SW: Cached", url);
              } else {
                console.warn("⚠️ SW: Failed to fetch", url, response.status);
              }
            } catch (error) {
              console.warn("❌ SW: Error caching", url, error.message);
            }
          });

          await Promise.allSettled(cachePromises);
          console.log("🎉 SW: Pre-caching complete");
        } catch (error) {
          console.error("❌ SW: Pre-caching failed:", error);
        }
      })
      .then(() => {
        console.log("⚡ SW: Skip waiting activated");
        return self.skipWaiting();
      })
      .catch(error => {
        console.error("❌ SW: Installation failed:", error);
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", event => {
  console.log("🔄 SW: Activating and cleaning old caches...");

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        const deletePromises = cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log("🗑️ SW: Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        });
        return Promise.all(deletePromises);
      })
      .then(() => {
        console.log("👑 SW: Claiming all clients");
        return self.clients.claim();
      }),
  );
});

// Fetch event - serve from cache when offline with intelligent caching
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
            const url = new URL(event.request.url);

            // Always cache important pages and assets
            const shouldCache =
              ESSENTIAL_PAGES.includes(url.pathname) ||
              url.pathname.startsWith("/dashboard") ||
              url.pathname.startsWith("/builder") ||
              url.pathname.endsWith(".css") ||
              url.pathname.endsWith(".js") ||
              url.pathname.endsWith(".ico") ||
              url.pathname.endsWith(".png") ||
              url.pathname.endsWith(".jpg") ||
              url.pathname.endsWith(".svg");

            if (shouldCache) {
              caches
                .open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseClone);
                  console.log("💾 SW: Cached", url.pathname);
                })
                .catch(error => {
                  console.warn("⚠️ SW: Failed to cache response:", error);
                });
            }
          } catch (error) {
            console.warn("⚠️ SW: Failed to clone response:", error);
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
              console.log("📱 SW: Serving from cache:", event.request.url);
              return cachedResponse;
            }

            // For HTML pages, return enhanced offline page
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
                        background: #f8f9fa;
                      }
                      .container {
                        background: white;
                        padding: 40px;
                        border-radius: 10px;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                      }
                      h1 { color: #e74c3c; margin-bottom: 20px; font-size: 2rem; }
                      p { color: #666; line-height: 1.6; margin-bottom: 15px; }
                      .retry-btn {
                        background: #3498db;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 6px;
                        cursor: pointer;
                        margin: 10px;
                        font-size: 16px;
                        transition: background 0.3s;
                      }
                      .retry-btn:hover {
                        background: #2980b9;
                      }
                      .home-btn {
                        background: #27ae60;
                      }
                      .home-btn:hover {
                        background: #229954;
                      }
                      .cached-pages {
                        margin-top: 30px;
                        text-align: left;
                      }
                      .cached-pages h3 {
                        color: #2c3e50;
                        margin-bottom: 10px;
                      }
                      .cached-pages a {
                        color: #3498db;
                        text-decoration: none;
                        display: block;
                        padding: 5px 0;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <h1>🔌 You're Offline</h1>
                      <p>This page isn't available offline, but some pages might be cached.</p>
                      <p>Please check your internet connection and try again.</p>
                      
                      <button class="retry-btn" onclick="window.location.reload()">🔄 Retry</button>
                      <button class="retry-btn home-btn" onclick="window.location.href='/'">🏠 Go Home</button>
                      
                      <div class="cached-pages">
                        <h3>📋 Available Offline Pages:</h3>
                        <a href="/">🏠 Home</a>
                        <a href="/dashboard">📊 Dashboard</a>
                        <a href="/dashboard/websites">🌐 Websites</a>
                        <a href="/dashboard/templates">📋 Templates</a>
                      </div>
                    </div>
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
            console.error("❌ SW: Cache match failed:", error);
            return new Response("Cache Error", {
              status: 500,
              statusText: "Internal Server Error",
            });
          });
      }),
  );
});
