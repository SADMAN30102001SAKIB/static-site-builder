import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateFullPageHtml } from "../../../lib/serverPageRenderer.js";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id: websiteId } = await params;

    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: {
        pages: {
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

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    // Preview mode: Show pages regardless of website publish status
    // (Preview is for testing before publishing)

    // Find the home page or first page (show ALL pages for preview, not just published)
    const homePage = website.pages.find(p => p.isHomePage) || website.pages[0];

    if (!homePage) {
      return new Response(
        `
        <html>
          <head>
            <title>Preview - ${website.name}</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 40px; text-align: center; background-color: #1f2937; color: #f9fafb; }
              .message { max-width: 600px; margin: 0 auto; background: #374151; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .warning { color: #fbbf24; }
            </style>
          </head>
          <body>
            <div class="message">
              <h1 class="warning">No Pages</h1>
              <p>This website doesn't have any pages yet.</p>
              <p>Please create at least one page from the dashboard to preview the website.</p>
            </div>
          </body>
        </html>
      `,
        {
          headers: { "Content-Type": "text/html" },
        },
      );
    }

    // Generate HTML for the page with navigation
    const pageHtml = generateFullPageHtml(homePage, website, true);

    return new Response(pageHtml, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Error generating preview:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
