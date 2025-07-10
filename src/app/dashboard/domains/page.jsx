"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function DomainsPage() {
  const { data: session, status } = useSession();
  const [domains, setDomains] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [newDomain, setNewDomain] = useState({
    websiteId: "",
    customDomain: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!session) return;

      try {
        setIsLoading(true);
        setError("");

        // Fetch domains and websites in parallel
        const [domainsResponse, websitesResponse] = await Promise.all([
          fetch("/api/domains"),
          fetch("/api/websites"),
        ]);

        if (!domainsResponse.ok || !websitesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [domainsData, websitesData] = await Promise.all([
          domainsResponse.json(),
          websitesResponse.json(),
        ]);

        setDomains(domainsData.domains || []);
        setWebsites(websitesData.websites || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load domains. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    if (session && domains.length === 0) {
      fetchData();
    } else if (status !== "loading") {
      setIsLoading(false);
    }
  }, [session, status]);

  const handleAddDomain = async e => {
    e.preventDefault();

    if (!newDomain.websiteId || !newDomain.customDomain) {
      setError("Please select a website and enter a domain");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/domains", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDomain),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add domain");
      }

      // Refresh domains list
      const domainsResponse = await fetch("/api/domains");
      if (domainsResponse.ok) {
        const domainsData = await domainsResponse.json();
        setDomains(domainsData.domains || []);
      }

      // Reset form
      setNewDomain({ websiteId: "", customDomain: "" });
      setShowAddDomain(false);
    } catch (err) {
      console.error("Error adding domain:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveDomain = async domain => {
    if (!confirm(`Are you sure you want to remove ${domain}?`)) {
      return;
    }

    try {
      const response = await fetch(
        `/api/domains/${encodeURIComponent(domain)}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to remove domain");
      }

      // Refresh domains list
      setDomains(domains.filter(d => d.customDomain !== domain));
    } catch (err) {
      console.error("Error removing domain:", err);
      setError(err.message);
    }
  };

  const handleVerifyDomain = async domain => {
    try {
      const response = await fetch(
        `/api/domains/${encodeURIComponent(domain)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "verify" }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify domain");
      }

      // Update domain status in state
      setDomains(
        domains.map(d =>
          d.customDomain === domain ? { ...d, domainVerified: true } : d,
        ),
      );
    } catch (err) {
      console.error("Error verifying domain:", err);
      setError(err.message);
    }
  };

  // Filter websites that don't have custom domains yet
  const availableWebsites = websites.filter(
    website => !domains.some(domain => domain.id === website.id),
  );

  if (status === "loading" || isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Custom Domains
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Connect your own domains to your websites
            </p>
          </div>
          <Button
            onClick={() => setShowAddDomain(true)}
            disabled={availableWebsites.length === 0}>
            Add Domain
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Add Domain Form */}
        {showAddDomain && (
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Add Custom Domain
              </h2>
              <form onSubmit={handleAddDomain} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Website
                  </label>
                  <select
                    value={newDomain.websiteId}
                    onChange={e =>
                      setNewDomain({ ...newDomain, websiteId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required>
                    <option value="">Choose a website...</option>
                    {availableWebsites.map(website => (
                      <option key={website.id} value={website.id}>
                        {website.name} ({website.slug})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Custom Domain
                  </label>
                  <Input
                    type="text"
                    value={newDomain.customDomain}
                    onChange={e =>
                      setNewDomain({
                        ...newDomain,
                        customDomain: e.target.value.toLowerCase(),
                      })
                    }
                    placeholder="example.com"
                    required
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Enter your domain without www (e.g., example.com)
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Domain"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddDomain(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        )}

        {/* Domains List */}
        {domains.length === 0 ? (
          <Card>
            <div className="p-8 text-center">
              <div className="text-gray-400 dark:text-gray-600 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No custom domains yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Add a custom domain to make your website accessible via your own
                URL
              </p>
              {availableWebsites.length > 0 && (
                <Button onClick={() => setShowAddDomain(true)}>
                  Add Your First Domain
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {domains.map(domain => (
              <Card key={domain.id}>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {domain.customDomain}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            domain.domainVerified
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}>
                          {domain.domainVerified ? "Verified" : "Pending"}
                        </span>
                        {domain.published && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Live
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Connected to: <strong>{domain.name}</strong> (
                        {domain.slug})
                      </p>
                      {!domain.domainVerified && (
                        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            <strong>Setup Required:</strong> Add these DNS
                            records to your domain:
                          </p>
                          <div className="mt-2 text-xs font-mono bg-white dark:bg-gray-800 p-2 rounded border">
                            <div>Type: CNAME</div>
                            <div>Name: @ (or www)</div>
                            <div>
                              Value: static-site-builder-omega.vercel.app
                            </div>
                          </div>
                          <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-2">
                            💡 <strong>For Development:</strong> Use
                            static-site-builder-omega.vercel.app
                            <br />
                            🚀 <strong>For Production:</strong> Use
                            cname.vercel-dns.com (when you have Vercel Pro)
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!domain.domainVerified && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleVerifyDomain(domain.customDomain)
                          }>
                          Verify
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(
                            `https://${domain.customDomain}`,
                            "_blank",
                          )
                        }
                        disabled={!domain.domainVerified || !domain.published}>
                        Visit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveDomain(domain.customDomain)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Instructions */}
        <Card className="mt-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              How to Set Up Your Custom Domain
            </h2>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
                  1
                </span>
                <div>
                  <strong>Add your domain above</strong> - Enter the domain you
                  want to connect to your website
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
                  2
                </span>
                <div>
                  <strong>Configure DNS</strong> - Add a CNAME record in your
                  domain registrar pointing to{" "}
                  <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
                    static-site-builder-omega.vercel.app
                  </code>
                  <br />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    (For testing, you can get free domains from DuckDNS,
                    Freenom, or NoIP)
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
                  3
                </span>
                <div>
                  <strong>Wait for DNS</strong> - DNS changes take 5-10 minutes
                  to propagate across the internet. You can test with:{" "}
                  <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">
                    nslookup yourdomain.com
                  </code>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
                  4
                </span>
                <div>
                  <strong>Verify</strong> - Click the verify button (currently
                  just marks as verified in database - real DNS verification
                  coming soon!)
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
                  5
                </span>
                <div>
                  <strong>Go Live</strong> - Make sure your website is published
                  to make it accessible via your custom domain
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Container>
  );
}
