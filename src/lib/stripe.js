import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27",
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
      publishLimit: Infinity,
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

  return {
    publishLimit: planConfig.publishLimit,
    publishedCount: user.publishedWebsiteCount || 0,
    canPublish: (user.publishedWebsiteCount || 0) < planConfig.publishLimit,
    remainingPublishes:
      planConfig.publishLimit === Infinity
        ? Infinity
        : Math.max(
            0,
            planConfig.publishLimit - (user.publishedWebsiteCount || 0),
          ),
  };
}

/**
 * Format currency for display
 */
export function formatPrice(priceInCents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceInCents / 100);
}
