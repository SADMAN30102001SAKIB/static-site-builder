import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

// Get a single page with its components
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    
    // Find the page
    const page = await prisma.page.findUnique({
      where: { id },
      include: { 
        website: true,
        components: true
      },
    });
    
    if (!page) {
      return NextResponse.json(
        { message: "Page not found" },
        { status: 404 }
      );
    }
    
    // Verify the user owns the website containing this page
    if (page.website.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // Parse the properties JSON string for each component
    const pageWithParsedComponents = {
      ...page,
      components: page.components.map(component => ({
        ...component,
        properties: component.properties ? JSON.parse(component.properties) : {}
      }))
    };
    
    return NextResponse.json({ page: pageWithParsedComponents });
  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update a page
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    const updates = await request.json();
    
    // Find the page and verify ownership
    const page = await prisma.page.findUnique({
      where: { id },
      include: { website: true },
    });
    
    if (!page) {
      return NextResponse.json(
        { message: "Page not found" },
        { status: 404 }
      );
    }
    
    // Verify the user owns the website containing this page
    if (page.website.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // If updating to home page, update any existing home page
    if (updates.isHomePage) {
      await prisma.page.updateMany({
        where: {
          websiteId: page.websiteId,
          isHomePage: true,
          id: { not: id }
        },
        data: {
          isHomePage: false,
        },
      });
    }
    
    // Update the page
    const updatedPage = await prisma.page.update({
      where: { id },
      data: updates,
    });
    
    return NextResponse.json({ 
      message: "Page updated successfully",
      page: updatedPage
    });
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete a page
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    
    // Find the page and verify ownership
    const page = await prisma.page.findUnique({
      where: { id },
      include: { website: true },
    });
    
    if (!page) {
      return NextResponse.json(
        { message: "Page not found" },
        { status: 404 }
      );
    }
    
    // Verify the user owns the website containing this page
    if (page.website.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // Don't allow deleting the home page if it's the only page
    if (page.isHomePage) {
      const pageCount = await prisma.page.count({
        where: { websiteId: page.websiteId },
      });
      
      if (pageCount === 1) {
        return NextResponse.json(
          { message: "Cannot delete the only page of a website" },
          { status: 400 }
        );
      }
    }
    
    // Delete all components of the page
    await prisma.component.deleteMany({
      where: { pageId: id },
    });
    
    // Delete the page
    await prisma.page.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: "Page deleted successfully" });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
