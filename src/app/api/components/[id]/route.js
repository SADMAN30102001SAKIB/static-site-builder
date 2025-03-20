import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

// Get a single component
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
    
    // Find the component
    const component = await prisma.component.findUnique({
      where: { id },
      include: { page: { include: { website: true } } },
    });
    
    if (!component) {
      return NextResponse.json(
        { message: "Component not found" },
        { status: 404 }
      );
    }
    
    // Verify the user owns the website containing this component
    if (component.page.website.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // Parse the properties JSON string to an object
    const componentWithParsedProps = {
      ...component,
      properties: component.properties ? JSON.parse(component.properties) : {},
    };
    
    return NextResponse.json({ component: componentWithParsedProps });
  } catch (error) {
    console.error("Error fetching component:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update a component
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
    
    // Find the component and verify ownership
    const component = await prisma.component.findUnique({
      where: { id },
      include: { page: { include: { website: true } } },
    });
    
    if (!component) {
      return NextResponse.json(
        { message: "Component not found" },
        { status: 404 }
      );
    }
    
    // Verify the user owns the website containing this component
    if (component.page.website.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // Update the component
    const updatedComponent = await prisma.component.update({
      where: { id },
      data: {
        ...updates,
        // Convert properties to a JSON string if it exists in the updates
        ...(updates.properties ? { properties: JSON.stringify(updates.properties) } : {})
      },
    });
    
    return NextResponse.json({ 
      message: "Component updated successfully",
      component: updatedComponent
    });
  } catch (error) {
    console.error("Error updating component:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete a component
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
    
    // Find the component and verify ownership
    const component = await prisma.component.findUnique({
      where: { id },
      include: { page: { include: { website: true } } },
    });
    
    if (!component) {
      return NextResponse.json(
        { message: "Component not found" },
        { status: 404 }
      );
    }
    
    // Verify the user owns the website containing this component
    if (component.page.website.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // Recursively find and delete all child components
    const deleteChildComponents = async (parentId) => {
      const children = await prisma.component.findMany({
        where: { parentId },
      });
      
      for (const child of children) {
        await deleteChildComponents(child.id);
      }
      
      await prisma.component.deleteMany({
        where: { parentId },
      });
    };
    
    // Delete all child components first
    await deleteChildComponents(id);
    
    // Delete the component
    await prisma.component.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: "Component deleted successfully" });
  } catch (error) {
    console.error("Error deleting component:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
