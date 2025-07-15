"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BuilderSidebar from "@/components/builder/BuilderSidebar";
import BuilderCanvas from "@/components/builder/BuilderCanvas";
import BuilderProperties from "@/components/builder/BuilderProperties";
import ComponentLibrary from "@/components/builder/ComponentLibrary";
import { use } from "react";

export default function PageBuilderEditor({ params }) {
  const router = useRouter();
  const paramValues = use(params);
  const { id, pageId } = paramValues; // Website ID and Page ID
  const [website, setWebsite] = useState(null);
  const [page, setPage] = useState(null);
  const [components, setComponents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [savedStatus, setSavedStatus] = useState("saved"); // 'saved', 'saving', 'error'  // Fetch page data
  useEffect(() => {
    async function fetchPageData() {
      try {
        setIsLoading(true);
        setError("");

        // Fetch the page with its components
        const response = await fetch(`/api/pages/${pageId}`);

        if (response.status === 401) {
          // Unauthorized - redirect to login
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch page data");
        }

        const data = await response.json();
        setPage(data.page);
        setWebsite(data.page.website);
        setComponents(data.page.components || []);
      } catch (err) {
        console.error("Error fetching page data:", err);
        setError("Failed to load page data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPageData();
  }, [pageId]);

  // Handle selecting a component
  const handleSelectComponent = componentId => {
    setSelectedComponentId(componentId);
  };

  // Add a new component to the page
  const handleAddComponent = async (
    componentType,
    position,
    parentId = null,
  ) => {
    if (!page) return;

    try {
      setSavedStatus("saving");

      const newComponent = {
        type: componentType,
        pageId: page.id,
        position,
        parentId,
        properties: getDefaultPropertiesForType(componentType),
      };

      const response = await fetch(`/api/components`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComponent),
      });

      if (!response.ok) {
        throw new Error("Failed to add component");
      }

      const data = await response.json();

      // Update local state with the new component
      setComponents(prev => [...prev, data.component]);

      // Select the newly added component
      setSelectedComponentId(data.component.id);

      setSavedStatus("saved");
    } catch (error) {
      console.error("Error adding component:", error);
      setSavedStatus("error");
    }
  };

  // Update a component's properties
  const handleUpdateComponent = async (componentId, updates) => {
    try {
      setSavedStatus("saving");

      const response = await fetch(`/api/components/${componentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update component");
      }

      const data = await response.json();

      // Update local state with the updated component
      setComponents(prev =>
        prev.map(component =>
          component.id === componentId ? data.component : component,
        ),
      );

      setSavedStatus("saved");
    } catch (error) {
      console.error("Error updating component:", error);
      setSavedStatus("error");
    }
  };

  // Delete a component
  const handleDeleteComponent = async componentId => {
    try {
      setSavedStatus("saving");

      const response = await fetch(`/api/components/${componentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete component");
      }

      // Update local state by removing the deleted component
      setComponents(prev =>
        prev.filter(component => component.id !== componentId),
      );

      // If the selected component was deleted, deselect it
      if (selectedComponentId === componentId) {
        setSelectedComponentId(null);
      }

      setSavedStatus("saved");
    } catch (error) {
      console.error("Error deleting component:", error);
      setSavedStatus("error");
    }
  };

  // Move a component (change position or parent)
  const handleMoveComponent = async (
    componentId,
    newPosition,
    newParentId = null,
  ) => {
    try {
      setSavedStatus("saving");

      const updates = {
        position: newPosition,
        parentId: newParentId,
      };

      const response = await fetch(`/api/components/${componentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to move component");
      }

      const data = await response.json();

      // Update local state with the moved component
      setComponents(prev => {
        const updated = prev.map(component => {
          if (component.id === componentId) {
            return {
              ...component,
              position: newPosition,
              parentId: newParentId,
            };
          }
          return component;
        });

        // Sort by position
        return updated.sort((a, b) => a.position - b.position);
      });

      setSavedStatus("saved");
    } catch (error) {
      console.error("Error moving component:", error);
      setSavedStatus("error");
    }
  };

  // Get default properties based on component type
  const getDefaultPropertiesForType = type => {
    switch (type) {
      case "heading":
        return {
          text: "New Heading",
          level: "h2",
          textAlign: "left",
          color: "#000000",
        };
      case "paragraph":
        return {
          text: "New paragraph text. Click to edit.",
          textAlign: "left",
          color: "#000000",
        };
      case "image":
        return {
          src: "https://via.placeholder.com/300x200",
          alt: "Image description",
          width: "100%",
        };
      case "button":
        return {
          text: "Button",
          url: "#",
          backgroundColor: "#3b82f6",
          textColor: "#ffffff",
          size: "medium",
        };
      case "container":
        return {
          width: "100%",
          backgroundColor: "transparent",
          padding: "20px",
        };
      case "divider":
        return {
          style: "solid",
          color: "#e5e7eb",
          width: "100%",
          thickness: "1px",
        };
      case "input":
        return {
          placeholder: "Enter text...",
          label: "Input Field",
          required: false,
        };
      case "textarea":
        return {
          placeholder: "Enter text...",
          label: "Text Area",
          required: false,
          rows: 4,
        };
      case "checkbox":
        return {
          label: "Checkbox option",
          required: false,
        };
      default:
        return {};
    }
  };

  // Get the selected component
  const selectedComponent = selectedComponentId
    ? components.find(component => component.id === selectedComponentId)
    : null;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--primary))]"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
            Error
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => router.push(`/dashboard/websites/${id}`)}
            className="bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-light))] text-white px-4 py-2 rounded-md font-medium transition-colors">
            Return to Website
          </button>
        </div>
      </div>
    );
  }

  // If no page found
  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Page not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push(`/dashboard/websites/${id}`)}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              <svg
                className="w-5 h-5 mr-2"
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
              Back to Website
            </button>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {website?.name || "Static Site Builder"}
              </h1>
              <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
              <span className="text-gray-600 dark:text-gray-400">
                {page.title}
              </span>
              {page.isHomePage && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 py-0.5 px-1.5 rounded">
                  Home
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span
                className={`text-sm ${
                  savedStatus === "saved"
                    ? "text-green-600 dark:text-green-400"
                    : ""
                }${
                  savedStatus === "saving"
                    ? "text-yellow-600 dark:text-yellow-400"
                    : ""
                }${
                  savedStatus === "error"
                    ? "text-red-600 dark:text-red-400"
                    : ""
                }`}>
                {savedStatus === "saved" && (
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Saved
                  </span>
                )}
                {savedStatus === "saving" && (
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Saving...
                  </span>
                )}
                {savedStatus === "error" && (
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    Error saving
                  </span>
                )}
              </span>
            </div>
            <button
              onClick={() => window.open(`/preview/${id}`, "_blank")}
              className="flex items-center px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md transition-colors">
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
            </button>
          </div>
        </div>
      </header>

      {/* Main Builder Interface */}
      <DndProvider backend={HTML5Backend}>
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Left Sidebar - Component Library */}
          <BuilderSidebar>
            <ComponentLibrary onAddComponent={handleAddComponent} />
          </BuilderSidebar>

          {/* Main Canvas */}
          <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900">
            <BuilderCanvas
              components={components}
              selectedComponentId={selectedComponentId}
              onSelectComponent={handleSelectComponent}
              onAddComponent={handleAddComponent}
              onMoveComponent={handleMoveComponent}
              onUpdateComponent={handleUpdateComponent}
            />
          </div>

          {/* Right Sidebar - Properties */}
          <BuilderProperties
            component={selectedComponent}
            onUpdateComponent={handleUpdateComponent}
            onDeleteComponent={handleDeleteComponent}
          />
        </div>
      </DndProvider>
    </div>
  );
}
