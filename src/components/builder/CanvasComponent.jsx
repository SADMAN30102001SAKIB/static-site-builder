"use client";

import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import componentRenderers, {
  defaultRenderer,
} from "../../lib/componentRenderers";

// For the builder, we need to modify the renderers to remove the dashed borders
// that are only used for the builder interface
const builderComponentRenderers = {
  ...componentRenderers,
  // These components need special builder styling with dashed borders
  container: ({ properties, children }) => {
    const { width, backgroundColor, padding } = properties;

    return (
      <div
        style={{
          width: width || "100%",
          backgroundColor: backgroundColor || "transparent",
          padding: padding || "20px",
        }}
        className="border border-dashed border-gray-300 dark:border-gray-600">
        {children}
      </div>
    );
  },

  spacer: ({ properties }) => {
    const { height } = properties;

    return (
      <div
        style={{
          height: height || "40px",
          width: "100%",
        }}
        className="border border-dashed border-gray-300 dark:border-gray-600"
      />
    );
  },

  columns: ({ properties, children }) => {
    const { columns, gap } = properties;
    const colCount = columns || 2;

    return (
      <div
        className="grid border border-dashed border-gray-300 dark:border-gray-600"
        style={{
          gridTemplateColumns: `repeat(${colCount}, 1fr)`,
          gap: gap || "20px",
        }}>
        {children}
      </div>
    );
  },

  hero: ({ properties, children }) => {
    const { title, subtitle, backgroundImage, textColor, alignment, height } =
      properties;

    return (
      <div
        className="relative flex items-center border border-dashed border-gray-300 dark:border-gray-600 overflow-hidden rounded-lg"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: textColor || "inherit",
          textAlign: alignment || "center",
          minHeight: height || "400px",
        }}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div
          className={`relative z-10 p-8 w-full ${
            alignment === "left"
              ? "text-left"
              : alignment === "right"
              ? "text-right"
              : "text-center"
          }`}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {title || "Hero Title"}
          </h1>
          <p className="text-xl mb-6">{subtitle || "Add a subtitle here"}</p>
          {children}
        </div>
      </div>
    );
  },

  features: ({ properties }) => {
    const { title, featureCount, showIcons } = properties;
    const count = featureCount || 3;

    return (
      <div className="py-12 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        {title && (
          <h2 className="text-2xl font-bold text-center mb-8">
            {title || "Our Features"}
          </h2>
        )}
        <div
          className={`grid grid-cols-1 md:grid-cols-${Math.min(
            count,
            3,
          )} gap-8 px-4`}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="text-center p-4">
              {showIcons !== false && (
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-[rgb(var(--primary))] text-white mb-4 mx-auto">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
              <h3 className="text-lg font-medium mb-2">Feature {i + 1}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Description of feature {i + 1}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  },

  testimonials: ({ properties }) => {
    const { testimonialCount } = properties;
    const count = testimonialCount || 3;

    return (
      <div className="py-12 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-8">
          What Our Clients Say
        </h2>
        <div
          className={`grid grid-cols-1 md:grid-cols-${Math.min(
            count,
            3,
          )} gap-8 px-4`}>
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3"></div>
                <div>
                  <h3 className="font-medium">Client Name</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Company
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua."
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  },

  pricing: ({ properties }) => {
    const { planCount, currency, period } = properties;
    const count = planCount || 3;
    const currencySymbol = currency || "$";
    const billingPeriod = period || "month";

    const prices = ["9", "29", "99"];
    const planNames = ["Basic", "Standard", "Premium"];

    return (
      <div className="py-12 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-8">Pricing Plans</h2>
        <div
          className={`grid grid-cols-1 md:grid-cols-${Math.min(
            count,
            3,
          )} gap-8 px-4`}>
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${
                i === 1
                  ? "border-2 border-[rgb(var(--primary))]"
                  : "border border-gray-200 dark:border-gray-700"
              }`}>
              <div
                className={`p-6 ${
                  i === 1
                    ? "bg-[rgb(var(--primary))] text-white"
                    : "bg-gray-50 dark:bg-gray-700"
                }`}>
                <h3 className="text-xl font-bold mb-1">
                  {planNames[i] || `Plan ${i + 1}`}
                </h3>
                <p
                  className={`${
                    i === 1
                      ? "text-white/80"
                      : "text-gray-600 dark:text-gray-400"
                  }`}>
                  For small businesses
                </p>
              </div>
              <div className="p-6">
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold">
                    {currencySymbol}
                    {prices[i] || (i + 1) * 10}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">
                    /{billingPeriod}
                  </span>
                </div>
                <ul className="space-y-3 mb-6">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <li key={j} className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Feature {j + 1}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 rounded-md ${
                    i === 1
                      ? "bg-[rgb(var(--primary))] text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                  }`}>
                  Choose Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },

  gallery: ({ properties }) => {
    const { columns, images } = properties;
    const colCount = columns || 3;
    const imageCount = images?.length || 6;

    return (
      <div className="py-8 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${colCount} gap-4 p-4`}>
          {Array.from({ length: imageCount }).map((_, i) => (
            <div
              key={i}
              className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
              <img
                src={`https://via.placeholder.com/400x300?text=Image+${i + 1}`}
                alt={`Gallery image ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    );
  },

  navbar: ({ properties }) => {
    const { brand, transparent, sticky } = properties;

    return (
      <nav
        className={`
          w-full px-4 py-3 flex items-center justify-between 
          ${transparent ? "bg-transparent" : "bg-white dark:bg-gray-800"} 
          ${sticky ? "sticky top-0 z-10" : ""}
          border border-dashed border-gray-300 dark:border-gray-600
        `}>
        <div className="flex items-center">
          <span className="text-xl font-bold">{brand || "Brand"}</span>
        </div>
        <div className="hidden md:flex space-x-6">
          <a href="#" className="hover:text-[rgb(var(--primary))]">
            Home
          </a>
          <a href="#" className="hover:text-[rgb(var(--primary))]">
            About
          </a>
          <a href="#" className="hover:text-[rgb(var(--primary))]">
            Services
          </a>
          <a href="#" className="hover:text-[rgb(var(--primary))]">
            Contact
          </a>
        </div>
        <div className="md:hidden">
          <button>
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </nav>
    );
  },

  footer: ({ properties }) => {
    const { columns, showSocial, copyright } = properties;
    const colCount = columns || 4;

    return (
      <footer className="bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className={`grid grid-cols-1 md:grid-cols-${colCount} gap-8`}>
            <div>
              <h3 className="text-lg font-bold mb-4">About Us</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Short description of your company or website.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {["Home", "About", "Services", "Blog", "Contact"]
                  .slice(0, 5)
                  .map((item, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-gray-600 dark:text-gray-400 hover:text-[rgb(var(--primary))]">
                        {item}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>123 Street Name, City</li>
                <li>info@example.com</li>
                <li>(123) 456-7890</li>
              </ul>
            </div>
            {colCount >= 4 && (
              <div>
                <h3 className="text-lg font-bold mb-4">Newsletter</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Subscribe to our newsletter.
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="px-3 py-2 rounded-l-md w-full"
                  />
                  <button className="bg-[rgb(var(--primary))] text-white px-4 py-2 rounded-r-md">
                    Subscribe
                  </button>
                </div>
              </div>
            )}
          </div>

          {showSocial !== false && (
            <div className="flex space-x-4 justify-center mt-8">
              {["Facebook", "Twitter", "Instagram", "LinkedIn"].map(
                (platform, i) => (
                  <a
                    key={i}
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-[rgb(var(--primary))]">
                    <span className="sr-only">{platform}</span>
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
                    </svg>
                  </a>
                ),
              )}
            </div>
          )}

          <div className="text-center mt-8 text-gray-600 dark:text-gray-400">
            <p>{copyright || ` 2023 Your Company. All rights reserved.`}</p>
          </div>
        </div>
      </footer>
    );
  },

  contactForm: ({ properties }) => {
    const { title, submitButtonText, showNameField, showSubjectField } =
      properties;

    return (
      <div className="p-6 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        {title && (
          <h3 className="text-lg font-medium mb-4">{title || "Contact Us"}</h3>
        )}
        <form className="space-y-4">
          {showNameField !== false && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                readOnly
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
              readOnly
            />
          </div>
          {showSubjectField !== false && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subject
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                readOnly
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
              readOnly
            />
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-[rgb(var(--primary))] text-white rounded-md">
            {submitButtonText || "Send Message"}
          </button>
        </form>
      </div>
    );
  },

  callToAction: ({ properties }) => {
    const { title, subtitle, buttonText, align, backgroundColor } = properties;

    return (
      <div
        className="p-8 rounded-lg border border-dashed border-gray-300 dark:border-gray-600"
        style={{
          backgroundColor: backgroundColor || "rgb(var(--primary))",
          color: "#fff",
          textAlign: align || "center",
        }}>
        <h2 className="text-2xl font-bold mb-2">
          {title || "Ready to get started?"}
        </h2>
        <p className="mb-6">
          {subtitle || "Join thousands of satisfied customers today!"}
        </p>
        <button className="bg-white text-[rgb(var(--primary))] px-6 py-2 rounded-md font-medium">
          {buttonText || "Get Started"}
        </button>
      </div>
    );
  },
};

export default function CanvasComponent({
  component,
  children,
  isSelected,
  onSelect,
  onAddChild,
  onMove,
}) {
  const ref = useRef(null);

  // Setup drag source
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CANVAS_COMPONENT",
    item: { id: component.id, type: component.type },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Prevent dropping on invalid targets
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ["COMPONENT", "CANVAS_COMPONENT"],
    drop: (item, monitor) => {
      if (item.id === component.id) {
        return; // Prevent self-drop
      }

      if (item.type && !item.id) {
        const childrenCount = (children || []).length;
        onAddChild(item.type, childrenCount);
        return;
      }

      if (item.id) {
        onMove(item.id, 0, component.id);
        return;
      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  // Highlight invalid drop areas
  const dropClass = isOver && !canDrop ? "bg-red-50 dark:bg-red-900/10" : "";

  // Apply drag and drop refs
  drag(drop(ref));

  // Get the appropriate renderer for this component type
  const renderComponent =
    builderComponentRenderers[component.type] || defaultRenderer;

  // Handle clicks
  const handleClick = e => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={`relative mb-4 ${isDragging ? "opacity-50" : "opacity-100"} ${
        isSelected ? "ring-2 ring-[rgb(var(--primary))]" : ""
      } ${
        isOver && canDrop ? "bg-blue-50 dark:bg-blue-900/10" : ""
      } ${dropClass}`}
      style={{ cursor: "move" }}>
      {isSelected && (
        <div className="absolute -top-3 -left-3 bg-[rgb(var(--primary))] text-white text-xs px-1.5 py-0.5 rounded-sm z-10">
          {component.type}
        </div>
      )}

      <div className={`${isSelected ? "pointer-events-none" : ""}`}>
        {renderComponent({
          properties: component.properties || {},
          children,
        })}
      </div>
    </div>
  );
}
