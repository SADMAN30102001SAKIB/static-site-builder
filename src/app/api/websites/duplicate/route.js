import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { websiteId } = await request.json();

    if (!websiteId) {
      return NextResponse.json(
        { message: "Missing required field: websiteId" },
        { status: 400 },
      );
    }

    // Find the original website and verify ownership
    const originalWebsite = await prisma.website.findUnique({
      where: { id: websiteId },
      include: {
        pages: {
          include: {
            components: {
              orderBy: { position: "asc" },
            },
          },
        },
      },
    });

    if (!originalWebsite) {
      return NextResponse.json(
        { message: "Website not found" },
        { status: 404 },
      );
    }

    // Verify the user owns this website
    if (originalWebsite.userId !== session.user.id) {
      return NextResponse.json(
        { message: "You can only duplicate your own websites" },
        { status: 403 },
      );
    }

    // Generate unique name and slug for the duplicate
    const baseName = `${originalWebsite.name} - Copy`;
    let duplicateName = baseName;
    let duplicateSlug = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    let counter = 1;
    while (true) {
      const existingWebsite = await prisma.website.findFirst({
        where: {
          userId: session.user.id,
          OR: [{ name: duplicateName }, { slug: duplicateSlug }],
        },
      });

      if (!existingWebsite) break;

      counter++;
      duplicateName = `${baseName} ${counter}`;
      duplicateSlug = `${baseName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}-${counter}`;
    }

    // Create the duplicate website
    const duplicateWebsite = await prisma.website.create({
      data: {
        name: duplicateName,
        slug: duplicateSlug,
        description: originalWebsite.description,
        userId: session.user.id,
        published: false, // Start as draft
        isTemplate: false, // Don't copy template status
        templateDescription: null,
        templateTags: null,
        forkCount: 0,
      },
    });

    // Duplicate all pages and their components
    for (const originalPage of originalWebsite.pages) {
      const duplicatePage = await prisma.page.create({
        data: {
          title: originalPage.title,
          path: originalPage.path,
          description: originalPage.description,
          isHomePage: originalPage.isHomePage,
          published: false, // Start as draft
          websiteId: duplicateWebsite.id,
        },
      });

      // Create a mapping of old component IDs to new component IDs
      const componentIdMap = new Map();

      // First pass: Create all components without parent relationships
      for (const originalComponent of originalPage.components) {
        const duplicateComponent = await prisma.component.create({
          data: {
            type: originalComponent.type,
            position: originalComponent.position,
            properties: originalComponent.properties,
            pageId: duplicatePage.id,
            parentId: null, // Will be set in second pass
          },
        });
        componentIdMap.set(originalComponent.id, duplicateComponent.id);
      }

      // Second pass: Update parent relationships
      for (const originalComponent of originalPage.components) {
        if (originalComponent.parentId) {
          const newComponentId = componentIdMap.get(originalComponent.id);
          const newParentId = componentIdMap.get(originalComponent.parentId);

          if (newComponentId && newParentId) {
            await prisma.component.update({
              where: { id: newComponentId },
              data: { parentId: newParentId },
            });
          }
        }
      }
    }

    return NextResponse.json({
      message: "Website duplicated successfully",
      website: duplicateWebsite,
    });
  } catch (error) {
    console.error("Error duplicating website:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
