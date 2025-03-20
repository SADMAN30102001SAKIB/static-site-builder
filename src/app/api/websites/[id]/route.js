import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

// Get a single website with its pages
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
    
    // Find the website and verify ownership
    const website = await prisma.website.findUnique({
      where: { id },
    });
    
    if (!website) {
      return NextResponse.json(
        { message: "Website not found" },
        { status: 404 }
      );
    }
    
    // Verify the user owns this website
    if (website.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // Get associated pages
    const pages = await prisma.page.findMany({
      where: { websiteId: id },
      orderBy: { isHomePage: 'desc' },
    });
    
    return NextResponse.json({ website, pages });
  } catch (error) {
    console.error("Error fetching website:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update a website
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
    const { name, description } = await request.json();
    
    // Find the website and verify ownership
    const website = await prisma.website.findUnique({
      where: { id },
    });
    
    if (!website) {
      return NextResponse.json(
        { message: "Website not found" },
        { status: 404 }
      );
    }
    
    // Verify the user owns this website
    if (website.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // Update the website
    const updatedWebsite = await prisma.website.update({
      where: { id },
      data: {
        name: name !== undefined ? name : website.name,
        description: description !== undefined ? description : website.description,
      },
    });
    
    return NextResponse.json({ website: updatedWebsite });
  } catch (error) {
    console.error("Error updating website:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete a website
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
    
    // Find the website and verify ownership
    const website = await prisma.website.findUnique({
      where: { id },
    });
    
    if (!website) {
      return NextResponse.json(
        { message: "Website not found" },
        { status: 404 }
      );
    }
    
    // Verify the user owns this website
    if (website.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // Delete all components associated with this website's pages
    await prisma.component.deleteMany({
      where: {
        page: {
          websiteId: id,
        },
      },
    });
    
    // Delete all pages associated with this website
    await prisma.page.deleteMany({
      where: { websiteId: id },
    });
    
    // Delete the website
    await prisma.website.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: "Website deleted successfully" });
  } catch (error) {
    console.error("Error deleting website:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
