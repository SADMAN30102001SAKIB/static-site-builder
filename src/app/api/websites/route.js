import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const websites = await prisma.website.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        pages: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ websites });
  } catch (error) {
    console.error("Error fetching websites:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log("Session user:", session.user);

    const { name, description } = await request.json();

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { message: "Website name is required" },
        { status: 400 },
      );
    }

    // Create a URL-friendly slug from the name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check if name or slug already exists
    const existingWebsite = await prisma.website.findFirst({
      where: {
        OR: [{ name }, { slug }],
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

    // Verify the user exists in the database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      console.log("User not found in database:", session.user.id);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log("Creating website for user:", user.id);

    // Create the website
    const website = await prisma.website.create({
      data: {
        name,
        slug,
        description,
        userId: session.user.id,
      },
    });

    // Create a default home page
    const homePage = await prisma.page.create({
      data: {
        title: name,
        path: "/",
        description: description || `Welcome to ${name}`,
        isHomePage: true,
        websiteId: website.id,
      },
    });

    return NextResponse.json(
      {
        message: "Website created successfully",
        website,
        homePage,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating website:", error);

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
