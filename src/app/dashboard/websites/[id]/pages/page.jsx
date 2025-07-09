"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function WebsitePages({ params }) {
  const paramValues = use(params);
  const { id } = paramValues;
  const router = useRouter();
  const { toast } = useToast();
  const [website, setWebsite] = useState(null);
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for new page form
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [newPage, setNewPage] = useState({
    title: "",
    path: "",
    description: "",
    isHomePage: false,
  });

  // State for inline editing
  const [editingPageId, setEditingPageId] = useState(null);
  const [editingPageData, setEditingPageData] = useState({
    title: "",
    path: "",
    description: "",
  });

  // Fetch website and pages data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch website data with retry logic
        const websiteData = await fetchWithRetry(`/api/websites/${id}`);

        // Fetch pages data with retry logic
        const pagesData = await fetchWithRetry(`/api/pages?websiteId=${id}`);

        setWebsite(websiteData); // websiteData is the website object itself
        setPages(pagesData.pages);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load website data",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  // Helper function to fetch with retry logic
  const fetchWithRetry = async (url, options = {}, maxRetries = 3) => {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url, options);

        if (response.ok) {
          return await response.json();
        } else if (response.status === 401) {
          // If unauthorized, wait a bit and retry
          if (i < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
            continue;
          }
          throw new Error("Unauthorized");
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }

    throw lastError;
  };

  // Handle input change for new page form
  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setNewPage({
      ...newPage,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Automatically generate path from title
  const handleTitleChange = e => {
    const title = e.target.value;
    const generatedPath = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");

    // Don't add leading slash here since UI already shows it
    setNewPage({
      ...newPage,
      title,
      path: generatedPath,
    });
  };

  // Create new page
  const handleCreatePage = async e => {
    e.preventDefault();

    try {
      // Ensure path starts with / before sending to API
      const pathWithSlash = newPage.path.startsWith("/")
        ? newPage.path
        : `/${newPage.path}`;

      const data = await fetchWithRetry("/api/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newPage,
          path: pathWithSlash,
          websiteId: id,
        }),
      });

      // Add the new page to the list
      setPages([...pages, data.page]);

      // Reset form
      setNewPage({
        title: "",
        path: "",
        description: "",
        isHomePage: false,
      });

      setIsAddingPage(false);

      toast({
        title: "Success",
        description: "Page created successfully",
      });
    } catch (error) {
      console.error("Error creating page:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create page",
        variant: "destructive",
      });
    }
  };

  // Delete page
  const handleDeletePage = async pageId => {
    if (
      !confirm(
        "Are you sure you want to delete this page? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await fetchWithRetry(`/api/pages/${pageId}`, {
        method: "DELETE",
      });

      // Remove the deleted page from the list
      setPages(pages.filter(page => page.id !== pageId));

      toast({
        title: "Success",
        description: "Page deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting page:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete page",
        variant: "destructive",
      });
    }
  };

  // Set page as homepage
  const handleSetHomePage = async pageId => {
    try {
      await fetchWithRetry(`/api/pages/${pageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isHomePage: true,
        }),
      });

      // Update pages list
      setPages(
        pages.map(page => ({
          ...page,
          isHomePage: page.id === pageId,
        })),
      );

      toast({
        title: "Success",
        description: "Homepage set successfully",
      });
    } catch (error) {
      console.error("Error setting homepage:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to set homepage",
        variant: "destructive",
      });
    }
  };

  // Toggle page published status
  const handleTogglePublished = async pageId => {
    try {
      const page = pages.find(p => p.id === pageId);
      await fetchWithRetry(`/api/pages/${pageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          published: !page.published,
        }),
      });

      // Update pages list
      setPages(
        pages.map(p =>
          p.id === pageId ? { ...p, published: !p.published } : p,
        ),
      );

      toast({
        title: "Success",
        description: `Page ${
          !page.published ? "published" : "unpublished"
        } successfully`,
      });
    } catch (error) {
      console.error("Error toggling page published status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update page status",
        variant: "destructive",
      });
    }
  };

  // Start inline editing for a page
  const handleStartEditingPage = page => {
    setEditingPageId(page.id);
    setEditingPageData({
      title: page.title,
      path: page.path.startsWith("/") ? page.path.slice(1) : page.path,
      description: page.description || "",
    });
  };

  // Cancel inline editing
  const handleCancelEditingPage = () => {
    setEditingPageId(null);
    setEditingPageData({
      title: "",
      path: "",
      description: "",
    });
  };

  // Save inline editing changes
  const handleSaveEditingPage = async () => {
    try {
      const data = await fetchWithRetry(`/api/pages/${editingPageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editingPageData.title,
          path: editingPageData.path.startsWith("/")
            ? editingPageData.path
            : `/${editingPageData.path}`,
          description: editingPageData.description,
        }),
      });

      // Update pages list with the returned data from the API
      setPages(
        pages.map(p => (p.id === editingPageId ? { ...p, ...data.page } : p)),
      );

      setEditingPageId(null);
      setEditingPageData({
        title: "",
        path: "",
        description: "",
      });

      toast({
        title: "Success",
        description: "Page updated successfully",
      });
    } catch (error) {
      console.error("Error updating page:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update page",
        variant: "destructive",
      });
    }
  };

  // Handle editing input changes
  const handleEditingInputChange = (field, value) => {
    setEditingPageData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {website?.name} - Pages
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage pages for your website
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href={`/dashboard/websites/${id}`}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700">
            Back to Website
          </Link>
          <button
            onClick={() => setIsAddingPage(true)}
            className="px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary/90">
            Add New Page
          </button>
        </div>
      </div>

      {isAddingPage && (
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-md shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Create New Page
          </h2>
          <form onSubmit={handleCreatePage}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Page Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newPage.title}
                  onChange={handleTitleChange}
                  placeholder="Home, About Us, Contact, etc."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="path"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Page Path *
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-md">
                    /
                  </span>
                  <input
                    type="text"
                    id="path"
                    name="path"
                    value={newPage.path}
                    onChange={handleInputChange}
                    placeholder="home, about-us, contact, etc."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700"
                    required
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newPage.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Page description (optional)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isHomePage"
                  name="isHomePage"
                  checked={newPage.isHomePage}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label
                  htmlFor="isHomePage"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Set as homepage
                </label>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsAddingPage(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary/90">
                Create Page
              </button>
            </div>
          </form>
        </div>
      )}

      {pages.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-md shadow">
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
            No pages yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get started by creating your first page
          </p>
          <button
            onClick={() => setIsAddingPage(true)}
            className="px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary/90">
            Create First Page
          </button>
        </div>
      ) : website ? (
        <div className="bg-white dark:bg-gray-800 rounded-md shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Path
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {pages.map(page => (
                <tr key={page.id}>
                  <td className="px-6 py-4">
                    {editingPageId === page.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editingPageData.title}
                          onChange={e =>
                            handleEditingInputChange("title", e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                          placeholder="Page title"
                        />
                        <textarea
                          value={editingPageData.description}
                          onChange={e =>
                            handleEditingInputChange(
                              "description",
                              e.target.value,
                            )
                          }
                          rows="2"
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                          placeholder="Page description (optional)"
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {page.title}
                          {page.isHomePage && (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                              Homepage
                            </span>
                          )}
                        </div>
                        {page.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                            {page.description}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingPageId === page.id ? (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">
                          /
                        </span>
                        <input
                          type="text"
                          value={editingPageData.path}
                          onChange={e =>
                            handleEditingInputChange("path", e.target.value)
                          }
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                          placeholder="page-path"
                          disabled={page.isHomePage}
                        />
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {page.isHomePage ? "/" : page.path}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        page.published
                          ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}>
                      {page.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-4">
                      {editingPageId === page.id ? (
                        <>
                          <button
                            onClick={handleSaveEditingPage}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                            Save
                          </button>
                          <button
                            onClick={handleCancelEditingPage}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEditingPage(page)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                            Edit Info
                          </button>
                          <Link
                            href={`/builder/${website?.id}/pages/${page.id}`}
                            className="text-primary hover:text-primary/80">
                            Edit Content
                          </Link>
                          {!page.isHomePage && (
                            <>
                              <button
                                onClick={() => handleSetHomePage(page.id)}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                                Set as Homepage
                              </button>
                              <button
                                onClick={() => handleDeletePage(page.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                Delete
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleTogglePublished(page.id)}
                            className={`${
                              page.published
                                ? "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                : "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            }`}>
                            {page.published ? "Unpublish" : "Publish"}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-md shadow">
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
            Loading website data...
          </h3>
        </div>
      )}
    </div>
  );
}
