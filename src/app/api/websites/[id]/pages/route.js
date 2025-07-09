import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Get all pages for a specific website
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Find the website first to verify ownership
    const website = await prisma.website.findUnique({
      where: { id },
    });

    if (!website) {
      return NextResponse.json(
        { message: "Website not found" },
        { status: 404 },
      );
    }

    // Verify the user owns this website
    if (website.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Get all pages for this website
    const pages = await prisma.page.findMany({
      where: { websiteId: id },
      orderBy: [{ isHomePage: "desc" }, { updatedAt: "desc" }],
    });

    return NextResponse.json({ pages });
  } catch (error) {
    console.error("Error fetching website pages:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// Create a new page for a website
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { title, path, description, isHomePage } = await request.json();

    // Basic validation
    if (!title || !path) {
      return NextResponse.json(
        { message: "Title and path are required" },
        { status: 400 },
      );
    }

    // Find the website first to verify ownership
    const website = await prisma.website.findUnique({
      where: { id },
    });

    if (!website) {
      return NextResponse.json(
        { message: "Website not found" },
        { status: 404 },
      );
    }

    // Verify the user owns this website
    if (website.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // If setting as home page, first clear any existing home pages
    if (isHomePage) {
      await prisma.page.updateMany({
        where: {
          websiteId: id,
          isHomePage: true,
        },
        data: { isHomePage: false },
      });
    }

    // Create the new page
    const page = await prisma.page.create({
      data: {
        title,
        path,
        description,
        isHomePage: isHomePage || false,
        websiteId: id,
      },
    });

    return NextResponse.json(
      { message: "Page created successfully", page },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating page:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
