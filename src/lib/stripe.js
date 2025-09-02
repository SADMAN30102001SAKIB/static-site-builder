import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
  typescript: false,
});

export const STRIPE_CONFIG = {
  PLANS: {
    FREE: {
      name: "Free",
      price: 0,
      publishLimit: 2,
      features: [
        "Unlimited website creation",
        "Up to 2 published websites",
        "All design tools",
        "Community support",
      ],
    },
    PRO: {
      name: "Pro",
      price: 999,
      priceId: process.env.STRIPE_PRO_PRICE_ID,
      publishLimit: -1, // Use -1 to represent unlimited
      features: [
        "Unlimited website creation",
        "Unlimited published websites",
        "All design tools",
        "Priority support",
        "Custom domains",
        "Advanced analytics",
      ],
    },
  },
};

/**
 * Get user's current plan limits and usage
 */
export function getPlanLimits(user) {
  const plan = user.plan || "FREE";
  const planConfig = STRIPE_CONFIG.PLANS[plan];
  const isUnlimited = planConfig.publishLimit === -1;

  return {
    publishLimit: isUnlimited ? -1 : planConfig.publishLimit,
    publishedCount: user.publishedWebsiteCount || 0,
    canPublish:
      isUnlimited ||
      (user.publishedWebsiteCount || 0) < planConfig.publishLimit,
    remainingPublishes: isUnlimited
      ? -1
      : Math.max(
          0,
          planConfig.publishLimit - (user.publishedWebsiteCount || 0),
        ),
  };
}
