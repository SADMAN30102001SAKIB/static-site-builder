"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";

export default function Templates() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [templates, setTemplates] = useState([]);
  const [myTemplates, setMyTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("browse"); // "browse" or "my-templates"
  const [forkingTemplate, setForkingTemplate] = useState(null);

  useEffect(() => {
    fetchTemplates();
    if (session) {
      fetchMyTemplates();
    }
  }, [session]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/templates");
      if (!response.ok) throw new Error("Failed to fetch templates");

      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (err) {
      console.error("Error fetching templates:", err);
      setError("Failed to load templates");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyTemplates = async () => {
    try {
      const response = await fetch("/api/templates/my-templates");
      if (!response.ok) throw new Error("Failed to fetch my templates");

      const data = await response.json();
      setMyTemplates(data.templates || []);
    } catch (err) {
      console.error("Error fetching my templates:", err);
    }
  };

  const handleForkTemplate = async templateId => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to fork templates",
        variant: "destructive",
      });
      return;
    }

    setForkingTemplate(templateId);
    try {
      const response = await fetch("/api/templates/fork", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fork template");
      }

      const data = await response.json();
      toast({
        title: "Template Forked Successfully!",
        description: `Your new website: "${data.website.name}"`,
        variant: "success",
      });

      // Refresh templates to show updated fork count
      fetchTemplates();
    } catch (err) {
      console.error("Error forking template:", err);
      toast({
        title: "Failed to Fork Template",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setForkingTemplate(null);
    }
  };

  const handleRemoveFromTemplates = async websiteId => {
    try {
      const response = await fetch("/api/templates/unshare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to remove from templates");
      }

      toast({
        title: "Template Removed Successfully!",
        description: "Template removed successfully!",
        variant: "success",
      });
      fetchMyTemplates();
      fetchTemplates();
    } catch (err) {
      console.error("Error removing template:", err);
      toast({
        title: "Failed to Remove Template",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Templates
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover beautiful website templates or share your own creations
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("browse")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "browse"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}>
            Browse Templates
          </button>
          {session && (
            <button
              onClick={() => setActiveTab("my-templates")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "my-templates"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}>
              My Templates
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Browse Templates Tab */}
        {activeTab === "browse" && (
          <div>
            {templates.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No templates available yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Be the first to share a template with the community!
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map(template => (
                  <Card key={template.id} className="overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0 pr-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                            {template.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            by {template.user.name || template.user.email}
                          </p>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {template.forkCount} forks
                        </div>
                      </div>

                      {template.templateDescription && (
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                          {template.templateDescription}
                        </p>
                      )}

                      {template.templateTags && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {template.templateTags
                            .split(",")
                            .map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                                {tag.trim()}
                              </span>
                            ))}
                        </div>
                      )}

                      <div className="flex space-x-3">
                        <Button
                          href={`/site/${template.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="outline"
                          size="sm"
                          className="flex-1">
                          View
                        </Button>
                        <Button
                          onClick={() => handleForkTemplate(template.id)}
                          disabled={forkingTemplate === template.id}
                          size="sm"
                          className="flex-1">
                          {forkingTemplate === template.id
                            ? "Forking..."
                            : "Fork"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Templates Tab */}
        {activeTab === "my-templates" && session && (
          <MyTemplatesTab
            myTemplates={myTemplates}
            onRemoveFromTemplates={handleRemoveFromTemplates}
            onTemplatesChanged={() => {
              fetchTemplates();
              fetchMyTemplates();
            }}
            toast={toast}
          />
        )}
      </div>
    </Container>
  );
}

function MyTemplatesTab({
  myTemplates,
  onRemoveFromTemplates,
  onTemplatesChanged,
  toast,
}) {
  const [websites, setWebsites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [shareForm, setShareForm] = useState({
    templateDescription: "",
    templateTags: "",
  });

  useEffect(() => {
    fetchMyWebsites();
  }, []);

  const fetchMyWebsites = async () => {
    try {
      const response = await fetch("/api/websites");
      if (!response.ok) throw new Error("Failed to fetch websites");

      const data = await response.json();
      setWebsites(data.websites || []);
    } catch (err) {
      console.error("Error fetching websites:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareClick = website => {
    setSelectedWebsite(website);
    setShareForm({
      templateDescription: website.description || "",
      templateTags: "",
    });
    setShowShareModal(true);
  };

  const handleShareSubmit = async () => {
    if (!selectedWebsite) return;

    try {
      const response = await fetch("/api/templates/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteId: selectedWebsite.id,
          templateDescription: shareForm.templateDescription,
          templateTags: shareForm.templateTags,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to share as template");
      }

      toast({
        title: "Template Shared Successfully!",
        description: "Website shared as template successfully!",
        variant: "success",
      });
      setShowShareModal(false);
      fetchMyWebsites();
      if (onTemplatesChanged) onTemplatesChanged();
    } catch (err) {
      console.error("Error sharing as template:", err);
      toast({
        title: "Failed to Share Template",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const publishedWebsites = websites.filter(site => site.published);
  const sharedTemplates = myTemplates;

  return (
    <div className="space-y-8">
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Share "{selectedWebsite?.name}" as Template
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Template Description
                </label>
                <textarea
                  value={shareForm.templateDescription}
                  onChange={e =>
                    setShareForm(prev => ({
                      ...prev,
                      templateDescription: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows="3"
                  placeholder="Describe your template for other users..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={shareForm.templateTags}
                  onChange={e =>
                    setShareForm(prev => ({
                      ...prev,
                      templateTags: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g. business, portfolio, blog"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                onClick={() => setShowShareModal(false)}
                variant="outline"
                className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleShareSubmit} className="flex-1">
                Share as Template
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Shared Templates */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          My Shared Templates
        </h2>
        {sharedTemplates.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-300">
                You haven't shared any templates yet.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sharedTemplates.map(template => (
              <Card key={template.id}>
                <div className="p-4">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                      {template.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    {template.forkCount} forks
                  </p>
                  {template.templateDescription && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                      {template.templateDescription}
                    </p>
                  )}
                  <div className="flex space-x-2">
                    <Button
                      href={`/site/${template.slug}`}
                      target="_blank"
                      variant="outline"
                      size="sm">
                      View
                    </Button>
                    <Button
                      onClick={() => onRemoveFromTemplates(template.id)}
                      variant="outline"
                      size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Published Websites that can be shared */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Share as Template
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Share your published websites as templates for others to use.
        </p>

        {publishedWebsites.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-300">
                You need to publish a website before you can share it as a
                template.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {publishedWebsites
              .filter(site => !site.isTemplate) // Only show non-template sites
              .map(website => (
                <Card key={website.id}>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {website.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {website.description || "No description"}
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        href={`/site/${website.slug}`}
                        target="_blank"
                        variant="outline"
                        size="sm">
                        View
                      </Button>
                      <Button
                        onClick={() => handleShareClick(website)}
                        size="sm">
                        Share as Template
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
