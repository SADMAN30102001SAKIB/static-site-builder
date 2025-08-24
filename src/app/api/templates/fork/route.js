import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Fork a template
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { templateId } = await request.json();

    if (!templateId) {
      return NextResponse.json(
        { message: "Missing required field: templateId" },
        { status: 400 },
      );
    }

    // Get the template with all its data
    const template = await prisma.website.findUnique({
      where: {
        id: templateId,
        isTemplate: true,
        published: true,
      },
      include: {
        pages: {
          include: {
            components: {
              orderBy: [{ parentId: "asc" }, { position: "asc" }],
            },
          },
        },
      },
    });

    if (!template) {
      return NextResponse.json(
        { message: "Template not found or not available" },
        { status: 404 },
      );
    }

    // Check if user already has a website with the same name
    const baseName = `${template.name} (Fork)`;
    let newName = baseName;
    let counter = 1;

    while (
      await prisma.website.findFirst({
        where: { name: newName }, // Check globally, not just current user
      })
    ) {
      newName = `${baseName} ${counter}`;
      counter++;
    }

    // Generate unique slug
    let baseSlug = `${template.slug}-fork`;
    let newSlug = baseSlug;
    counter = 1;

    while (await prisma.website.findFirst({ where: { slug: newSlug } })) {
      newSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Fork the website using a transaction
    const forkedWebsite = await prisma.$transaction(async tx => {
      // Create the new website
      const newWebsite = await tx.website.create({
        data: {
          name: newName,
          slug: newSlug,
          description: template.description
            ? `Forked from ${template.name}: ${template.description}`
            : `Forked from ${template.name}`,
          published: false, // User needs to publish manually
          isTemplate: false, // Forked sites are not templates by default
          userId: session.user.id,
        },
      });

      // Create pages and components
      for (const page of template.pages) {
        const newPage = await tx.page.create({
          data: {
            title: page.title,
            path: page.path,
            description: page.description,
            isHomePage: page.isHomePage,
            published: false, // User needs to publish manually
            websiteId: newWebsite.id,
          },
        });

        // Create components with their hierarchy
        const componentMapping = new Map(); // oldId -> newId

        // Sort components to create parents before children
        const sortedComponents = [...page.components].sort((a, b) => {
          if (!a.parentId && b.parentId) return -1;
          if (a.parentId && !b.parentId) return 1;
          return 0;
        });

        for (const component of sortedComponents) {
          const newComponent = await tx.component.create({
            data: {
              type: component.type,
              position: component.position,
              properties: component.properties,
              pageId: newPage.id,
              parentId: component.parentId
                ? componentMapping.get(component.parentId)
                : null,
            },
          });

          componentMapping.set(component.id, newComponent.id);
        }
      }

      // Increment fork count on the original template
      await tx.website.update({
        where: { id: templateId },
        data: { forkCount: { increment: 1 } },
      });

      return newWebsite;
    });

    return NextResponse.json({
      message: "Template forked successfully",
      website: forkedWebsite,
    });
  } catch (error) {
    console.error("Error forking template:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
