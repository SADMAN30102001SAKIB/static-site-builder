import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Normalize positions to ensure sequential ordering
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { pageId } = await request.json();

    if (!pageId) {
      return NextResponse.json(
        { message: "Missing required field: pageId" },
        { status: 400 },
      );
    }

    // Verify the user owns the website containing this page
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: { website: true },
    });

    if (!page) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 });
    }

    if (page.website.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Get all components grouped by parent
    const allComponents = await prisma.component.findMany({
      where: { pageId },
      orderBy: [{ parentId: "asc" }, { position: "asc" }],
    });

    // Group components by parent
    const componentsByParent = {};
    allComponents.forEach(comp => {
      const parentKey = comp.parentId || "root";
      if (!componentsByParent[parentKey]) {
        componentsByParent[parentKey] = [];
      }
      componentsByParent[parentKey].push(comp);
    });

    // Normalize positions for each parent group
    const updates = [];

    for (const components of Object.values(componentsByParent)) {
      // Sort by current position and reassign sequential positions
      components.sort((a, b) => (a.position || 0) - (b.position || 0));

      components.forEach((comp, index) => {
        if (comp.position !== index) {
          updates.push(
            prisma.component.update({
              where: { id: comp.id },
              data: { position: index },
            }),
          );
        }
      });
    }

    // Execute all updates
    if (updates.length > 0) {
      await Promise.all(updates);
    }

    // Fetch and return all updated components
    const updatedComponents = await prisma.component.findMany({
      where: { pageId },
      orderBy: [{ parentId: "asc" }, { position: "asc" }],
    });

    const componentsWithParsedProps = updatedComponents.map(comp => ({
      ...comp,
      properties: comp.properties ? JSON.parse(comp.properties) : {},
    }));

    return NextResponse.json({
      message: `Normalized positions for ${updates.length} components`,
      components: componentsWithParsedProps,
    });
  } catch (error) {
    console.error("Error normalizing positions:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
