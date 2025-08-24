import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Add component with proper position management
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { type, pageId, position, parentId, properties } =
      await request.json();

    // Validate required fields
    if (!type || !pageId) {
      return NextResponse.json(
        { message: "Missing required fields: type and pageId are required" },
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

    const insertPosition = position || 0;

    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async tx => {
      // Shift existing components at or after the insert position
      await tx.component.updateMany({
        where: {
          pageId,
          parentId,
          position: { gte: insertPosition },
        },
        data: {
          position: { increment: 1 },
        },
      });

      // Create the new component at the desired position
      const component = await tx.component.create({
        data: {
          type,
          position: insertPosition,
          parentId,
          properties: properties ? JSON.stringify(properties) : null,
          pageId,
        },
      });

      return component;
    });

    // Parse the properties JSON string to an object for the response
    const componentWithParsedProps = {
      ...result,
      properties: result.properties ? JSON.parse(result.properties) : {},
    };

    // Fetch all components for the page to return updated state
    const allComponents = await prisma.component.findMany({
      where: { pageId },
      orderBy: [{ parentId: "asc" }, { position: "asc" }],
    });

    const componentsWithParsedProps = allComponents.map(comp => ({
      ...comp,
      properties: comp.properties ? JSON.parse(comp.properties) : {},
    }));

    return NextResponse.json(
      {
        message: "Component added successfully",
        component: componentWithParsedProps,
        components: componentsWithParsedProps,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding component:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
