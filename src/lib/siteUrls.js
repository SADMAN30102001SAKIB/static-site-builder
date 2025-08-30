// Utility to get the correct live site URL for a website
// Handles both custom domain and normal /site/slug access

function getLiveSiteUrl(website) {
  // If website has a verified custom domain, use that
  if (website.customDomain && website.domainVerified) {
    return `https://${website.customDomain}`;
  }

  // Otherwise use the normal /site/slug format
  return `/site/${website.slug}`;
}

function getLiveSiteUrlForPath(website, path = "") {
  const baseUrl = getLiveSiteUrl(website);

  // If it's already a full URL (custom domain), append path
  if (baseUrl.startsWith("http")) {
    return `${baseUrl}${path}`;
  }

  // Otherwise it's a relative URL, append path
  return `${baseUrl}${path}`;
}

// Get the first published page for a website
async function getFirstPublishedPage(websiteId) {
  try {
    const response = await fetch(
      `/api/websites/${websiteId}/first-published-page`,
    );
    if (response.ok) {
      const data = await response.json();
      return data.firstPublishedPage;
    }
  } catch (error) {
    console.error("Error getting first published page:", error);
  }
  return null;
}

// For use in dashboard components
export async function openLiveSite(website, path = "") {
  // If a specific path is provided, use it
  if (path) {
    const url = getLiveSiteUrlForPath(website, path);
    window.open(url, "_blank");
    return;
  }

  // If no path is provided, check if we should redirect to first published page
  // This happens when home page is not published
  const firstPublishedPage = await getFirstPublishedPage(website.id);

  if (firstPublishedPage && !firstPublishedPage.isHomePage) {
    // Home page is not published, redirect to first available published page
    const redirectPath =
      firstPublishedPage.path === "/" ? "" : firstPublishedPage.path;
    const url = getLiveSiteUrlForPath(website, redirectPath);
    window.open(url, "_blank");
  } else {
    // Either home page is published or no published pages, go to home
    const url = getLiveSiteUrl(website);
    window.open(url, "_blank");
  }
}
