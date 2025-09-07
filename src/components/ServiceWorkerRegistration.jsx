"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Check browser compatibility more thoroughly
    const isBraveOrChromium = /Chrome|Chromium|Brave/.test(navigator.userAgent);
    const isSecureContext =
      window.isSecureContext || location.protocol === "https:";

    console.log("SW Registration Check:", {
      hasNavigator: typeof navigator !== "undefined",
      hasServiceWorker:
        typeof navigator !== "undefined" && "serviceWorker" in navigator,
      nodeEnv: process.env.NODE_ENV,
      swEnabled: process.env.NEXT_PUBLIC_SW_ENABLED,
      isBraveOrChromium,
      isSecureContext,
      userAgent: navigator.userAgent.substring(0, 100),
      shouldRegister:
        "serviceWorker" in navigator &&
        isSecureContext &&
        (process.env.NODE_ENV === "production" ||
          process.env.NEXT_PUBLIC_SW_ENABLED === "true"),
    });

    // Enhanced compatibility check for Brave
    if (
      "serviceWorker" in navigator &&
      isSecureContext &&
      (process.env.NODE_ENV === "production" ||
        process.env.NEXT_PUBLIC_SW_ENABLED === "true")
    ) {
      // Add small delay for Brave compatibility
      const registerSW = async () => {
        try {
          console.log("🔄 Attempting to register service worker...");

          const registration = await navigator.serviceWorker.register(
            "/sw.js",
            {
              scope: "/",
              // Add updateViaCache for better Brave compatibility
              updateViaCache: "none",
            },
          );

          console.log("✅ SW registered successfully:", registration);

          // Check if SW is already controlling the page
          if (navigator.serviceWorker.controller) {
            console.log("✅ SW is controlling the page");
          } else {
            console.log("⏳ SW registered but not controlling yet");
          }

          // Listen for updates with better error handling
          registration.addEventListener("updatefound", () => {
            console.log("🔄 SW update found");
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                console.log(`🔄 SW state changed to: ${newWorker.state}`);
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
          console.error("❌ SW registration failed:", error);
          console.error("Error details:", {
            name: error.name,
            message: error.message,
            stack: error.stack,
          });
        }
      };

      // Register after a small delay for better Brave compatibility
      if (document.readyState === "complete") {
        setTimeout(registerSW, 100);
      } else {
        window.addEventListener("load", () => setTimeout(registerSW, 100));
      }
    } else {
      console.log("🔧 SW registration skipped:", {
        hasServiceWorker: "serviceWorker" in navigator,
        isSecureContext,
        isProduction: process.env.NODE_ENV === "production",
        swEnabled: process.env.NEXT_PUBLIC_SW_ENABLED === "true",
      });
    }
  }, []);

  return null; // This component doesn't render anything
}
