// Server-side rendering that reuses component logic from componentRenderers.jsx
import componentRenderers, { defaultRenderer } from "./componentRenderers.jsx";

// Helper to convert React element to HTML string
function reactElementToHtml(element) {
  if (typeof element === "string") {
    return element;
  }

  if (typeof element === "number") {
    return String(element);
  }

  if (!element || typeof element !== "object") {
    return "";
  }

  if (Array.isArray(element)) {
    return element.map(reactElementToHtml).join("");
  }

  const { type, props = {} } = element;
  const { children, style, className, ...otherProps } = props;

  // Build style string
  let styleStr = "";
  if (style && typeof style === "object") {
    styleStr = Object.entries(style)
      .map(([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${v}`)
      .join("; ");
  }

  // Build attributes
  let attrs = [];
  if (styleStr) attrs.push(`style="${styleStr}"`);
  if (className) attrs.push(`class="${className}"`);

  // Add other props as attributes
  Object.entries(otherProps).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== false) {
      if (v === true) {
        attrs.push(k);
      } else {
        attrs.push(`${k}="${v}"`);
      }
    }
  });

  const attrsStr = attrs.join(" ");

  // Self-closing tags
  if (["img", "input", "br", "hr"].includes(type)) {
    return `<${type}${attrsStr ? " " + attrsStr : ""} />`;
  }

  // Regular tags
  const childrenHtml = children ? reactElementToHtml(children) : "";
  return `<${type}${attrsStr ? " " + attrsStr : ""}>${childrenHtml}</${type}>`;
}

function renderComponentTree(components, parentId = null) {
  const componentsAtLevel = components.filter(c => c.parentId === parentId);
  let html = "";

  componentsAtLevel.forEach(component => {
    const childComponents = components.filter(c => c.parentId === component.id);
    const renderer = componentRenderers[component.type] || defaultRenderer;

    const childElements =
      childComponents.length > 0
        ? renderComponentTree(components, component.id)
        : null;

    // Parse properties from JSON string to object
    let properties = {};
    if (component.properties) {
      try {
        properties = JSON.parse(component.properties);
      } catch (error) {
        console.error(
          "Error parsing component properties:",
          error,
          component.properties,
        );
        properties = {};
      }
    }

    // Call the actual React component renderer
    const reactElement = renderer({
      properties: properties,
      children: childElements,
      type: component.type,
    });

    // Convert to HTML - no extra container wrapping needed
    const componentHtml = reactElementToHtml(reactElement);
    html += componentHtml;
  });

  return html;
}

export function renderPageToHtml(page) {
  if (!page || !page.components) {
    return "<div>No content found</div>";
  }

  return `<div class="space-y-6 px-6 sm:px-12 lg:px-20 xl:px-24 max-w-7xl mx-auto">${renderComponentTree(
    page.components,
  )}</div>`;
}

export function generateFullPageHtml(page, website, isPreview = false) {
  const componentsHtml = renderPageToHtml(page);
  const allPages = website.pages;

  // Generate navigation for preview mode
  const navigationHtml = isPreview
    ? `
    <nav style="background-color: #374151; padding: 15px; border-bottom: 1px solid #4b5563;">
      <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 20px; align-items: center;">
        <strong style="color: #f9fafb;">📋 Preview: ${website.name}</strong>
        <div style="flex: 1; display: flex; gap: 15px; flex-wrap: wrap;">
          ${allPages
            .map(
              p => `
            <a href="/preview/${website.id}${p.isHomePage ? "" : p.path}" 
               style="color: ${
                 p.id === page.id ? "#60a5fa" : "#d1d5db"
               }; text-decoration: none; padding: 5px 10px; border-radius: 4px; background-color: ${
                p.id === page.id ? "#1e40af" : "transparent"
              };">
              ${p.isHomePage ? "🏠 " : ""}${p.title}${
                p.published ? "" : " (Draft)"
              }
            </a>
          `,
            )
            .join("")}
        </div>
        <div style="display: flex; gap: 10px;">
          <a href="/site/${website.slug}${page.isHomePage ? "" : page.path}" 
             style="color: #10b981; text-decoration: none; padding: 5px 10px; border: 1px solid #10b981; border-radius: 4px; background-color: transparent;">
            🌐 View Site
          </a>
          <a href="/dashboard/websites/${
            website.id
          }" style="color: #d1d5db; text-decoration: none; padding: 5px 10px; border: 1px solid #4b5563; border-radius: 4px; background-color: #374151;">
            ← Back to Dashboard
        </a>
      </div>
    </nav>
  `
    : "";

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${page.seoTitle || page.title || website.name}</title>
        <meta name="description" content="${page.seoDescription || ""}">
        <meta name="keywords" content="${page.seoKeywords || ""}">
        
        <!-- Open Graph -->
        <meta property="og:title" content="${
          page.ogTitle || page.title || website.name
        }">
        <meta property="og:description" content="${
          page.ogDescription || page.seoDescription || ""
        }">
        <meta property="og:image" content="${page.ogImage || ""}">
        <meta property="og:type" content="website">
        
        <!-- Twitter Card -->
        <meta name="twitter:card" content="${page.twitterCard || "summary"}">
        <meta name="twitter:title" content="${
          page.twitterTitle || page.title || website.name
        }">
        <meta name="twitter:description" content="${
          page.twitterDescription || page.seoDescription || ""
        }">
        <meta name="twitter:image" content="${
          page.twitterImage || page.ogImage || ""
        }">
        
        <!-- Include Tailwind CSS for proper styling -->
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            darkMode: 'class',
            theme: {
              extend: {
                colors: {
                  primary: {
                    DEFAULT: 'rgb(37, 99, 235)',
                    light: 'rgb(93, 139, 244)',
                    dark: 'rgb(30, 64, 175)',
                  },
                  secondary: {
                    DEFAULT: 'rgb(249, 115, 22)',
                    light: 'rgb(251, 146, 60)',
                    dark: 'rgb(194, 65, 12)',
                  },
                  success: 'rgb(34, 197, 94)',
                  error: 'rgb(220, 38, 38)',
                  warning: 'rgb(234, 179, 8)',
                }
              }
            }
          }
        </script>
        <style>
          :root {
            --foreground-rgb: 0, 0, 0;
            --background-start-rgb: 250, 250, 250;
            --background-end-rgb: 255, 255, 255;
            --primary: 37, 99, 235;
            --primary-light: 93, 139, 244;
            --primary-dark: 30, 64, 175;
            --secondary: 249, 115, 22;
            --secondary-light: 251, 146, 60;
            --secondary-dark: 194, 65, 12;
            --success: 34, 197, 94;
            --error: 220, 38, 38;
            --warning: 234, 179, 8;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --foreground-rgb: 255, 255, 255;
              --background-start-rgb: 10, 10, 10;
              --background-end-rgb: 30, 30, 30;
            }
          }
          
          /* Force dark mode to match builder */
          html {
            color-scheme: dark;
          }
          
          body { 
            background-color: #111827 !important; /* gray-900 */
            color: #f9fafb !important; /* gray-50 */
          }
          .website-container { 
            min-height: 100vh; 
            padding: 1rem; 
            background-color: #111827; /* gray-900 */
          }
          .space-y-6 > * + * { margin-top: 1.5rem; }
          .mb-4 { margin-bottom: 1rem; }
          
          /* Force white backgrounds for form elements - more specific selectors */
          input[type="checkbox"],
          input[type="checkbox"]:not(:checked),
          input[type="checkbox"]:checked,
          .dark input[type="checkbox"],
          .dark input[type="checkbox"]:not(:checked),
          .dark input[type="checkbox"]:checked {
            background-color: #ffffff !important;
            background-image: none !important;
            border: 1px solid #d1d5db !important;
            appearance: none !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            width: 1rem !important;
            height: 1rem !important;
            border-radius: 0.25rem !important;
            position: relative !important;
          }
          
          input[type="checkbox"]:checked,
          .dark input[type="checkbox"]:checked {
            background-color: #ffffff !important;
            border-color: rgb(37, 99, 235) !important;
            background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='rgb(37, 99, 235)' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e") !important;
          }
          
          /* Override any Tailwind dark mode checkbox styles */
          .dark input[type="checkbox"]:focus {
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2) !important;
          }
        </style>
      </head>
      <body class="dark">
        ${navigationHtml}
        <div class="website-container">
          ${componentsHtml}
        </div>
      </body>
    </html>
  `;
}
