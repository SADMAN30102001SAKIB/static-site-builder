import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { removeDomainFromVercel, verifyDomainWithVercel } from "@/lib/vercel";

const prisma = new PrismaClient();

// DELETE /api/domains/[domain] - Remove custom domain
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { domain } = await params;

    // Find and verify website ownership
    const website = await prisma.website.findFirst({
      where: {
        customDomain: domain,
        userId: session.user.id,
      },
    });

    if (!website) {
      return NextResponse.json(
        { error: "Domain not found or access denied" },
        { status: 404 },
      );
    }

    // Remove custom domain from database
    await prisma.website.update({
      where: { id: website.id },
      data: {
        customDomain: null,
        domainVerified: false,
      },
    });

    // Remove domain from Vercel via API
    console.log(`🗑️ Removing domain ${domain} from Vercel...`);
    const vercelResult = await removeDomainFromVercel(domain);

    if (!vercelResult.success) {
      console.error(
        `❌ Failed to remove domain ${domain} from Vercel:`,
        vercelResult.error,
      );
      // Don't fail the request - domain is already removed from database
      return NextResponse.json({
        message:
          "Domain removed from database, but failed to remove from Vercel",
        warning: vercelResult.error,
      });
    }

    console.log(`✅ Domain ${domain} successfully removed from Vercel`);

    return NextResponse.json({
      message: "Domain removed successfully",
      vercel: {
        success: true,
        message: "Domain removed from Vercel",
      },
    });
  } catch (error) {
    console.error("Error removing domain:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/domains/[domain] - Update domain verification status
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { domain } = await params;
    const { action } = await request.json();

    if (action === "verify") {
      // Find website
      const website = await prisma.website.findFirst({
        where: {
          customDomain: domain,
          userId: session.user.id,
        },
      });

      if (!website) {
        return NextResponse.json(
          { error: "Domain not found or access denied" },
          { status: 404 },
        );
      }

      // Verify domain with Vercel API
      console.log(`🔍 Verifying domain ${domain} with Vercel...`);
      const vercelResult = await verifyDomainWithVercel(domain);

      if (!vercelResult.success) {
        return NextResponse.json(
          {
            error: `Failed to verify domain with Vercel: ${vercelResult.error}`,
            details: "Please check your DNS configuration and try again.",
          },
          { status: 400 },
        );
      }

      // Update verification status based on Vercel response
      const isVerified = vercelResult.verified;

      await prisma.website.update({
        where: { id: website.id },
        data: {
          domainVerified: isVerified,
        },
      });

      console.log(
        `${isVerified ? "✅" : "⚠️"} Domain ${domain} verification status: ${
          isVerified ? "verified" : "pending"
        }`,
      );

      return NextResponse.json({
        message: isVerified
          ? "Domain verified successfully"
          : "Domain verification pending - please check DNS configuration",
        verified: isVerified,
        vercel: {
          success: true,
          verified: isVerified,
          data: vercelResult.data,
        },
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating domain:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
