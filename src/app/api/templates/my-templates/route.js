import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Get user's own shared templates
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const templates = await prisma.website.findMany({
      where: {
        userId: session.user.id,
        isTemplate: true,
        published: true, // Only show published templates
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      templates,
    });
  } catch (error) {
    console.error("Error fetching user templates:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
