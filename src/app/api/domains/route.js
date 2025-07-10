import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { addDomainToVercel } from "@/lib/vercel";

const prisma = new PrismaClient();

// GET /api/domains - Get all domains for the user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const websites = await prisma.website.findMany({
      where: {
        userId: session.user.id,
        customDomain: {
          not: null,
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        customDomain: true,
        domainVerified: true,
        published: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ domains: websites });
  } catch (error) {
    console.error("Error fetching domains:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/domains - Add custom domain to website
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { websiteId, customDomain } = await request.json();

    if (!websiteId || !customDomain) {
      return NextResponse.json(
        { error: "Website ID and custom domain are required" },
        { status: 400 },
      );
    }

    // Validate domain format using the same validation as vercel.js
    const domainRegex =
      /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

    if (!domainRegex.test(customDomain)) {
      return NextResponse.json(
        { error: "Invalid domain format" },
        { status: 400 },
      );
    }

    // Additional validation: reject localhost and IP addresses
    if (
      customDomain.includes("localhost") ||
      /^\d+\.\d+\.\d+\.\d+$/.test(customDomain)
    ) {
      return NextResponse.json(
        { error: "Localhost and IP addresses are not supported" },
        { status: 400 },
      );
    }

    // Reject common test domains
    const testDomains = ["example.com", "test.com", "localhost.com"];
    if (testDomains.includes(customDomain.toLowerCase())) {
      return NextResponse.json(
        { error: "Test domains are not allowed" },
        { status: 400 },
      );
    }

    // Check if domain is already taken
    const existingDomain = await prisma.website.findFirst({
      where: {
        customDomain: customDomain,
        NOT: {
          id: websiteId,
        },
      },
    });

    if (existingDomain) {
      return NextResponse.json(
        { error: "This domain is already in use" },
        { status: 409 },
      );
    }

    // Verify user owns the website
    const website = await prisma.website.findFirst({
      where: {
        id: websiteId,
        userId: session.user.id,
      },
    });

    if (!website) {
      return NextResponse.json(
        { error: "Website not found or access denied" },
        { status: 404 },
      );
    }

    // Update website with custom domain
    const updatedWebsite = await prisma.website.update({
      where: { id: websiteId },
      data: {
        customDomain: customDomain,
        domainVerified: false, // Reset verification status
      },
    });

    // Add domain to Vercel via API
    console.log(`🚀 Adding domain ${customDomain} to Vercel...`);
    const vercelResult = await addDomainToVercel(customDomain);

    if (!vercelResult.success) {
      // If Vercel fails, rollback database changes
      await prisma.website.update({
        where: { id: websiteId },
        data: {
          customDomain: null,
          domainVerified: false,
        },
      });

      return NextResponse.json(
        {
          error: `Failed to add domain to Vercel: ${vercelResult.error}`,
          details: "Your domain was not saved. Please try again.",
        },
        { status: 500 },
      );
    }

    console.log(`✅ Domain ${customDomain} successfully added to Vercel`);

    return NextResponse.json({
      message: "Domain added successfully",
      website: {
        id: updatedWebsite.id,
        name: updatedWebsite.name,
        customDomain: updatedWebsite.customDomain,
        domainVerified: updatedWebsite.domainVerified,
      },
      vercel: {
        success: true,
        message: "Domain registered with Vercel",
      },
    });
  } catch (error) {
    console.error("Error adding domain:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
