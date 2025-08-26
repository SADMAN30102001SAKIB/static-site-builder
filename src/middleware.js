import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Enhanced logging that works on Vercel
function middlewareLog(level, message, data = {}) {
  const timestamp = new Date().toISOString();

  // Console log for development
  console.log(`[${level.toUpperCase()}] ${message}`, data);

  // For production/Vercel, you could send to external logging service here
  // Example: send to DataDog, LogRocket, etc.
  if (process.env.VERCEL && level === "error") {
    // In production, you might want to send critical errors to an external service
    console.error(`${timestamp} - ${message}`, data);
  }
}

export async function middleware(request) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;
  const method = request.method;
  const url = request.nextUrl.href;
  const userAgent = request.headers.get("user-agent") || "";

  // Enhanced debugging logs
  middlewareLog("info", "🚀 [MIDDLEWARE] Request received", {
    method,
    url,
    hostname,
    pathname,
    userAgent: userAgent.substring(0, 100), // Truncate for cleaner logs
    environment: process.env.NODE_ENV,
    vercel: process.env.VERCEL ? "true" : "false",
  });

  // Skip middleware for:
  // - API routes (they should work normally)
  // - Next.js assets
  // - Development/local domains
  // - ngrok tunnels
  // NOTE: Removed .vercel.app check to allow custom domains on Vercel
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    hostname.includes("localhost") ||
    hostname.includes("127.0.0.1") ||
    hostname.includes(".ngrok.io")
  ) {
    middlewareLog("info", "⏭️ [MIDDLEWARE] Skipping middleware", {
      pathname,
      reason: "static/api route",
    });
    return NextResponse.next();
  }

  // Skip only for the main Vercel app domain, not custom domains
  const isMainVercelDomain =
    hostname.endsWith(".vercel.app") &&
    !hostname.includes("portfolio.sadman.me"); // Add other custom domains here if needed

  if (isMainVercelDomain) {
    middlewareLog(
      "info",
      "⏭️ [MIDDLEWARE] Skipping middleware for main Vercel domain",
      { hostname },
    );
    return NextResponse.next();
  }

  // Check if this is a custom domain
  try {
    middlewareLog("info", "🔍 [MIDDLEWARE] Checking custom domain", {
      hostname,
      pathname,
      queryStart: new Date().toISOString(),
    });

    const website = await prisma.website.findFirst({
      where: {
        customDomain: hostname,
        domainVerified: true,
        published: true,
      },
    });

    middlewareLog("info", "🔍 [MIDDLEWARE] Database query completed", {
      websiteFound: !!website,
      websiteId: website?.id,
      websiteSlug: website?.slug,
    });

    if (website) {
      // Rewrite to the site route with the website slug
      const url = request.nextUrl.clone();
      url.pathname = `/site/${website.slug}${pathname}`;

      middlewareLog("info", "🌐 [MIDDLEWARE] Custom domain rewrite", {
        from: `${hostname}${pathname}`,
        to: `/site/${website.slug}${pathname}`,
        rewriteUrl: url.href,
      });

      return NextResponse.rewrite(url);
    } else {
      // Check if domain exists but is not verified/published
      const unverifiedWebsite = await prisma.website.findFirst({
        where: {
          customDomain: hostname,
        },
      });

      middlewareLog("info", "🔍 [MIDDLEWARE] Unverified website check", {
        found: !!unverifiedWebsite,
        verified: unverifiedWebsite?.domainVerified,
        published: unverifiedWebsite?.published,
      });

      if (unverifiedWebsite) {
        const reason = !unverifiedWebsite.domainVerified
          ? "Domain not verified"
          : "Website not published";

        middlewareLog(
          "warn",
          "⚠️ [MIDDLEWARE] Domain found but not accessible",
          {
            hostname,
            reason,
          },
        );

        return new Response(
          `<html><body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #f59e0b;">Domain Configuration Pending</h1>
            <p>This domain is configured but not yet ready.</p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p>Please contact the site owner to complete the setup.</p>
          </body></html>`,
          {
            headers: { "Content-Type": "text/html" },
            status: 503,
          },
        );
      }
    }
  } catch (error) {
    middlewareLog("error", "❌ [MIDDLEWARE] Domain lookup error", {
      message: error.message,
      code: error.code,
      stack: error.stack,
      hostname,
      pathname,
    });
    // Continue to normal routing if database lookup fails
  }

  // If no custom domain match, continue with normal routing
  middlewareLog(
    "info",
    "➡️ [MIDDLEWARE] No custom domain match, continuing with normal routing",
    {
      hostname,
      pathname,
    },
  );
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
