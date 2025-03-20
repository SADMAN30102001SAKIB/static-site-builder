import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../../auth/[...nextauth]/route";

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
    const { published } = await request.json();
    
    if (typeof published !== 'boolean') {
      return NextResponse.json(
        { message: "Published status must be a boolean" },
        { status: 400 }
      );
    }
    
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
    
    // Update the published status
    const updatedWebsite = await prisma.website.update({
      where: { id },
      data: { published },
    });
    
    return NextResponse.json({
      message: published ? "Website published successfully" : "Website unpublished successfully",
      website: updatedWebsite
    });
  } catch (error) {
    console.error("Error updating publish status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
