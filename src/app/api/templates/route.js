import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Get public templates
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const templates = await prisma.website.findMany({
      where: {
        isTemplate: true,
        published: true, // Only show published templates
        // Exclude current user's templates if user is logged in
        ...(session?.user?.id && {
          userId: {
            not: session.user.id,
          },
        }),
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        pages: {
          select: {
            id: true,
            title: true,
            isHomePage: true,
          },
        },
      },
      orderBy: [
        { forkCount: "desc" }, // Most forked first
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({
      templates: templates.map(template => ({
        ...template,
        user: {
          name: template.user.name,
          email: template.user.email,
        },
      })),
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
