import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/debug/domain/[domain] - Debug specific domain
export async function GET(request, { params }) {
  try {
    const { domain } = await params;

    console.log(`🔍 [DEBUG DOMAIN] Checking domain: ${domain}`);

    // Check if domain exists in database
    const website = await prisma.website.findFirst({
      where: {
        customDomain: domain,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        pages: {
          select: {
            id: true,
            title: true,
            path: true,
            isHomePage: true,
            published: true,
          },
        },
      },
    });

    // Also check for verified and published version
    const verifiedWebsite = await prisma.website.findFirst({
      where: {
        customDomain: domain,
        domainVerified: true,
        published: true,
      },
    });

    const debugInfo = {
      domain,
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: !!process.env.VERCEL,
        databaseUrl: process.env.DATABASE_URL ? "SET" : "NOT SET",
      },
      websiteFound: !!website,
      website: website || null,
      verifiedAndPublishedWebsite: !!verifiedWebsite,
      middlewareWouldMatch: !!(
        verifiedWebsite &&
        verifiedWebsite.domainVerified &&
        verifiedWebsite.published
      ),
      redirectPath: verifiedWebsite ? `/site/${verifiedWebsite.slug}` : null,
    };

    return NextResponse.json(debugInfo, { status: 200 });
  } catch (error) {
    console.error("❌ [DEBUG DOMAIN] Error:", error);
    return NextResponse.json(
      {
        error: "Debug domain API error",
        message: error.message,
        stack: error.stack,
        domain: params?.domain || "unknown",
      },
      { status: 500 },
    );
  }
}
