"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewWebsite() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (isLoading) return;

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/websites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create website");
      }

      // Redirect to the builder page with the new website ID
      // After creating website, redirect to create a page first
      router.push(`/dashboard/websites/${data.website.id}/pages/new`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Create New Website
        </h1>
        <Link
          href="/dashboard"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
          Cancel
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Website Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
              placeholder="My Awesome Website"
              required
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              This will be used to identify your website and create its URL.
            </p>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
              placeholder="Describe your website (optional)"></textarea>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              A brief description of your website. This helps you remember its
              purpose.
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-light))] text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? "Creating..." : "Create Website"}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h2 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
          What happens next?
        </h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 dark:text-blue-400">
          <li>Your website will be created with a default home page</li>
          <li>
            You'll be redirected to the builder where you can start designing
          </li>
          <li>Your website won't be published until you're ready</li>
        </ul>
      </div>
    </div>
  );
}
