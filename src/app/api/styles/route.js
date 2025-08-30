import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Serve compiled Tailwind CSS for live sites
    const tailwindCSS = `
/* Tailwind CSS compiled for live sites */
@import 'tailwindcss/base';
@import 'tailwindcss/components'; 
@import 'tailwindcss/utilities';

:root {
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

/* Essential Tailwind utilities */
.container { max-width: 100%; margin: 0 auto; padding: 0 1rem; }
.grid { display: grid; }
.flex { display: flex; }
.hidden { display: none; }
.block { display: block; }
.inline-block { display: inline-block; }
.relative { position: relative; }
.absolute { position: absolute; }
.sticky { position: sticky; }
.top-0 { top: 0; }
.z-10 { z-index: 10; }
.w-full { width: 100%; }
.w-6 { width: 1.5rem; }
.h-6 { height: 1.5rem; }
.max-w-7xl { max-width: 80rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.py-8 { padding-top: 2rem; padding-bottom: 2rem; }
.py-12 { padding-top: 3rem; padding-bottom: 3rem; }
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
.p-8 { padding: 2rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mt-8 { margin-top: 2rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
.text-5xl { font-size: 3rem; line-height: 1; }
.font-bold { font-weight: 700; }
.font-medium { font-weight: 500; }
.text-center { text-align: center; }
.text-left { text-align: left; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }
.space-x-6 > :not([hidden]) ~ :not([hidden]) { margin-left: 1.5rem; }
.space-x-4 > :not([hidden]) ~ :not([hidden]) { margin-left: 1rem; }
.space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }
.space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.5rem; }
.rounded { border-radius: 0.25rem; }
.rounded-lg { border-radius: 0.5rem; }
.rounded-md { border-radius: 0.375rem; }
.rounded-l-md { border-top-left-radius: 0.375rem; border-bottom-left-radius: 0.375rem; }
.rounded-r-md { border-top-right-radius: 0.375rem; border-bottom-right-radius: 0.375rem; }
.border { border-width: 1px; }
.border-2 { border-width: 2px; }
.border-gray-300 { border-color: rgb(209 213 219); }
.border-gray-600 { border-color: rgb(75 85 99); }
.border-gray-200 { border-color: rgb(229 231 235); }
.bg-white { background-color: rgb(255 255 255); }
.bg-gray-800 { background-color: rgb(31 41 55); }
.bg-gray-50 { background-color: rgb(249 250 251); }
.bg-black { background-color: rgb(0 0 0); }
.bg-opacity-40 { background-color: rgb(0 0 0 / 0.4); }
.shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
.shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05); }
.transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.hover\\:opacity-80:hover { opacity: 0.8; }
.hover\\:bg-gray-50:hover { background-color: rgb(249 250 251); }
.hover\\:text-\\[rgb\\(var\\(--primary\\)\\)\\]:hover { color: rgb(var(--primary)); }
.focus\\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
.focus\\:ring-\\[rgb\\(var\\(--primary\\)\\)\\]:focus { --tw-ring-color: rgb(var(--primary)); box-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color); }
.focus\\:border-\\[rgb\\(var\\(--primary\\)\\)\\]:focus { border-color: rgb(var(--primary)); }
.dark\\:text-gray-400:is(.dark *) { color: rgb(156 163 175); }
.dark\\:text-gray-300:is(.dark *) { color: rgb(209 213 219); }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
.inset-0 { inset: 0px; }
.overflow-hidden { overflow: hidden; }
.min-h-\\[300px\\] { min-height: 300px; }

/* Grid utilities */
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.gap-8 { gap: 2rem; }
.gap-20px { gap: 20px; }

/* Custom color utilities */
.text-\\[rgb\\(var\\(--primary\\)\\)\\] { color: rgb(var(--primary)); }
.bg-\\[rgb\\(var\\(--primary\\)\\)\\] { background-color: rgb(var(--primary)); }
.text-gray-900 { color: rgb(17 24 39); }
.text-gray-600 { color: rgb(75 85 99); }
.text-gray-700 { color: rgb(55 65 81); }

/* Media queries */
@media (min-width: 768px) {
  .md\\:flex { display: flex; }
  .md\\:hidden { display: none; }
  .md\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
  .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .lg\\:text-5xl { font-size: 3rem; line-height: 1; }
}
`;

    return new NextResponse(tailwindCSS, {
      headers: {
        "Content-Type": "text/css",
        "Cache-Control": "public, max-age=31536000", // Cache for 1 year
      },
    });
  } catch (error) {
    console.error("Error serving styles:", error);
    return new NextResponse("/* Error loading styles */", {
      status: 500,
      headers: {
        "Content-Type": "text/css",
      },
    });
  }
}
