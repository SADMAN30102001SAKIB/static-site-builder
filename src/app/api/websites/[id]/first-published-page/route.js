import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the website and its published pages
    const website = await prisma.website.findUnique({
      where: { id },
      include: {
        pages: {
          where: { published: true },
          orderBy: [
            { isHomePage: "desc" }, // Home page first
            { createdAt: "asc" }, // Then by creation date
          ],
          select: {
            id: true,
            path: true,
            isHomePage: true,
          },
        },
      },
    });

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    // Check if user owns this website
    if (website.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Find the first published page
    const firstPublishedPage = website.pages[0];

    if (!firstPublishedPage) {
      return NextResponse.json({ firstPublishedPage: null });
    }

    return NextResponse.json({
      firstPublishedPage: {
        id: firstPublishedPage.id,
        path: firstPublishedPage.path,
        isHomePage: firstPublishedPage.isHomePage,
      },
    });
  } catch (error) {
    console.error("Error getting first published page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
