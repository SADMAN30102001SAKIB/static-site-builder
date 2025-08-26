"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function StatusBadge({ verified, isLoading }) {
  if (isLoading) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-1"></div>
        Checking...
      </span>
    );
  }

  if (verified) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
        Verified
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></div>
      Pending
    </span>
  );
}

export default function DomainsPage() {
  const { data: session, status } = useSession();
  const [domains, setDomains] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [newDomain, setNewDomain] = useState({
    websiteId: "",
    customDomain: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to determine if domain is a subdomain
  const isSubdomain = domain => {
    const parts = domain.split(".");
    return parts.length > 2;
  };

  // Helper function to get subdomain name
  const getSubdomainName = domain => {
    const parts = domain.split(".");
    return parts.length > 2 ? parts[0] : "";
  };

  const fetchData = async () => {
    if (!session) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch domains and websites in parallel
      const [domainsResponse, websitesResponse] = await Promise.all([
        fetch("/api/domains"),
        fetch("/api/websites"),
      ]);

      if (!domainsResponse.ok || !websitesResponse.ok) {
        const errorData = domainsResponse.ok
          ? await websitesResponse.json()
          : await domainsResponse.json();
        throw new Error(errorData.error || "Failed to fetch data");
      }

      const [domainsData, websitesData] = await Promise.all([
        domainsResponse.json(),
        websitesResponse.json(),
      ]);

      setDomains(domainsData.domains || []);
      setWebsites(websitesData.websites || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError({
        message:
          err.message || "Failed to load domains. Please try again later.",
        code: err.code || "UNKNOWN_ERROR",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
                        <StatusBadge
                          verified={domain.domainVerified}
                          isLoading={false}
                        />
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
                            records to your domain provider:
                          </p>
                          <div className="mt-2">
                            {isSubdomain(domain.customDomain) ? (
                              <div className="text-xs bg-white dark:bg-gray-800 p-3 rounded border">
                                <div className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                  CNAME Record (For Subdomain)
                                </div>
                                <div className="font-mono space-y-1">
                                  <div>
                                    Type:{" "}
                                    <span className="text-purple-600 font-semibold">
                                      CNAME
                                    </span>
                                  </div>
                                  <div>
                                    Host:{" "}
                                    <span className="text-purple-600 font-semibold">
                                      {getSubdomainName(domain.customDomain)}
                                    </span>
                                  </div>
                                  <div>
                                    Value:{" "}
                                    <span className="text-purple-600 font-semibold">
                                      f69a4e046fbb9111.vercel-dns-017.com
                                    </span>
                                  </div>
                                  <div className="text-gray-500 text-xs mt-1">
                                    TTL: 1800 (or automatic)
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-xs bg-white dark:bg-gray-800 p-3 rounded border">
                                <div className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                  A Record (For Base Domain)
                                </div>
                                <div className="font-mono space-y-1">
                                  <div>
                                    Type:{" "}
                                    <span className="text-blue-600 font-semibold">
                                      A
                                    </span>
                                  </div>
                                  <div>
                                    Host:{" "}
                                    <span className="text-blue-600 font-semibold">
                                      @
                                    </span>
                                  </div>
                                  <div>
                                    Value:{" "}
                                    <span className="text-blue-600 font-semibold">
                                      216.198.79.1
                                    </span>
                                  </div>
                                  <div className="text-gray-500 text-xs mt-1">
                                    TTL: 1800 (or automatic)
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                            <p className="text-xs text-green-800 dark:text-green-200">
                              ✅{" "}
                              <strong>
                                Domain automatically registered with Vercel!
                              </strong>
                              <br />
                              🔒 SSL certificate will be provisioned
                              automatically
                              <br />⚡ Configure your DNS and click "Verify"
                              below
                            </p>
                          </div>
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
                  want to connect to your website. We'll automatically register
                  it with Vercel for you! You can add either a base domain (like
                  sadman.me) or a subdomain (like portfolio.sadman.me).
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
                  2
                </span>
                <div>
                  <strong>Configure DNS</strong> - Add the appropriate DNS
                  record in your domain registrar:
                  <br />
                  <div className="mt-2 space-y-2">
                    <div>
                      <strong>For Base Domains (e.g., sadman.me):</strong>
                      <br />
                      <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded font-semibold text-blue-600">
                        Type: A, Host: @, Value: 216.198.79.1, TTL: 1800
                      </code>
                    </div>
                    <div>
                      <strong>
                        For Subdomains (e.g., portfolio.sadman.me):
                      </strong>
                      <br />
                      <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded font-semibold text-purple-600">
                        Type: CNAME, Host: [subdomain], Value:
                        f69a4e046fbb9111.vercel-dns-017.com, TTL: 1800
                      </code>
                    </div>
                  </div>
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
                  <strong>Verify</strong> - Click the verify button to check
                  domain configuration with Vercel. SSL certificates are
                  provisioned automatically!
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
