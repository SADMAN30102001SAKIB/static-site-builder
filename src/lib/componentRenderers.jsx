// Shared React component renderers for both builder and preview/site
// These are the actual JSX components used in the builder

const componentRenderers = {
  heading: ({ properties }) => {
    const { text, level, textAlign, color } = properties;
    const Tag = level || "h2";

    return (
      <Tag
        style={{
          textAlign: textAlign || "left",
          color: color || "inherit",
        }}>
        {text || "Heading"}
      </Tag>
    );
  },

  paragraph: ({ properties }) => {
    const { text, textAlign, color } = properties;

    return (
      <p
        style={{
          textAlign: textAlign || "left",
          color: color || "inherit",
        }}>
        {text || "Paragraph text"}
      </p>
    );
  },

  image: ({ properties }) => {
    const { src, alt, width } = properties;

    return (
      <img
        src={src || "https://via.placeholder.com/300x200"}
        alt={alt || "Image"}
        style={{
          width: width || "100%",
          maxWidth: "100%",
        }}
      />
    );
  },

  button: ({ properties }) => {
    const { text, url, backgroundColor, textColor, size } = properties;

    const sizeClasses = {
      small: "px-2 py-1 text-sm",
      medium: "px-4 py-2",
      large: "px-6 py-3 text-lg",
    };

    return (
      <button
        style={{
          backgroundColor: backgroundColor || "#3b82f6",
          color: textColor || "white",
        }}
        className={`rounded ${sizeClasses[size || "medium"]} font-medium`}
        onClick={e => e.preventDefault()}>
        {text || "Button"}
      </button>
    );
  },

  container: ({ properties, children }) => {
    const { width, backgroundColor, padding } = properties;

    return (
      <div
        style={{
          width: width || "100%",
          backgroundColor: backgroundColor || "transparent",
          padding: padding || "20px",
        }}>
        {children}
      </div>
    );
  },

  divider: ({ properties }) => {
    const { style, color, width, thickness } = properties;

    const borderStyle = style || "solid";

    return (
      <hr
        style={{
          borderStyle,
          borderColor: color || "#e5e7eb",
          width: width || "100%",
          borderWidth: thickness || "1px",
        }}
      />
    );
  },

  input: ({ properties }) => {
    const { placeholder, label, required } = properties;

    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          type="text"
          placeholder={placeholder || "Enter text..."}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] bg-white text-gray-900"
          readOnly
        />
      </div>
    );
  },

  textarea: ({ properties }) => {
    const { placeholder, label, required, rows } = properties;

    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea
          placeholder={placeholder || "Enter text..."}
          rows={rows || 4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] bg-white text-gray-900"
          readOnly
        />
      </div>
    );
  },

  checkbox: ({ properties }) => {
    const { label } = properties;

    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          className="h-4 w-4 text-[rgb(var(--primary))] border-gray-300 rounded focus:ring-[rgb(var(--primary))]"
          readOnly
        />
        <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          {label || "Checkbox label"}
        </label>
      </div>
    );
  },

  video: ({ properties }) => {
    const { url, width, height, autoplay, controls } = properties;

    return (
      <div className="relative" style={{ width: width || "100%" }}>
        {url && url.trim() !== "" ? (
          <video
            src={url}
            width={width || "100%"}
            height={height || "auto"}
            controls={controls !== false}
            autoPlay={autoplay || false}
            className="w-full rounded">
            Your browser does not support the video tag.
          </video>
        ) : (
          <div
            className="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded"
            style={{
              width: width || "100%",
              height: height || "300px",
            }}>
            <div className="text-center text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-2"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <p className="text-sm">Video Player</p>
              <p className="text-xs mt-1 opacity-70">No video source</p>
            </div>
          </div>
        )}
      </div>
    );
  },

  icon: ({ properties }) => {
    const { name, size, color } = properties;

    // Placeholder for icon, would need a proper icon library integration
    return (
      <div
        className="flex items-center justify-center"
        style={{
          fontSize: size || "24px",
          color: color || "currentColor",
          width: size || "24px",
          height: size || "24px",
        }}>
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>
    );
  },

  columns: ({ properties, children }) => {
    const { columns, gap } = properties;
    const colCount = columns || 2;

    return (
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${colCount}, 1fr)`,
          gap: gap || "20px",
        }}>
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
      />
    );
  },

  select: ({ properties }) => {
    const { label, options, required } = properties;
    const selectOptions = options || ["Option 1", "Option 2", "Option 3"];

    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] bg-white text-gray-900">
          {selectOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  },

  contactForm: ({ properties }) => {
    const { title, submitButtonText, showNameField, showSubjectField } =
      properties;

    return (
      <div className="p-6 bg-gray-800 rounded-lg shadow-sm border border-gray-700">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900"
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

  hero: ({ properties, children }) => {
    const { title, subtitle, backgroundImage, textColor, alignment, height } =
      properties;

    return (
      <div
        className="relative flex items-center overflow-hidden rounded-lg"
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
      <div className="py-12 rounded-lg">
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
      <div className="py-12 rounded-lg">
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
              className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
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
      <div className="py-12 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-8">Pricing Plans</h2>
        <div
          className={`grid grid-cols-1 md:grid-cols-${Math.min(
            count,
            3,
          )} gap-8 px-4`}>
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className={`bg-gray-800 rounded-lg shadow-md overflow-hidden border ${
                i === 1
                  ? "border-2 border-[rgb(var(--primary))]"
                  : "border border-gray-700"
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
      <div className="py-8">
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
          ${transparent ? "bg-transparent" : "bg-gray-800 shadow-sm"} 
          ${sticky ? "sticky top-0 z-10" : ""}
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
      <footer className="bg-gray-800 border-2 border-gray-600 rounded-lg shadow-sm">
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
                    className="px-3 py-2 rounded-l-md w-full border border-gray-300 bg-white text-gray-900"
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

  socialLinks: ({ properties }) => {
    const { platforms, layout, iconSize } = properties;
    const social = platforms || [
      "facebook",
      "twitter",
      "instagram",
      "linkedin",
    ];

    return (
      <div
        className={`flex ${
          layout === "vertical" ? "flex-col space-y-3" : "space-x-3"
        }`}>
        {social.map((platform, i) => (
          <a
            key={i}
            href="#"
            className="text-gray-600 dark:text-gray-400 hover:text-[rgb(var(--primary))]"
            style={{ fontSize: iconSize || "24px" }}>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
            </svg>
          </a>
        ))}
      </div>
    );
  },

  callToAction: ({ properties }) => {
    const { title, subtitle, buttonText, align, backgroundColor } = properties;

    return (
      <div
        className="p-8 rounded-lg shadow-lg"
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
        <button className="bg-white text-[rgb(var(--primary))] px-6 py-2 rounded-md font-medium border border-gray-200 hover:bg-gray-50">
          {buttonText || "Get Started"}
        </button>
      </div>
    );
  },

  logo: ({ properties }) => {
    const { src, alt, width, height, linkUrl } = properties;

    const logoElement = (
      <img
        src={src || "https://via.placeholder.com/200x80?text=Logo"}
        alt={alt || "Logo"}
        style={{
          width: width || "auto",
          height: height || "60px",
          maxWidth: "100%",
          objectFit: "contain",
        }}
      />
    );

    // If linkUrl is provided, wrap in anchor tag
    if (linkUrl) {
      return (
        <a href={linkUrl} className="inline-block">
          {logoElement}
        </a>
      );
    }

    return logoElement;
  },
};

// Default renderer for unknown component types
export const defaultRenderer = ({ type }) => (
  <div className="p-4 border border-red-300 rounded bg-red-50 text-red-800">
    Unknown component type: {type}
  </div>
);

export default componentRenderers;
