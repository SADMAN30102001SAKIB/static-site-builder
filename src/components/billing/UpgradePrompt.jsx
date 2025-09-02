"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Button from "@/components/ui/Button";
import { formatPrice, STRIPE_CONFIG } from "@/lib/stripe";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

export default function UpgradePrompt({
  isOpen,
  onClose,
  currentUsage,
  limit,
}) {
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setUpgrading(true);

      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "PRO" }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 400 && data.error === "Already Pro") {
          alert("You're already a Pro user!");
          onClose();
          return;
        }
        if (
          response.status === 500 &&
          data.error === "Price ID not configured"
        ) {
          alert("Payment system is not configured. Please contact support.");
          return;
        }
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (!data.sessionId) {
        throw new Error("No session ID received from server");
      }

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Error upgrading:", error);
      alert(`Failed to start upgrade process: ${error.message}`);
    } finally {
      setUpgrading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-4">
            <svg
              className="h-6 w-6 text-orange-600 dark:text-orange-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Publishing Limit Reached
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You've published {currentUsage} out of {limit} allowed websites on
            the free plan. Upgrade to Pro to publish unlimited websites and
            unlock more features.
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Pro Plan Benefits
            </h4>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {formatPrice(STRIPE_CONFIG.PLANS.PRO.price)}{" "}
              <span className="text-sm text-gray-500">one-time</span>
            </div>
            <div className="text-sm text-green-600 dark:text-green-400 font-medium mb-3">
              🚀 Lifetime access included
            </div>

            <ul className="text-left space-y-2 text-sm">
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">
                  Unlimited published websites
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">
                  Custom domains
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">
                  Priority support
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7-293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">
                  Advanced analytics
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={upgrading}>
            Maybe Later
          </Button>
          <Button
            variant="primary"
            onClick={handleUpgrade}
            className="flex-1"
            isLoading={upgrading}
            disabled={upgrading}>
            Upgrade to Pro
          </Button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
          One-time payment. Lifetime access to Pro features.
        </p>
      </div>
    </div>
  );
}
