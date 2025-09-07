// Super simple service worker - just shows offline message when offline
// No caching - keeps it simple and reliable
// Enhanced compatibility for Brave browser

console.log("🔧 Service Worker loading...");

// Install event - just skip waiting, no caching
self.addEventListener("install", event => {
  console.log("🔧 SW Install event");
  self.skipWaiting();
});

// Activate event - take control immediately
self.addEventListener("activate", event => {
  console.log("🔧 SW Activate event");
  event.waitUntil(self.clients.claim());
});

// Fetch event - show offline message when network fails
self.addEventListener("fetch", event => {
  // Enhanced filtering for better Brave compatibility
  const url = new URL(event.request.url);
  
  // Only handle GET requests for HTML pages from same origin
  if (
    event.request.method !== "GET" ||
    url.origin !== self.location.origin ||
    !event.request.headers.get("accept")?.includes("text/html")
  ) {
    return;
  }

  // Skip API requests, static assets, and special paths
  if (
    url.pathname.includes("/api/") ||
    url.pathname.includes("/_next/") ||
    url.pathname.includes("/favicon") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".svg")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      // When offline, show offline message
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
              h1 { color: #e74c3c; margin-bottom: 20px; }
              p { color: #666; line-height: 1.6; }
              .retry-btn {
                background: #3498db;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                margin-top: 20px;
                font-size: 16px;
              }
              .retry-btn:hover {
                background: #2980b9;
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
    }),
  );
});
