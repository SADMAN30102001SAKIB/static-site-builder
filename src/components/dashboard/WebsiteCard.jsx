"use client";

import React from "react";
import Button from "@/components/ui/Button";

/**
 * A card component for displaying website information in the dashboard
 *
 * @param {Object} website - The website data object
 * @param {string} website.id - Website ID
 * @param {string} website.name - Website name
 * @param {string} website.description - Website description
 * @param {boolean} website.published - Whether the website is published
 * @param {string} website.updatedAt - Last update timestamp
 * @param {string} website.thumbnail - Optional thumbnail URL
 * @param {function} onEdit - Optional edit handler
 * @param {function} onManage - Optional manage handler
 * @param {function} onDelete - Optional delete handler
 * @param {function} onPreview - Optional preview handler
 */
export default function WebsiteCard({
  website,
  onEdit,
  onManage,
  onPages,
  onDelete,
  onPreview,
  className = "",
}) {
  if (!website) return null;

  const handleEdit = () => {
    if (onEdit) onEdit(website.id);
  };

  const handleManage = () => {
    if (onManage) onManage(website.id);
  };

  const handlePages = () => {
    if (onPages) onPages(website.id);
  };

  const handleDelete = e => {
    e.stopPropagation();
    if (onDelete) onDelete(website.id);
  };

  const handlePreview = e => {
    e.stopPropagation();
    if (onPreview) onPreview(website.id);
  };

  // Format date for display
  const formatDate = dateString => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow ${className}`}>
      <div className="h-32 relative bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
        {website.thumbnail ? (
          <img
            src={website.thumbnail}
            alt={website.name}
            className="w-full h-full object-cover"
          />
        ) : (
          website.name.charAt(0).toUpperCase()
        )}

        {website.published && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
            Published
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white truncate">
          {website.name}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 h-10">
          {website.description || "No description provided"}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span>Last updated: {formatDate(website.updatedAt)}</span>
          <span
            className={`px-2 py-1 rounded-full ${
              website.published
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            }`}>
            {website.published ? "Published" : "Draft"}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 justify-between">
          {onEdit && (
            <Button
              onClick={handleEdit}
              variant="outline"
              size="sm"
              className="flex-1">
              Edit
            </Button>
          )}

          {onPages && (
            <Button
              onClick={handlePages}
              variant="ghost"
              size="sm"
              className="flex-1">
              Pages
            </Button>
          )}

          {onManage && (
            <Button
              onClick={handleManage}
              variant="ghost"
              size="sm"
              className="flex-1">
              Manage
            </Button>
          )}
        </div>

        <div className="flex gap-2 mt-2">
          {onPreview && (
            <Button
              onClick={handlePreview}
              variant="ghost"
              size="sm"
              className="flex-1">
              <svg
                className="w-4 h-4 mr-1"
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
          )}

          {onDelete && (
            <Button
              onClick={handleDelete}
              variant="danger-ghost"
              size="sm"
              className="flex-1">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
