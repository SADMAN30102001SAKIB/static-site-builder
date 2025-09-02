import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPlanLimits, STRIPE_CONFIG } from "@/lib/stripe";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        publishedWebsiteCount: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const planLimits = getPlanLimits(user);

    const billingInfo = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan || "FREE",
        hasProAccess: user.plan === "PRO",
      },
      usage: {
        publishedWebsites: user.publishedWebsiteCount,
        publishLimit: planLimits.publishLimit,
        canPublish: planLimits.canPublish,
        remainingPublishes: planLimits.remainingPublishes,
      },
      plans: {
        current: STRIPE_CONFIG.PLANS[user.plan || "FREE"],
        available: STRIPE_CONFIG.PLANS,
      },
    };

    return NextResponse.json(billingInfo);
  } catch (error) {
    console.error("Error fetching billing info:", error);
    return NextResponse.json(
      { error: "Failed to fetch billing information" },
      { status: 500 },
    );
  }
}
