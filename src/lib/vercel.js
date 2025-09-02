const VERCEL_API_BASE = "https://api.vercel.com";
const VERCEL_ACCESS_TOKEN = process.env.VERCEL_ACCESS_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

if (!VERCEL_ACCESS_TOKEN || !VERCEL_PROJECT_ID) {
  console.warn(
    "⚠️ Vercel API credentials missing. Custom domains will not work.",
  );
}

async function vercelApiFetch(
  path,
  method = "GET",
  body = null,
  maxRetries = 3,
) {
  const headers = {
    Authorization: `Bearer ${VERCEL_ACCESS_TOKEN}`,
    ...(VERCEL_TEAM_ID && { "X-Vercel-Team-Id": VERCEL_TEAM_ID }),
    "Content-Type": "application/json",
  };

  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`${VERCEL_API_BASE}${path}`, {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
      });

      const data = await response.json().catch(() => ({}));

      // If successful or client error (don't retry 4xx), return immediately
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return { response, data };
      }

      // Server error (5xx) - retry with exponential backoff
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Cap at 10s
        console.warn(
          `⚠️ Vercel API attempt ${attempt} failed (${response.status}), retrying in ${delay}ms...`,
        );
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      return { response, data };
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        console.warn(
          `⚠️ Vercel API attempt ${attempt} failed (${error.message}), retrying in ${delay}ms...`,
        );
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
    }
  }

  throw lastError || new Error("Max retries exceeded");
}

function createVercelError(
  message,
  code = "VERCEL_API_ERROR",
  status = 500,
  details = {},
) {
  return {
    success: false,
    error: {
      message,
      code,
      status,
      details,
      timestamp: new Date().toISOString(),
    },
  };
}

export function validateDomain(domain) {
  if (!domain || typeof domain !== "string") {
    return { valid: false, error: "Domain is required and must be a string" };
  }

  const cleanDomain = domain.toLowerCase().trim();

  // Basic domain format validation
  const domainRegex =
    /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

  if (!domainRegex.test(cleanDomain)) {
    return { valid: false, error: "Invalid domain format" };
  }

  // Reject localhost and IP addresses
  if (
    cleanDomain.includes("localhost") ||
    /^\d+\.\d+\.\d+\.\d+$/.test(cleanDomain)
  ) {
    return {
      valid: false,
      error: "Localhost and IP addresses are not supported",
    };
  }

  // Reject common test domains
  const testDomains = ["example.com", "test.com", "localhost.com"];
  if (testDomains.includes(cleanDomain)) {
    return { valid: false, error: "Test domains are not allowed" };
  }

  return { valid: true };
}

export async function addDomainToVercel(domain, maxRetries = 3) {
  if (!VERCEL_ACCESS_TOKEN || !VERCEL_PROJECT_ID) {
    return createVercelError(
      "Vercel API credentials not configured",
      "MISSING_CREDENTIALS",
      500,
    );
  }

  // Validate domain format
  const validation = validateDomain(domain);
  if (!validation.valid) {
    return createVercelError(validation.error, "INVALID_DOMAIN", 400);
  }

  try {
    console.log(
      `🚀 [${domain}] Adding to Vercel project ${VERCEL_PROJECT_ID}...`,
    );

    const { response, data } = await vercelApiFetch(
      `/v9/projects/${VERCEL_PROJECT_ID}/domains`,
      "POST",
      { name: domain },
      maxRetries,
    );

    if (response.ok) {
      console.log(
        `✅ [${domain}] Successfully added to Vercel project ${VERCEL_PROJECT_ID}`,
      );
      return {
        success: true,
        data: data,
      };
    }

    // Handle specific Vercel errors
    if (response.status === 409) {
      return createVercelError(
        "Domain is already in use by another Vercel project",
        "DOMAIN_CONFLICT",
        409,
        { domain },
      );
    }

    if (response.status === 400) {
      return createVercelError(
        data.error?.message || "Invalid domain format",
        "INVALID_DOMAIN",
        400,
        { domain, vercelError: data.error },
      );
    }

    return createVercelError(
      data.error?.message || `Vercel API error: ${response.status}`,
      "VERCEL_API_ERROR",
      response.status,
      { domain, vercelError: data.error },
    );
  } catch (error) {
    console.error(
      `❌ [${domain}] Failed to add domain:`,
      error?.message || error,
    );
    return createVercelError(
      "Failed to communicate with Vercel API",
      "NETWORK_ERROR",
      500,
      { domain, originalError: error?.message },
    );
  }
}

