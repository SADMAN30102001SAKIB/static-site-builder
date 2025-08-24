import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Reorder components with proper position management
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { pageId, componentId, newPosition, newParentId } =
      await request.json();

    // Validate required fields
    if (!componentId || newPosition === undefined) {
      return NextResponse.json(
        {
          message:
            "Missing required fields: componentId and newPosition are required",
        },
        { status: 400 },
      );
    }

    // Get the component to move
    const component = await prisma.component.findUnique({
      where: { id: componentId },
      include: { page: { include: { website: true } } },
    });

    if (!component) {
      return NextResponse.json(
        { message: "Component not found" },
        { status: 404 },
      );
    }

    // Verify the user owns the website containing this component
    if (component.page.website.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const actualPageId = pageId || component.pageId;
    const oldPosition = component.position || 0;
    const oldParentId = component.parentId;

    // Use a transaction to ensure atomicity
    await prisma.$transaction(async tx => {
      // If moving within the same parent
      if (oldParentId === newParentId) {
        if (oldPosition === newPosition) return; // No change needed

        if (oldPosition < newPosition) {
          // Moving down: shift components between old and new position up by 1
          await tx.component.updateMany({
            where: {
              pageId: actualPageId,
              parentId: newParentId,
              position: {
                gt: oldPosition,
                lte: newPosition,
              },
              id: { not: componentId },
            },
            data: {
              position: { decrement: 1 },
            },
          });
        } else {
          // Moving up: shift components between new and old position down by 1
          await tx.component.updateMany({
            where: {
              pageId: actualPageId,
              parentId: newParentId,
              position: {
                gte: newPosition,
                lt: oldPosition,
              },
              id: { not: componentId },
            },
            data: {
              position: { increment: 1 },
            },
          });
        }
      } else {
        // Moving to different parent

        // Close gap in old parent: move all components after oldPosition up by 1
        await tx.component.updateMany({
          where: {
            pageId: actualPageId,
            parentId: oldParentId,
            position: { gt: oldPosition },
          },
          data: {
            position: { decrement: 1 },
          },
        });

        // Make space in new parent: move all components at or after newPosition down by 1
        await tx.component.updateMany({
          where: {
            pageId: actualPageId,
            parentId: newParentId,
            position: { gte: newPosition },
          },
          data: {
            position: { increment: 1 },
          },
        });
      }

      // Finally, update the moved component
      await tx.component.update({
        where: { id: componentId },
        data: {
          position: newPosition,
          parentId: newParentId,
        },
      });
    });

    // Fetch and return all updated components for the page
    const updatedComponents = await prisma.component.findMany({
      where: { pageId: actualPageId },
      orderBy: [{ parentId: "asc" }, { position: "asc" }],
    });

    // Parse properties for each component
    const componentsWithParsedProps = updatedComponents.map(comp => ({
      ...comp,
      properties: comp.properties ? JSON.parse(comp.properties) : {},
    }));

    return NextResponse.json({
      message: "Components reordered successfully",
      components: componentsWithParsedProps,
    });
  } catch (error) {
    console.error("Error reordering components:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
