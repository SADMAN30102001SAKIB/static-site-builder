import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id: websiteId, pageId } = await params;

    const page = await prisma.page.findFirst({
      where: {
        id: pageId,
        websiteId: websiteId,
      },
      include: {
        components: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id: websiteId, pageId } = await params;
    const data = await request.json();

    // Update or create page
    await prisma.page.upsert({
      where: { id: pageId },
      update: {
        title: data.title || "Untitled",
        path: data.path || `/${data.slug || "home"}`,
        description: data.description || "",
        isHomePage: data.slug === "home" || false,
        updatedAt: new Date(),
      },
      create: {
        id: pageId,
        websiteId: websiteId,
        title: data.title || "Home",
        path: data.path || `/${data.slug || "home"}`,
        description: data.description || "",
        isHomePage: data.slug === "home" || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Handle components
    if (data.components && Array.isArray(data.components)) {
      // Delete existing components
      await prisma.component.deleteMany({
        where: { pageId: pageId },
      });

      // Create new components
      if (data.components.length > 0) {
        await prisma.component.createMany({
          data: data.components.map((comp, index) => ({
            id: comp.id,
            pageId: pageId,
            type: comp.type,
            properties: JSON.stringify(comp.properties || {}),
            position: comp.position || index,
            parentId: comp.parentId || null,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
        });
      }
    }

    // Fetch updated page with components
    const updatedPage = await prisma.page.findUnique({
      where: { id: pageId },
      include: {
        components: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { pageId } = await params;

    await prisma.page.delete({
      where: { id: pageId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
