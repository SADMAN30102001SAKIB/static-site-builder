import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

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

    // Remove custom domain
    await prisma.website.update({
      where: { id: website.id },
      data: {
        customDomain: null,
        domainVerified: false,
      },
    });

    // TODO: Remove domain from Vercel via API

    return NextResponse.json({
      message: "Domain removed successfully",
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

      // TODO: Implement actual DNS verification
      // For now, we'll simulate verification

      await prisma.website.update({
        where: { id: website.id },
        data: {
          domainVerified: true,
        },
      });

      return NextResponse.json({
        message: "Domain verified successfully",
        verified: true,
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
