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

    // Validate template integrity
    if (!template.pages || template.pages.length === 0) {
      return NextResponse.json(
        { message: "Template has no pages to fork" },
        { status: 400 },
      );
    }

    // Check for any pages without valid paths
    const invalidPages = template.pages.filter(
      page => !page.path || page.path.trim() === "",
    );
    if (invalidPages.length > 0) {
      console.warn(
        `Template ${templateId} has pages with invalid paths:`,
        invalidPages.map(p => p.id),
      );
    }

    // Generate unique name and slug with retry logic
    const generateUniqueName = async baseName => {
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        const testName = attempts === 0 ? baseName : `${baseName} ${attempts}`;
        const existing = await prisma.website.findFirst({
          where: { name: testName },
        });

        if (!existing) return testName;
        attempts++;
      }

      // Fallback with timestamp if all attempts fail
      return `${baseName} ${Date.now()}`;
    };

    const generateUniqueSlug = async baseSlug => {
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        const testSlug = attempts === 0 ? baseSlug : `${baseSlug}-${attempts}`;
        const existing = await prisma.website.findFirst({
          where: { slug: testSlug },
        });

        if (!existing) return testSlug;
        attempts++;
      }

      // Fallback with timestamp if all attempts fail
      return `${baseSlug}-${Date.now()}`;
    };

    const baseName = `${template.name} (Fork)`;
    const baseSlug = `${template.slug}-fork`;

    const newName = await generateUniqueName(baseName);
    const newSlug = await generateUniqueSlug(baseSlug);

    // Fork the website using smaller transactions to avoid timeouts
    // Step 1: Create the new website
    const newWebsite = await prisma.website.create({
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

    try {
      // Step 2: Create pages and components
      for (const page of template.pages) {
        const newPage = await prisma.page.create({
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

        // Validate component hierarchy
        const allComponents = page.components;
        const componentIds = new Set(allComponents.map(c => c.id));

        // Filter out components with invalid parent references
        const validComponents = allComponents.filter(component => {
          if (component.parentId && !componentIds.has(component.parentId)) {
            console.warn(
              `Component ${component.id} has invalid parent ${component.parentId}, making it a root component`,
            );
            component.parentId = null;
          }
          return true;
        });

        // Sort components to create parents before children
        const sortedComponents = [...validComponents].sort((a, b) => {
          if (!a.parentId && b.parentId) return -1;
          if (a.parentId && !b.parentId) return 1;
          return 0;
        });

        // Create all root components first (no parentId)
        const rootComponents = sortedComponents.filter(c => !c.parentId);
        const childComponents = sortedComponents.filter(c => c.parentId);

        // Process root components first
        for (const component of rootComponents) {
          // Update any URLs in component properties that reference the original website
          let updatedProperties = component.properties;
          if (updatedProperties) {
            try {
              const props = JSON.parse(updatedProperties);
              // Update any URLs that contain the original slug
              if (props.url && typeof props.url === "string") {
                props.url = props.url.replace(
                  new RegExp(`/${template.slug}/`, "g"),
                  `/${newSlug}/`,
                );
              }
              updatedProperties = JSON.stringify(props);
            } catch (e) {
              // If properties aren't valid JSON, keep original
              updatedProperties = component.properties;
            }
          }

          const newComponent = await prisma.component.create({
            data: {
              type: component.type,
              position: component.position,
              properties: updatedProperties,
              pageId: newPage.id,
              parentId: null,
            },
          });
          componentMapping.set(component.id, newComponent.id);
        }

        // Then process child components in batches
        const BATCH_SIZE = 5;
        for (let i = 0; i < childComponents.length; i += BATCH_SIZE) {
          const batch = childComponents.slice(i, i + BATCH_SIZE);

          for (const component of batch) {
            // Make sure parent exists in mapping
            const parentId = component.parentId
              ? componentMapping.get(component.parentId)
              : null;

            // Skip if parent doesn't exist (orphaned component)
            if (component.parentId && !parentId) {
              console.warn(
                `Skipping orphaned component ${component.id} - parent ${component.parentId} not found`,
              );
              continue;
            }

            try {
              // Update any URLs in component properties that reference the original website
              let updatedProperties = component.properties;
              if (updatedProperties) {
                try {
                  const props = JSON.parse(updatedProperties);
                  // Update any URLs that contain the original slug
                  if (props.url && typeof props.url === "string") {
                    props.url = props.url.replace(
                      new RegExp(`/${template.slug}/`, "g"),
                      `/${newSlug}/`,
                    );
                  }
                  updatedProperties = JSON.stringify(props);
                } catch (e) {
                  // If properties aren't valid JSON, keep original
                  updatedProperties = component.properties;
                }
              }

              const newComponent = await prisma.component.create({
                data: {
                  type: component.type,
                  position: component.position,
                  properties: updatedProperties,
                  pageId: newPage.id,
                  parentId: parentId,
                },
              });

              componentMapping.set(component.id, newComponent.id);
            } catch (componentError) {
              console.error(
                `Failed to create component ${component.id}:`,
                componentError,
              );
              // Continue with other components rather than failing the entire fork
            }
          }
        }
      }

      // Step 3: Increment fork count on the original template
      await prisma.website.update({
        where: { id: templateId },
        data: { forkCount: { increment: 1 } },
      });

      const forkedWebsite = newWebsite;

      return NextResponse.json({
        message: "Template forked successfully",
        website: forkedWebsite,
      });
    } catch (componentError) {
      // If component creation fails, cleanup the website we created
      console.error("Error creating components:", componentError);

      try {
        await prisma.website.delete({ where: { id: newWebsite.id } });
      } catch (cleanupError) {
        console.error("Error cleaning up website:", cleanupError);
      }

      throw componentError;
    }
  } catch (error) {
    console.error("Error forking template:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
