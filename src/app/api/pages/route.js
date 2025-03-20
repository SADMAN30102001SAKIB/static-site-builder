import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

// Get all pages for a website
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get the website ID from the query params
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get("websiteId");
    
    if (!websiteId) {
      return NextResponse.json(
        { message: "Website ID is required" },
        { status: 400 }
      );
    }
    
    // Verify the user owns the website
    const website = await prisma.website.findUnique({
      where: { id: websiteId },
    });
    
    if (!website) {
      return NextResponse.json(
        { message: "Website not found" },
        { status: 404 }
      );
    }
    
    if (website.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // Get all pages for the website
    const pages = await prisma.page.findMany({
      where: { websiteId },
      orderBy: { createdAt: 'asc' },
    });
    
    return NextResponse.json({ pages });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Create a new page
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { title, path, websiteId, isHomePage } = await request.json();
    
    // Validate required fields
    if (!title || !path || !websiteId) {
      return NextResponse.json(
        { message: "Missing required fields: title, path, and websiteId are required" },
        { status: 400 }
      );
    }
    
    // Verify the user owns the website
    const website = await prisma.website.findUnique({
      where: { id: websiteId },
    });
    
    if (!website) {
      return NextResponse.json(
        { message: "Website not found" },
        { status: 404 }
      );
    }
    
    if (website.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // Check if a page with the same path already exists for this website
    const existingPage = await prisma.page.findFirst({
      where: {
        websiteId,
        path,
      },
    });
    
    if (existingPage) {
      return NextResponse.json(
        { message: "A page with this path already exists for this website" },
        { status: 400 }
      );
    }
    
    // If this is a home page, update any existing home page
    if (isHomePage) {
      await prisma.page.updateMany({
        where: {
          websiteId,
          isHomePage: true,
        },
        data: {
          isHomePage: false,
        },
      });
    }
    
    // Create the page
    const page = await prisma.page.create({
      data: {
        title,
        path,
        isHomePage: isHomePage || false,
        websiteId,
      },
    });
    
    return NextResponse.json(
      { 
        message: "Page created successfully",
        page
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating page:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
