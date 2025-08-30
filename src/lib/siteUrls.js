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

// Calculate the best URL for viewing a website (synchronous version)
function calculateViewSiteUrl(website, firstPublishedPage) {
  // If a first published page is provided and it's not the home page,
  // it means home page is not published, so redirect to first available published page
  if (firstPublishedPage && !firstPublishedPage.isHomePage) {
    const redirectPath =
      firstPublishedPage.path === "/" ? "" : firstPublishedPage.path;
    return getLiveSiteUrlForPath(website, redirectPath);
  } else {
    // Either home page is published or no published pages, go to home
    return getLiveSiteUrl(website);
  }
}

// For use in dashboard components - optimized version using pre-calculated data
export function openLiveSiteOptimized(website, firstPublishedPage) {
  const url = calculateViewSiteUrl(website, firstPublishedPage);
  window.open(url, "_blank");
}
