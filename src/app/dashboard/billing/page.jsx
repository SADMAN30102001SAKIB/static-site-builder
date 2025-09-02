"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/stripe";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

export default function BillingPage() {
  const [billingInfo, setBillingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchBillingInfo();

    // Check for success/cancel messages in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("success")) {
      setMessage({
        type: "success",
        text: "Thank you! Your Pro access has been activated.",
      });
    }
    if (urlParams.get("canceled")) {
      setMessage({
        type: "info",
        text: "Checkout canceled. You can upgrade anytime.",
      });
    }
  }, []);

  const fetchBillingInfo = async () => {
    try {
      const response = await fetch("/api/billing/info");
      const data = await response.json();

      if (response.ok) {
        setBillingInfo(data);
      } else {
        throw new Error(data.error || "Failed to fetch billing info");
      }
    } catch (error) {
      console.error("Error fetching billing info:", error);
      setMessage({ type: "error", text: "Failed to load billing information" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      setUpgrading(true);

      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "PRO" }),
      });

      const { sessionId } = await response.json();

      if (response.ok && sessionId) {
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          throw new Error(error.message);
        }
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error upgrading:", error);
      setMessage({ type: "error", text: error.message });
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading billing information...
            </p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Billing & Plan
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your plan and billing information
        </p>
      </div>

      {message.text && (
        <div
          className={`mb-6 rounded-md p-4 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : message.type === "error"
              ? "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              : "bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          }`}>
          <p>{message.text}</p>
        </div>
      )}

      {billingInfo && (
        <div className="space-y-6">
          {/* Current Plan */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Current Plan: {billingInfo.plans.current.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {billingInfo.user.plan === "PRO"
                    ? "Lifetime access"
                    : "Free forever plan"}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(billingInfo.plans.current.price)}
                  {billingInfo.plans.current.price > 0 && (
                    <span className="text-sm text-gray-500"> one-time</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Usage */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Publishing Usage
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Published Websites
                </span>
                <span className="font-medium">
                  {billingInfo.usage.publishedWebsites} /{" "}
                  {billingInfo.usage.publishLimit === Infinity
                    ? "∞"
                    : billingInfo.usage.publishLimit}
                </span>
              </div>

              {billingInfo.usage.publishLimit !== Infinity && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (billingInfo.usage.publishedWebsites /
                          billingInfo.usage.publishLimit) *
                          100,
                      )}%`,
                    }}></div>
                </div>
              )}

              {!billingInfo.usage.canPublish && (
                <div className="bg-orange-50 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 p-3 rounded-md">
                  <p className="font-medium">Publishing limit reached!</p>
                  <p className="text-sm mt-1">
                    Upgrade to Pro to publish unlimited websites.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Plan Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(billingInfo.plans.available).map(
              ([planKey, plan]) => (
                <Card
                  key={planKey}
                  className={`relative ${
                    billingInfo.user.plan === planKey
                      ? "ring-2 ring-blue-500 dark:ring-blue-400"
                      : ""
                  }`}>
                  {billingInfo.user.plan === planKey && (
                    <div className="absolute -top-3 left-4">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Current Plan
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(plan.price)}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-500 dark:text-gray-400">
                          {" "}
                          one-time
                        </span>
                      )}
                    </div>

                    {planKey === "PRO" && billingInfo.user.plan === "FREE" && (
                      <div className="mt-2">
                        <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full text-sm">
                          Lifetime access
                        </span>
                      </div>
                    )}
                  </div>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-3"
                          fill="currentColor"
                          viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-400">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    {planKey === "PRO" && billingInfo.user.plan === "FREE" ? (
                      <Button
                        onClick={handleUpgrade}
                        disabled={upgrading}
                        isLoading={upgrading}
                        className="w-full"
                        variant="primary">
                        Upgrade to Pro
                      </Button>
                    ) : planKey === "PRO" && billingInfo.user.plan === "PRO" ? (
                      <div className="w-full text-center">
                        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-lg">
                          <p className="font-medium">✓ Pro Member</p>
                          <p className="text-sm">Lifetime access activated</p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </Card>
              ),
            )}
          </div>
        </div>
      )}
    </Container>
  );
}
