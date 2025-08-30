import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateFullPageHtml } from "../../../lib/serverPageRenderer.js";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    // Check if this request came from a custom domain
    const isCustomDomain = request.headers.get("x-custom-domain") === "true";
    const originalHost = request.headers.get("x-original-host");

    console.log("Looking for website with slug:", slug);
    console.log("Custom domain access:", { isCustomDomain, originalHost });

    // Find the website by slug or name
    let website = await prisma.website.findUnique({
      where: { slug },
      include: {
        pages: {
          where: { published: true }, // Only include published pages
          include: {
            components: {
              orderBy: {
                position: "asc",
              },
            },
          },
        },
      },
    });

    console.log(
      "Found website by slug:",
      website
        ? { id: website.id, name: website.name, slug: website.slug }
        : null,
    );

    if (!website) {
      // Try to find by name
      website = await prisma.website.findFirst({
        where: { name: slug },
        include: {
          pages: {
            where: { published: true },
            include: {
              components: {
                orderBy: {
                  position: "asc",
                },
              },
            },
          },
        },
      });

      console.log(
        "Found website by name:",
        website
          ? { id: website.id, name: website.name, slug: website.slug }
          : null,
      );
    }

    if (!website) {
      // Try to find by ID as fallback for development
      website = await prisma.website.findUnique({
        where: { id: slug },
        include: {
          pages: {
            where: { published: true },
            include: {
              components: {
                orderBy: {
                  position: "asc",
                },
              },
            },
          },
        },
      });

      console.log(
        "Fallback lookup by ID:",
        website
          ? { id: website.id, name: website.name, slug: website.slug }
          : null,
      );

      if (!website) {
        return NextResponse.json(
          { error: "Website not found" },
          { status: 404 },
        );
      }
    }

    // Check if website is published
    if (!website.published) {
      return new Response(
        `
        <html>
          <head>
            <title>${website.name}</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 40px; text-align: center; background-color: #f5f5f5; }
              .message { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .warning { color: #f59e0b; }
            </style>
          </head>
          <body>
            <div class="message">
              <h1 class="warning">Website Not Available</h1>
              <p>This website is currently not published and is not publicly accessible.</p>
            </div>
          </body>
        </html>
      `,
        {
          headers: { "Content-Type": "text/html" },
        },
      );
    }

    // Find the home page
    const homePage = website.pages.find(p => p.isHomePage);

    // If home page is not published, show "not published" message
    if (!homePage || !homePage.published) {
      return new Response(
        `
        <html>
          <head>
            <title>${website.name}</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 40px; text-align: center; background-color: #f5f5f5; }
              .message { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .warning { color: #f59e0b; }
            </style>
          </head>
          <body>
            <div class="message">
              <h1 class="warning">Home Page Not Published</h1>
              <p>The home page for this website is not published yet.</p>
            </div>
          </body>
        </html>
      `,
        {
          headers: { "Content-Type": "text/html" },
        },
      );
    }

    // If no published pages at all, show different message
    if (website.pages.length === 0) {
      return new Response(
        `
        <html>
          <head>
            <title>${website.name}</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 40px; text-align: center; background-color: #f5f5f5; }
              .message { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .warning { color: #f59e0b; }
            </style>
          </head>
          <body>
            <div class="message">
              <h1 class="warning">No Published Pages</h1>
              <p>This website doesn't have any published pages yet.</p>
            </div>
          </body>
        </html>
      `,
        {
          headers: { "Content-Type": "text/html" },
        },
      );
    }

    // Generate HTML for the page (same as preview)
    const pageHtml = generateFullPageHtml(
      homePage,
      website,
      false,
      isCustomDomain,
    );

    return new Response(pageHtml, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Error generating public site:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
