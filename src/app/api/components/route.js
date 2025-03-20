import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

// Create a new component
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { type, pageId, position, parentId, properties } = await request.json();
    
    // Validate required fields
    if (!type || !pageId) {
      return NextResponse.json(
        { message: "Missing required fields: type and pageId are required" },
        { status: 400 }
      );
    }
    
    // Verify the user owns the website containing this page
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: { website: true },
    });
    
    if (!page) {
      return NextResponse.json(
        { message: "Page not found" },
        { status: 404 }
      );
    }
    
    if (page.website.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // Create the component
    const component = await prisma.component.create({
      data: {
        type,
        position: position || 0,
        parentId,
        properties: properties ? JSON.stringify(properties) : null,
        pageId,
      },
    });
    
    return NextResponse.json(
      { 
        message: "Component created successfully",
        component
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating component:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
