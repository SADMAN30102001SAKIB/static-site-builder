import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Share a website as a template
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { websiteId, templateDescription, templateTags } =
      await request.json();

    if (!websiteId) {
      return NextResponse.json(
        { message: "Missing required field: websiteId" },
        { status: 400 },
      );
    }

    // Verify the user owns the website and it's published
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

    if (!website.published) {
      return NextResponse.json(
        { message: "Website must be published before sharing as template" },
        { status: 400 },
      );
    }

    // Check if website has a published home page
    const publishedHomePage = await prisma.page.findFirst({
      where: {
        websiteId: websiteId,
        isHomePage: true,
        published: true,
      },
    });

    if (!publishedHomePage) {
      return NextResponse.json(
        {
          message:
            "Website must have a published home page before sharing as template",
        },
        { status: 400 },
      );
    }

    if (website.isTemplate) {
      return NextResponse.json(
        { message: "Website is already shared as a template" },
        { status: 400 },
      );
    }

    // Update the website to mark it as a template
    const updatedWebsite = await prisma.website.update({
      where: { id: websiteId },
      data: {
        isTemplate: true,
        templateDescription: templateDescription || website.description,
        templateTags: templateTags || null,
      },
    });

    return NextResponse.json({
      message: "Website shared as template successfully",
      website: updatedWebsite,
    });
  } catch (error) {
    console.error("Error sharing website as template:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
