"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import WebsiteCard from "@/components/dashboard/WebsiteCard";
import StatCard from "@/components/dashboard/StatCard";
import PlanBadge from "@/components/billing/PlanBadge";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [websites, setWebsites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [billingInfo, setBillingInfo] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError("");

        // Fetch websites and billing info in parallel
        const [websitesResponse, billingResponse] = await Promise.all([
          fetch("/api/websites"),
          fetch("/api/billing/info"),
        ]);

        if (!websitesResponse.ok) {
          throw new Error("Failed to fetch websites");
        }

        const websiteData = await websitesResponse.json();
        setWebsites(websiteData.websites || []);

        // Billing info is optional, don't fail if it errors
        if (billingResponse.ok) {
          const billingData = await billingResponse.json();
          setBillingInfo(billingData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load your websites. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    // Only fetch data if the user is authenticated
    if (session) {
      fetchData();
    } else if (status !== "loading") {
      setIsLoading(false);
    }
  }, [session, status]);

  const handleEditWebsite = async id => {
    // Find the first page for this website
    try {
      const response = await fetch(`/api/websites/${id}`);
      if (response.ok) {
        const data = await response.json();
        const firstPage =
          data.pages && data.pages.length > 0 ? data.pages[0] : null;
        if (firstPage) {
          window.location.href = `/builder/${id}/pages/${firstPage.id}`;
        } else {
          window.location.href = `/dashboard/websites/${id}/pages/new`;
        }
      }
    } catch (error) {
      console.error("Error fetching website:", error);
      window.location.href = `/dashboard/websites/${id}`;
    }
  };

  const handleManageWebsite = id => {
    window.location.href = `/dashboard/websites/${id}`;
  };

  const handlePagesWebsite = id => {
    window.location.href = `/dashboard/websites/${id}/pages`;
  };

  const handlePreviewWebsite = id => {
    window.open(`/preview/${id}`, "_blank");
  };

  const handleViewLiveWebsite = id => {
    window.open(`/site/${websites.find(w => w.id === id)?.slug}`, "_blank");
  };

  const handleDuplicateWebsite = async id => {
    try {
      const response = await fetch("/api/websites/duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteId: id }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to duplicate website");
      }

      const data = await response.json();

      // Refresh the websites list to show the new duplicate
      setWebsites(prev => [...prev, data.website]);

      // Optional: Show success message (you could add toast here)
      console.log("Website duplicated successfully:", data.website.name);
    } catch (error) {
      console.error("Error duplicating website:", error);
      // Optional: Show error message (you could add toast here)
      alert("Failed to duplicate website. Please try again.");
    }
  };

  // Calculate real statistics
  const totalPages = websites.reduce(
    (sum, website) => sum + (website.pages?.length || 0),
    0,
  );
  const publishedWebsites = websites.filter(w => w.published).length;
  const templateCount = websites.filter(w => w.isTemplate).length;

  return (
    <Container maxWidth="max-w-6xl">
      <header className="mb-8 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {session?.user?.name || "User"}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Here's what's happening with your websites
          </p>
        </div>

        <Button href="/dashboard/websites/new" variant="primary">
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Website
        </Button>
      </header>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Websites"
          value={websites.length.toString()}
          icon={
            <svg
              className="h-5 w-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          }
        />
        <StatCard
          title="Published"
          value={`${publishedWebsites}${
            billingInfo?.usage?.publishLimit !== Infinity
              ? ` / ${billingInfo.usage.publishLimit}`
              : ""
          }`}
          icon={
            <svg
              className="h-5 w-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          subtitle={
            billingInfo?.usage?.publishLimit !== Infinity &&
            !billingInfo?.usage?.canPublish ? (
              <span className="text-orange-600 dark:text-orange-400 text-xs font-medium">
                Limit reached
              </span>
            ) : billingInfo?.usage?.remainingPublishes !== undefined &&
              billingInfo?.usage?.remainingPublishes !== Infinity ? (
              <span className="text-gray-500 text-xs">
                {billingInfo.usage.remainingPublishes} remaining
              </span>
            ) : null
          }
        />
        <StatCard
          title="Plan"
          value={
            <div className="flex items-center gap-2">
              <PlanBadge plan={billingInfo?.user?.plan || "FREE"} />
              {billingInfo?.user?.plan === "PRO" && (
                <svg
                  className="h-4 w-4 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          }
          icon={
            <svg
              className="h-5 w-5 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          }
          subtitle={
            billingInfo?.user?.plan === "FREE" ? (
              <Button
                href="/dashboard/billing"
                size="sm"
                variant="outline"
                className="text-xs mt-1">
                Upgrade to Pro
              </Button>
            ) : (
              <span className="text-gray-500 text-xs">Lifetime access</span>
            )
          }
        />
        <StatCard
          title="Templates"
          value={templateCount.toString()}
          icon={
            <svg
              className="h-5 w-5 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          }
        />
      </div>

      {/* Websites Section */}
      <Card title="Your Websites">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading your websites...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg">
            {error}
          </div>
        ) : websites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
              <svg
                className="h-8 w-8 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No websites yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Get started by creating your first website with our drag-and-drop
              builder
            </p>
            <Button href="/dashboard/websites/new" variant="primary">
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Your First Website
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {websites.slice(0, 3).map(website => (
                <WebsiteCard
                  key={website.id}
                  website={website}
                  onEdit={() => handleEditWebsite(website.id)}
                  onManage={() => handleManageWebsite(website.id)}
                  onPages={() => handlePagesWebsite(website.id)}
                  onPreview={() => handlePreviewWebsite(website.id)}
                  onViewLive={() => handleViewLiveWebsite(website.id)}
                  onDuplicate={() => handleDuplicateWebsite(website.id)}
                />
              ))}
            </div>

            {websites.length > 3 && (
              <div className="flex justify-center mt-6">
                <Button href="/dashboard/websites" variant="ghost">
                  View All Websites
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </Container>
  );
}
