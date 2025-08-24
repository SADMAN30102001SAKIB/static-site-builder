import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Remove a website from templates
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { websiteId } = await request.json();

    if (!websiteId) {
      return NextResponse.json(
        { message: "Missing required field: websiteId" },
        { status: 400 },
      );
    }

    // Verify the user owns the website
    const website = await prisma.website.findUnique({
      where: { id: websiteId },
    });

    if (!website) {
      return NextResponse.json(
        { message: "Website not found" },
        { status: 404 },
      );
    }

    if (website.userId !== session.user.id) {
      return NextResponse.json(
        { message: "You don't own this website" },
        { status: 403 },
      );
    }

    if (!website.isTemplate) {
      return NextResponse.json(
        { message: "Website is not currently shared as a template" },
        { status: 400 },
      );
    }

    // Update the website to remove it from templates
    const updatedWebsite = await prisma.website.update({
      where: { id: websiteId },
      data: {
        isTemplate: false,
        templateDescription: null,
        templateTags: null,
      },
    });

    return NextResponse.json({
      message: "Website removed from templates successfully",
      website: updatedWebsite,
    });
  } catch (error) {
    console.error("Error removing website from templates:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
