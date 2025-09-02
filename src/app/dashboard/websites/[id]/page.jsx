"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatCard from "@/components/dashboard/StatCard";
import Input from "@/components/ui/Input";
import { useToast } from "@/hooks/use-toast";
import { openLiveSiteOptimized } from "@/lib/siteUrls";
import UpgradePrompt from "@/components/billing/UpgradePrompt";

export default function WebsiteDetails({ params }) {
  const router = useRouter();
  const paramValues = use(params);
  const { id } = paramValues;
  const { toast } = useToast();
  const [website, setWebsite] = useState(null);
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [upgradeLimitInfo, setUpgradeLimitInfo] = useState(null);

  useEffect(() => {
    async function fetchWebsiteData() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(`/api/websites/${id}`);

        if (response.status === 401) {
          // Unauthorized - redirect to login
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch website data");
        }

        const data = await response.json();
        // The API returns the website data directly (not nested in a .website property)
        setWebsite(data);
        setEditedName(data.name);
        setEditedDescription(data.description || "");

        // Pages are included in the website response
        setPages(data.pages || []);
      } catch (err) {
        console.error("Error fetching website data:", err);
        setError("Failed to load website data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchWebsiteData();
  }, [id]);

  const handlePublishToggle = async () => {
    if (!website) return;

    try {
      setIsPublishing(true);

      const response = await fetch(`/api/websites/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          published: !website.published,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if it's a publishing limit error
        if (
          response.status === 402 &&
          data.error === "PUBLISHING_LIMIT_REACHED"
        ) {
          setUpgradeLimitInfo({
            currentUsage: data.currentUsage,
            limit: data.limit,
            plan: data.plan,
          });
          setShowUpgradePrompt(true);
          return;
        }

        throw new Error(
          data.message ||
            (website.published
              ? "Failed to unpublish website"
              : "Failed to publish website"),
        );
      }

      setWebsite(prev => ({ ...prev, published: !prev.published }));

      toast({
        title: website.published ? "Website unpublished" : "Website published",
        description: website.published
          ? "Your website is no longer visible to the public"
          : "Your website is now live and accessible to everyone",
        type: "success",
      });
    } catch (err) {
      console.error("Error publishing website:", err);
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        type: "error",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleStartEditing = () => {
    setIsEditing(true);
    setSaveError("");
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditedName(website.name);
    setEditedDescription(website.description || "");
  };

  const handleSaveChanges = async () => {
    if (!editedName.trim()) {
      setSaveError("Website name is required");
      return;
    }

    try {
      setIsSaving(true);
      setSaveError("");

      const response = await fetch(`/api/websites/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedName,
          description: editedDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || "Failed to update website";

        // Handle user errors (4xx) vs server errors (5xx) differently
        if (response.status >= 400 && response.status < 500) {
          // User errors like conflicts - don't log to console
          setSaveError(errorMessage);
          toast({
            title: "Update Failed",
            description: errorMessage,
            variant: "destructive",
          });
          return;
        } else {
          // Server errors - log to console
          throw new Error(errorMessage);
        }
      }

      setWebsite(prev => ({
        ...prev,
        name: editedName,
        description: editedDescription,
      }));

      setIsEditing(false);
      toast({
        title: "Website Updated",
        description: "Your website details have been saved successfully.",
        variant: "success",
      });
    } catch (err) {
      // Only server errors reach here now
      console.error("Error updating website:", err);
      setSaveError("An unexpected error occurred. Please try again.");
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteWebsite = async () => {
    try {
      const response = await fetch(`/api/websites/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete website");
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Error deleting website:", err);
      setError(err.message);
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="max-w-6xl">
        <div className="flex flex-col items-center justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[rgb(var(--primary))]"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading website data...
          </p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="max-w-6xl">
        <Card>
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg">
            {error}
            <div className="mt-4">
              <Button href="/dashboard" variant="outline">
                Go back to Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </Container>
    );
  }

  if (!website) {
    return (
      <Container maxWidth="max-w-6xl">
        <Card>
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Website not found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The website you're looking for doesn't exist or has been deleted.
            </p>
            <Button href="/dashboard" variant="primary">
              Go back to Dashboard
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  const formattedDate = dateString => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container maxWidth="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            href="/dashboard/websites"
            variant="ghost"
            size="sm"
            className="mr-2">
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Button>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Input
                value={editedName}
                onChange={e => setEditedName(e.target.value)}
                className="text-2xl font-bold"
                placeholder="Website name"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {website.name}
              </h1>
            )}
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="p-1 h-8 w-8">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </Button>
            )}
          </div>
          {website.published && (
            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Published
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="primary"
                onClick={handleSaveChanges}
                disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancelEditing}
                disabled={isSaving}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  // Find the homepage first, then any page, or create a new one
                  const homePage = pages.find(p => p.isHomePage);
                  const firstPage = homePage || pages.find(p => p.id);
                  if (firstPage) {
                    router.push(`/builder/${id}/pages/${firstPage.id}`);
                  } else {
                    // Handle case where no pages exist
                    router.push(`/dashboard/websites/${id}/pages/new`);
                  }
                }}>
                <svg
                  className="w-5 h-5 mr-1"
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
                Edit Website
              </Button>
              <Button
                variant="ghost"
                onClick={() => window.open(`/preview/${id}`, "_blank")}>
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Preview
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  openLiveSiteOptimized(website, website.firstPublishedPage)
                }
                disabled={!website.published}>
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                View Site
              </Button>
              <Button
                variant={website.published ? "danger-ghost" : "primary"}
                onClick={handlePublishToggle}
                isLoading={isPublishing}>
                {website.published ? (
                  <>
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                    Unpublish
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Publish
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  label="Website Name"
                  value={editedName}
                  onChange={e => setEditedName(e.target.value)}
                  error={!editedName.trim() ? "Website name is required" : ""}
                  required
                />

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={editedDescription}
                    onChange={e => setEditedDescription(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
                    placeholder="Describe your website (optional)"></textarea>
                </div>

                {saveError && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded">
                    {saveError}
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="ghost" onClick={handleCancelEditing}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSaveChanges}
                    isLoading={isSaving}>
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-400">
                    {website.description || "No description provided."}
                  </p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Created
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {formattedDate(website.createdAt)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Last updated
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {formattedDate(website.updatedAt)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            website.published
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}>
                          {website.published ? "Published" : "Draft"}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Pages
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {pages.length}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleStartEditing}>
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Details
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <Card
            title="Website Pages"
            className="mt-6"
            headerAction={
              <div className="flex space-x-2">
                <Button
                  href={`/dashboard/websites/${id}/pages`}
                  variant="outline"
                  size="sm">
                  View All Pages
                </Button>
                <Button
                  href={`/dashboard/websites/${id}/pages/new`}
                  variant="ghost"
                  size="sm">
                  Add Page
                </Button>
              </div>
            }>
            {pages.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  This website doesn't have any pages yet.
                </p>
                <Button
                  href={`/dashboard/websites/${id}/pages/new`}
                  variant="outline">
                  Add First Page
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Page
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {pages.map(page => (
                      <tr
                        key={page.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {page.title}
                          </div>
                          {page.isHomePage && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Home Page
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formattedDate(page.updatedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              page.published
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }`}>
                            {page.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            href={`/builder/${id}/pages/${page.id}`}
                            variant="ghost"
                            size="sm">
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <StatCard
              title="Total Pages"
              value={pages.length}
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
            />
            <StatCard
              title="Published Pages"
              value={pages.filter(p => p.published).length}
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
          </div>

          <Card title="Quick Actions">
            <div className="space-y-3">
              <Button
                href={`/dashboard/websites/${id}/pages/new`}
                variant="outline"
                fullWidth
                className="justify-start">
                <svg
                  className="w-5 h-5 mr-2"
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
                Add New Page
              </Button>

              <Button
                href={`/dashboard/websites/${id}/pages`}
                variant="outline"
                fullWidth
                className="justify-start">
                <svg
                  className="w-5 h-5 mr-2"
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
                Manage Pages
              </Button>

              <Button
                onClick={() => window.open(`/preview/${id}`, "_blank")}
                variant="outline"
                fullWidth
                className="justify-start">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Preview Website
              </Button>
            </div>
          </Card>

          <Card title="Danger Zone">
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                  Delete Website
                </h3>
                <p className="mt-1 text-xs text-red-700 dark:text-red-500">
                  Once deleted, all website data and pages will be permanently
                  removed.
                </p>
                <div className="mt-3">
                  <Button
                    variant="danger-ghost"
                    size="sm"
                    onClick={() => setShowDeleteModal(true)}>
                    Delete this website
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete Website
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {website.name}
              </span>
              ? This action cannot be undone and all website data will be
              permanently deleted.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteWebsite}>
                Delete Website
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Prompt Modal */}
      <UpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        currentUsage={upgradeLimitInfo?.currentUsage}
        limit={upgradeLimitInfo?.limit}
      />
    </Container>
  );
}
