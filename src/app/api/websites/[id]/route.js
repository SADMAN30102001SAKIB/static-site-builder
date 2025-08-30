import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Get a single website with its pages
export async function GET(request, { params }) {
  try {
    // Check if there's a session cookie at all
    const cookies = request.headers.get("cookie");
    console.log("Website API - Has cookies:", cookies ? "Yes" : "No");

    const session = await getServerSession(authOptions);

    console.log("Website API - Session:", session ? "Valid" : "Invalid");
    console.log("Website API - User ID:", session?.user?.id);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Find the website and verify ownership
    const website = await prisma.website.findUnique({
      where: { id },
    });

    console.log("Website API - Website found:", website ? "Yes" : "No");
    console.log("Website API - Website userId:", website?.userId);

    if (!website) {
      return NextResponse.json(
        { message: "Website not found" },
        { status: 404 },
      );
    }

    // Verify the user owns this website
    if (website.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Get associated pages
    const pages = await prisma.page.findMany({
      where: { websiteId: id },
      orderBy: [
        { isHomePage: "desc" }, // Home page first
        { createdAt: "asc" }, // Then by creation date (oldest first)
      ],
    });

    // Find the first published page for "View Site" optimization
    const firstPublishedPage =
      pages.find(p => p.published && p.isHomePage) ||
      pages.find(p => p.published);

    return NextResponse.json({
      ...website,
      pages,
      firstPublishedPage: firstPublishedPage
        ? {
            id: firstPublishedPage.id,
            path: firstPublishedPage.path,
            isHomePage: firstPublishedPage.isHomePage,
          }
        : null,
    });
  } catch (error) {
    console.error("Error fetching website:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// Update a website
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { name, description, published } = await request.json();

    // Find the website and verify ownership
    const website = await prisma.website.findUnique({
      where: { id },
    });

    if (!website) {
      return NextResponse.json(
        { message: "Website not found" },
        { status: 404 },
      );
    }

    // Verify the user owns this website
    if (website.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // If name is being updated, check for conflicts
    if (name && name !== website.name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const existingWebsite = await prisma.website.findFirst({
        where: {
          AND: [
            { id: { not: id } }, // Exclude current website
            {
              OR: [{ name }, { slug }],
            },
          ],
        },
      });

      if (existingWebsite) {
        if (existingWebsite.name === name) {
          return NextResponse.json(
            { message: "A website with this name already exists" },
            { status: 409 },
          );
        } else {
          return NextResponse.json(
            { message: "A website with this URL already exists" },
            { status: 409 },
          );
        }
      }
    }

    // Update the website
    const updateData = {
      description:
        description !== undefined ? description : website.description,
      published: published !== undefined ? published : website.published,
    };

    if (name && name !== website.name) {
      updateData.name = name;
      updateData.slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    const updatedWebsite = await prisma.website.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedWebsite);
  } catch (error) {
    console.error("Error updating website:", error);

    // Handle unique constraint violations
    if (error.code === "P2002") {
      if (error.meta?.target?.includes("name")) {
        return NextResponse.json(
          { message: "A website with this name already exists" },
          { status: 409 },
        );
      } else if (error.meta?.target?.includes("slug")) {
        return NextResponse.json(
          { message: "A website with this URL already exists" },
          { status: 409 },
        );
      }
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// Delete a website
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Find the website and verify ownership
    const website = await prisma.website.findUnique({
      where: { id },
    });

    if (!website) {
      return NextResponse.json(
        { message: "Website not found" },
        { status: 404 },
      );
    }

    // Verify the user owns this website
    if (website.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Delete all components associated with this website's pages
    await prisma.component.deleteMany({
      where: {
        page: {
          websiteId: id,
        },
      },
    });

    // Delete all pages associated with this website
    await prisma.page.deleteMany({
      where: { websiteId: id },
    });

    // Delete the website
    await prisma.website.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Website deleted successfully" });
  } catch (error) {
    console.error("Error deleting website:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
