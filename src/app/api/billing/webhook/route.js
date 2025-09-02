import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;
      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}

async function handleCheckoutCompleted(session) {
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: session.customer },
  });

  if (!user) {
    console.error(
      "CRITICAL: User not found for Stripe customer:",
      session.customer,
    );
    throw new Error(`User not found for customer ${session.customer}`);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { plan: "PRO" },
  });

  console.log(`✅ User ${user.id} upgraded to Pro`);
}
