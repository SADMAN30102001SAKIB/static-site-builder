"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import WebsiteCard from "@/components/dashboard/WebsiteCard";
import StatCard from "@/components/dashboard/StatCard";

export default function Dashboard() {
  const { data: session } = useSession();
  const [websites, setWebsites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchWebsites() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("/api/websites");

        if (!response.ok) {
          throw new Error("Failed to fetch websites");
        }

        const data = await response.json();
        const websiteData = data.websites || [];
        setWebsites(websiteData);
      } catch (err) {
        console.error("Error fetching websites:", err);
        setError("Failed to load your websites. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchWebsites();
  }, []);

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

  // Calculate real statistics
  const totalPages = websites.reduce(
    (sum, website) => sum + (website.pages?.length || 0),
    0,
  );
  const publishedWebsites = websites.filter(w => w.published).length;

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
          value={publishedWebsites.toString()}
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
        />
        <StatCard
          title="Draft"
          value={(websites.length - publishedWebsites).toString()}
          icon={
            <svg
              className="h-5 w-5 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          }
        />
        <StatCard
          title="Total Pages"
          value={totalPages.toString()}
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
        />
      </div>

      {/* Websites Section */}
      <Card
        title="Your Websites"
        headerAction={
          websites.length > 0 ? (
            <Button href="/dashboard/websites" variant="ghost" size="sm">
              View All
            </Button>
          ) : null
        }>
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
              {websites.map(website => (
                <WebsiteCard
                  key={website.id}
                  website={website}
                  onEdit={() => handleEditWebsite(website.id)}
                  onManage={() => handleManageWebsite(website.id)}
                  onPages={() => handlePagesWebsite(website.id)}
                  onPreview={() => handlePreviewWebsite(website.id)}
                />
              ))}
            </div>

            {websites.length > 6 && (
              <div className="flex justify-center mt-6">
                <Button href="/dashboard/websites" variant="ghost">
                  View All Websites
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      {websites.length > 0 && (
        <Card title="Quick Actions" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              href="/dashboard/websites/new"
              variant="outline"
              className="flex items-center justify-center p-4 h-auto">
              <div className="text-center">
                <svg
                  className="w-8 h-8 mx-auto mb-2 text-blue-500"
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
                <span className="font-medium">Create New Website</span>
                <p className="text-sm text-gray-500 mt-1">
                  Start a new project
                </p>
              </div>
            </Button>

            <Button
              href="/dashboard/websites"
              variant="outline"
              className="flex items-center justify-center p-4 h-auto">
              <div className="text-center">
                <svg
                  className="w-8 h-8 mx-auto mb-2 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                  />
                </svg>
                <span className="font-medium">Manage Websites</span>
                <p className="text-sm text-gray-500 mt-1">
                  View and edit existing sites
                </p>
              </div>
            </Button>

            <Button
              href="/dashboard/profile"
              variant="outline"
              className="flex items-center justify-center p-4 h-auto">
              <div className="text-center">
                <svg
                  className="w-8 h-8 mx-auto mb-2 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-medium">Profile Settings</span>
                <p className="text-sm text-gray-500 mt-1">
                  Update your account
                </p>
              </div>
            </Button>
          </div>
        </Card>
      )}
    </Container>
  );
}
