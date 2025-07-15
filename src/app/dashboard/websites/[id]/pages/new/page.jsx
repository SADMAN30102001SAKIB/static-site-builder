"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewPage({ params }) {
  const router = useRouter();
  const paramValues = use(params);
  const { id } = paramValues; // Website ID

  const [formData, setFormData] = useState({
    title: "",
    path: "",
    description: "",
    isHomePage: false,
  });

  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validatePath = path => {
    // Path should start with a slash and contain only alphanumeric characters, hyphens, and slashes
    if (!path.startsWith("/")) {
      return false;
    }

    // Check for invalid characters
    const invalidCharsRegex = /[^a-zA-Z0-9\-\/]/g;
    if (invalidCharsRegex.test(path)) {
      return false;
    }

    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim()) {
      setError("Page title is required");
      return;
    }

    if (!formData.path.trim()) {
      setError("Page path is required");
      return;
    }

    if (!validatePath(formData.path)) {
      setError(
        'Path must start with a "/" and contain only letters, numbers, hyphens, and slashes',
      );
      return;
    }

    try {
      setIsCreating(true);
      setError("");

      const response = await fetch("/api/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          websiteId: id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create page");
      }

      // Redirect to the pages listing
      router.push(`/dashboard/websites/${id}/pages`);
    } catch (err) {
      console.error("Error creating page:", err);
      setError(err.message || "An error occurred while creating the page");
    } finally {
      setIsCreating(false);
    }
  };

  const generatePathFromTitle = () => {
    // Only generate if path is empty and title has content
    if (!formData.path && formData.title) {
      const path =
        "/" +
        formData.title
          .toLowerCase()
          .replace(/\s+/g, "-") // Replace spaces with hyphens
          .replace(/[^a-z0-9\-]/g, ""); // Remove invalid characters

      setFormData(prev => ({
        ...prev,
        path,
      }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Create New Page
        </h1>
        <Link
          href={`/dashboard/websites/${id}/pages`}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          Cancel
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md mb-6">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Page Title*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={generatePathFromTitle}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
              placeholder="Home Page"
              required
            />
          </div>

          <div>
            <label
              htmlFor="path"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Page Path*
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="path"
                name="path"
                value={formData.path}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
                placeholder="/home"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              This will be the URL path for your page. Must start with a "/"
              (e.g., "/about").
            </p>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
              placeholder="A short description of what this page contains"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isHomePage"
              name="isHomePage"
              checked={formData.isHomePage}
              onChange={handleChange}
              className="h-4 w-4 text-[rgb(var(--primary))] focus:ring-[rgb(var(--primary))] border-gray-300 dark:border-gray-600 rounded"
            />
            <label
              htmlFor="isHomePage"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Set as Home Page
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isCreating}
              className="w-full bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-light))] text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
              {isCreating ? "Creating..." : "Create Page"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
