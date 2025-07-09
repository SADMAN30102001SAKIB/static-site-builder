import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateFullPageHtml } from "../../../../lib/serverPageRenderer.js";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id: websiteId, pagePath } = await params;

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

    // Find the specific page by path (show ALL pages for preview, not just published)
    // Handle both "/about" and "about" formats by normalizing both sides
    const normalizedPagePath = pagePath.startsWith("/")
      ? pagePath
      : `/${pagePath}`;

    // Also try to match without the leading slash in case the stored path doesn't have one
    const page = website.pages.find(
      p =>
        p.path === normalizedPagePath ||
        p.path === pagePath ||
        `/${p.path}` === normalizedPagePath,
    );

    if (!page) {
      return new Response(
        `
        <html>
          <head>
            <title>Page Not Found - ${website.name}</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 40px; text-align: center; background-color: #f5f5f5; }
              .message { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .warning { color: #f59e0b; }
              .nav { margin-top: 30px; }
              .nav a { color: #007bff; text-decoration: none; margin: 0 10px; }
              .nav a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <div class="message">
              <h1 class="warning">Page Not Found</h1>
              <p>The page "${pagePath}" was not found or is not published.</p>
              <div class="nav">
                <a href="/preview/${websiteId}">← Back to Home</a>
              </div>
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
    const pageHtml = generateFullPageHtml(page, website, true);

    return new Response(pageHtml, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Error generating page preview:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