export async function removeDomainFromVercel(domain) {
  if (!VERCEL_ACCESS_TOKEN || !VERCEL_PROJECT_ID) {
    return createVercelError(
      "Vercel API credentials not configured",
      "MISSING_CREDENTIALS",
      500,
    );
  }

  try {
    console.log(
      `🗑️ [${domain}] Removing from Vercel project ${VERCEL_PROJECT_ID}...`,
    );

    const { response, data } = await vercelApiFetch(
      `/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}`,
      "DELETE",
    );

    if (response.ok) {
      console.log(`✅ [${domain}] Successfully removed from Vercel project`);
      return {
        success: true,
        data: data,
      };
    }

    if (response.status === 404) {
      return createVercelError(
        "Domain not found in Vercel project",
        "DOMAIN_NOT_FOUND",
        404,
        { domain },
      );
    }

    return createVercelError(
      data.error?.message || `Vercel API error: ${response.status}`,
      "VERCEL_API_ERROR",
      response.status,
      { domain, vercelError: data.error },
    );
  } catch (error) {
    console.error(
      `❌ [${domain}] Failed to remove domain:`,
      error?.message || error,
    );
    return createVercelError(
      "Failed to communicate with Vercel API",
      "NETWORK_ERROR",
      500,
      { domain, originalError: error?.message },
    );
  }
}

export async function verifyDomainWithVercel(domain) {
  if (!VERCEL_ACCESS_TOKEN || !VERCEL_PROJECT_ID) {
    return createVercelError(
      "Vercel API credentials not configured",
      "MISSING_CREDENTIALS",
      500,
    );
  }

  try {
    console.log(`🔍 [${domain}] Checking verification status...`);

    const { response, data } = await vercelApiFetch(
      `/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}`,
    );

    if (response.ok) {
      const isVerified = data.verified === true;
      console.log(
        `${isVerified ? "✅" : "⏳"} [${domain}] Verification status: ${
          isVerified ? "verified" : "pending"
        }`,
      );

      return {
        success: true,
        verified: isVerified,
        data: data,
      };
    }

    if (response.status === 404) {
      return createVercelError(
        "Domain not found in Vercel project",
        "DOMAIN_NOT_FOUND",
        404,
        { domain },
      );
    }

    return createVercelError(
      data.error?.message || `Vercel API error: ${response.status}`,
      "VERCEL_API_ERROR",
      response.status,
      { domain, vercelError: data.error },
    );
  } catch (error) {
    console.error(
      `❌ [${domain}] Failed to verify domain:`,
      error?.message || error,
    );
    return createVercelError(
      "Failed to communicate with Vercel API",
      "NETWORK_ERROR",
      500,
      { domain, originalError: error?.message },
    );
  }
}

export async function getDomainFromVercel(domain) {
  if (!VERCEL_ACCESS_TOKEN || !VERCEL_PROJECT_ID) {
    return createVercelError(
      "Vercel API credentials not configured",
      "MISSING_CREDENTIALS",
      500,
    );
  }

  try {
    console.log(`📋 [${domain}] Fetching domain info...`);

    const { response, data } = await vercelApiFetch(
      `/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}`,
    );

    if (response.ok) {
      console.log(`✅ [${domain}] Domain info retrieved successfully`);
      return {
        success: true,
        data: data,
      };
    }

    if (response.status === 404) {
      return createVercelError(
        "Domain not found in Vercel project",
        "DOMAIN_NOT_FOUND",
        404,
        { domain },
      );
    }

    return createVercelError(
      data.error?.message || `Vercel API error: ${response.status}`,
      "VERCEL_API_ERROR",
      response.status,
      { domain, vercelError: data.error },
    );
  } catch (error) {
    console.error(
      `❌ [${domain}] Failed to get domain info:`,
      error?.message || error,
    );
    return createVercelError(
      "Failed to communicate with Vercel API",
      "NETWORK_ERROR",
      500,
      { domain, originalError: error?.message },
    );
  }
}
