"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import WebsiteCard from "@/components/dashboard/WebsiteCard";

export default function WebsitesPage() {
  const router = useRouter();
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
        setWebsites(data.websites || []);
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
          router.push(`/builder/${id}/pages/${firstPage.id}`);
        } else {
          router.push(`/dashboard/websites/${id}/pages/new`);
        }
      }
    } catch (error) {
      console.error("Error fetching website:", error);
      router.push(`/dashboard/websites/${id}`);
    }
  };

  const handleManageWebsite = id => {
    router.push(`/dashboard/websites/${id}`);
  };

  const handlePagesWebsite = id => {
    router.push(`/dashboard/websites/${id}/pages`);
  };

  const handlePreviewWebsite = id => {
    // In a real app, this would open a preview URL
    window.open(`/preview/${id}`, "_blank");
  };

  return (
    <Container maxWidth="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Websites
        </h1>
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
          Create New
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[rgb(var(--primary))]"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading your websites...
          </p>
        </div>
      ) : error ? (
        <Card>
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg">
            {error}
          </div>
        </Card>
      ) : websites.length === 0 ? (
        <Card>
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
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No websites yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Get started by creating a new website with our drag and drop
              builder.
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
              Create New Website
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {websites.map(website => (
            <WebsiteCard
              key={website.id}
              website={website}
              onEdit={handleEditWebsite}
              onManage={handleManageWebsite}
              onPages={handlePagesWebsite}
              onPreview={handlePreviewWebsite}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
