/**
 * Format currency for display
 */
export function formatPrice(priceInCents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceInCents / 100);
}

/**
 * Client-safe Stripe configuration (no server-side env vars)
 */
export const CLIENT_STRIPE_CONFIG = {
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
      publishLimit: -1,
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
