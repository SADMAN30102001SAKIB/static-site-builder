import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function middleware(request) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Skip middleware for:
  // - API routes (they should work normally)
  // - Next.js assets
  // - Vercel preview deployments
  // - Development/local domains
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    hostname.includes("localhost") ||
    hostname.includes("127.0.0.1") ||
    hostname.includes(".vercel.app") ||
    hostname.includes(".ngrok.io")
  ) {
    return NextResponse.next();
  }

  // Check if this is a custom domain
  try {
    const website = await prisma.website.findFirst({
      where: {
        customDomain: hostname,
        domainVerified: true,
        published: true,
      },
    });

    if (website) {
      // Rewrite to the site route with the website slug
      const url = request.nextUrl.clone();
      url.pathname = `/site/${website.slug}${pathname}`;

      console.log(
        `🌐 Custom domain "${hostname}" → rewriting to "/site/${website.slug}${pathname}"`,
      );

      return NextResponse.rewrite(url);
    }
  } catch (error) {
    console.error("❌ Middleware domain lookup error:", error);
    // Continue to normal routing if database lookup fails
  }

  // If no custom domain match, continue with normal routing
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
