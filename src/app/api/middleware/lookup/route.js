import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/middleware/lookup - Database lookup for middleware
export async function POST(request) {
  try {
    // Simple auth check for middleware
    const authHeader = request.headers.get("authorization");
    const expectedToken = `Bearer ${
      process.env.MIDDLEWARE_SECRET || "dev-secret"
    }`;

    if (authHeader !== expectedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { hostname } = await request.json();

    if (!hostname) {
      return NextResponse.json({ error: "Hostname required" }, { status: 400 });
    }

    console.log(`🔍 [MIDDLEWARE API] Looking up hostname: ${hostname}`);

    // Check for verified and published website
    const website = await prisma.website.findFirst({
      where: {
        customDomain: hostname,
        domainVerified: true,
        published: true,
      },
      select: {
        id: true,
        slug: true,
        name: true,
      },
    });

    // Check for unverified website
    const unverifiedWebsite = await prisma.website.findFirst({
      where: {
        customDomain: hostname,
      },
      select: {
        id: true,
        domainVerified: true,
        published: true,
      },
    });

    const result = {
      hostname,
      website: website || null,
      unverifiedWebsite: unverifiedWebsite || null,
      shouldRewrite: !!website,
      rewritePath: website ? `/site/${website.slug}` : null,
    };

    console.log(`📊 [MIDDLEWARE API] Result:`, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ [MIDDLEWARE API] Error:", error);
    return NextResponse.json(
      {
        error: "Database lookup failed",
        message: error.message,
      },
      { status: 500 },
    );
  }
}
