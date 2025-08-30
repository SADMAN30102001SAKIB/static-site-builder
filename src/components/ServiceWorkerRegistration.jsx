"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Debug info
    console.log("SW Registration Check:", {
      hasNavigator: typeof navigator !== "undefined",
      hasServiceWorker:
        typeof navigator !== "undefined" && "serviceWorker" in navigator,
      nodeEnv: process.env.NODE_ENV,
      swEnabled: process.env.NEXT_PUBLIC_SW_ENABLED,
      shouldRegister:
        "serviceWorker" in navigator &&
        (process.env.NODE_ENV === "production" ||
          process.env.NEXT_PUBLIC_SW_ENABLED === "true"),
    });

    // Only register in production or when explicitly enabled
    if (
      "serviceWorker" in navigator &&
      (process.env.NODE_ENV === "production" ||
        process.env.NEXT_PUBLIC_SW_ENABLED === "true")
    ) {
      window.addEventListener("load", async () => {
        try {
          console.log("🔄 Attempting to register service worker...");

          const registration = await navigator.serviceWorker.register(
            "/sw.js",
            {
              scope: "/",
            },
          );

          console.log("✅ SW registered successfully: ", registration);

          // Listen for updates
          registration.addEventListener("updatefound", () => {
            console.log("🔄 SW update found");
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  console.log("🔄 New service worker available!");
                }
              });
            }
          });
        } catch (error) {
          console.error("❌ SW registration failed: ", error);
        }
      });
    } else {
      console.log(
        "🔧 SW registration skipped - not in production or not enabled",
      );
    }
  }, []);

  return null; // This component doesn't render anything
}
