"use client";

import { useState, useEffect, useCallback } from "react";

// Component property editor based on component type
const PropertyEditors = {
  heading: ({ properties, onChange }) => {
    const {
      text,
      level,
      textAlign,
      color,
      fontSize,
      fontWeight,
      marginTop,
      marginBottom,
    } = properties;

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Text
          </label>
          <input
            type="text"
            value={text || ""}
            onChange={e => onChange({ ...properties, text: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Heading Level
          </label>
          <select
            value={level || "h2"}
            onChange={e => onChange({ ...properties, level: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700">
            <option value="h1">Heading 1 (Largest)</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="h5">Heading 5</option>
            <option value="h6">Heading 6 (Smallest)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Text Alignment
          </label>
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            {["left", "center", "right"].map(align => (
              <button
                key={align}
                type="button"
                onClick={() => onChange({ ...properties, textAlign: align })}
                className={`flex-1 py-2 ${
                  textAlign === align
                    ? "bg-[rgb(var(--primary))] text-white"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}>
                {align.charAt(0).toUpperCase() + align.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Text Color
          </label>
          <input
            type="color"
            value={color || "#000000"}
            onChange={e => onChange({ ...properties, color: e.target.value })}
            className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Font Size
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min="12"
              max="72"
              value={parseInt(fontSize?.replace("px", "") || "24")}
              onChange={e =>
                onChange({ ...properties, fontSize: `${e.target.value}px` })
              }
              className="w-full mr-2"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
              {fontSize || "24px"}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Font Weight
          </label>
          <select
            value={fontWeight || "normal"}
            onChange={e =>
              onChange({ ...properties, fontWeight: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700">
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="light">Light</option>
            <option value="semibold">Semi Bold</option>
            <option value="extrabold">Extra Bold</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Margin Top
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["0px", "8px", "16px", "24px", "32px", "48px"].map(margin => (
              <button
                key={margin}
                type="button"
                onClick={() => onChange({ ...properties, marginTop: margin })}
                className={`py-1 px-2 text-sm rounded ${
                  marginTop === margin
                    ? "bg-[rgb(var(--primary))] text-white"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                }`}>
                {margin}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Margin Bottom
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["0px", "8px", "16px", "24px", "32px", "48px"].map(margin => (
              <button
                key={margin}
                type="button"
                onClick={() =>
                  onChange({ ...properties, marginBottom: margin })
                }
                className={`py-1 px-2 text-sm rounded ${
                  marginBottom === margin
                    ? "bg-[rgb(var(--primary))] text-white"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                }`}>
                {margin}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  },

  paragraph: ({ properties, onChange }) => {
    const { text, textAlign, color } = properties;

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Text
          </label>
          <textarea
            value={text || ""}
            onChange={e => onChange({ ...properties, text: e.target.value })}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Text Alignment
          </label>
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            {["left", "center", "right", "justify"].map(align => (
              <button
                key={align}
                type="button"
                onClick={() => onChange({ ...properties, textAlign: align })}
                className={`flex-1 py-2 ${
                  textAlign === align
                    ? "bg-[rgb(var(--primary))] text-white"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}>
                {align.charAt(0).toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Text Color
          </label>
          <input
            type="color"
            value={color || "#000000"}
            onChange={e => onChange({ ...properties, color: e.target.value })}
            className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
          />
        </div>
      </div>
    );
  },

  image: ({ properties, onChange }) => {
    const { src, alt, width, height, borderRadius, shadow, objectFit, link } =
      properties;

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image URL
          </label>
          <input
            type="text"
            value={src || ""}
            onChange={e => onChange({ ...properties, src: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Alt Text
          </label>
          <input
            type="text"
            value={alt || ""}
            onChange={e => onChange({ ...properties, alt: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="Image description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Width
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min="50"
              max="800"
              value={parseInt(width?.replace("px", "") || "300")}
              onChange={e =>
                onChange({ ...properties, width: `${e.target.value}px` })
              }
              className="w-full mr-2"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-20">
              {width || "300px"}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Height
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min="50"
              max="600"
              value={parseInt(height?.replace("px", "") || "200")}
              onChange={e =>
                onChange({ ...properties, height: `${e.target.value}px` })
              }
              className="w-full mr-2"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-20">
              {height || "200px"}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Object Fit
          </label>
          <select
            value={objectFit || "cover"}
            onChange={e =>
              onChange({ ...properties, objectFit: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700">
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
            <option value="fill">Fill</option>
            <option value="none">None</option>
            <option value="scale-down">Scale Down</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Border Radius
          </label>
          <div className="grid grid-cols-4 gap-2">
            {["0px", "4px", "8px", "12px", "16px", "24px", "50%"].map(
              radius => (
                <button
                  key={radius}
                  type="button"
                  onClick={() =>
                    onChange({ ...properties, borderRadius: radius })
                  }
                  className={`py-1 px-2 text-sm rounded ${
                    borderRadius === radius
                      ? "bg-[rgb(var(--primary))] text-white"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                  }`}>
                  {radius === "50%" ? "Circle" : radius}
                </button>
              ),
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Shadow
          </label>
          <select
            value={shadow || "none"}
            onChange={e => onChange({ ...properties, shadow: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700">
            <option value="none">None</option>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
            <option value="xl">Extra Large</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Link URL (optional)
          </label>
          <input
            type="text"
            value={link || ""}
            onChange={e => onChange({ ...properties, link: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="https://example.com (optional)"
          />
        </div>
      </div>
    );
  },

  button: ({ properties, onChange }) => {
    const {
      text,
      url,
      backgroundColor,
      textColor,
      size,
      borderRadius,
      padding,
      target,
      hoverColor,
    } = properties;

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Button Text
          </label>
          <input
            type="text"
            value={text || ""}
            onChange={e => onChange({ ...properties, text: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Link URL
          </label>
          <input
            type="text"
            value={url || "#"}
            onChange={e => onChange({ ...properties, url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Target
          </label>
          <select
            value={target || "_self"}
            onChange={e => onChange({ ...properties, target: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700">
            <option value="_self">Same Window</option>
            <option value="_blank">New Window</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Background Color
          </label>
          <input
            type="color"
            value={backgroundColor || "#3b82f6"}
            onChange={e =>
              onChange({ ...properties, backgroundColor: e.target.value })
            }
            className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Text Color
          </label>
          <input
            type="color"
            value={textColor || "#ffffff"}
            onChange={e =>
              onChange({ ...properties, textColor: e.target.value })
            }
            className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Hover Color
          </label>
          <input
            type="color"
            value={hoverColor || "#2563eb"}
            onChange={e =>
              onChange({ ...properties, hoverColor: e.target.value })
            }
            className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Button Size
          </label>
          <select
            value={size || "medium"}
            onChange={e => onChange({ ...properties, size: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="xl">Extra Large</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Border Radius
          </label>
          <div className="grid grid-cols-4 gap-2">
            {["0px", "4px", "8px", "12px", "16px", "24px", "9999px"].map(
              radius => (
                <button
                  key={radius}
                  type="button"
                  onClick={() =>
                    onChange({ ...properties, borderRadius: radius })
                  }
                  className={`py-1 px-2 text-sm rounded ${
                    borderRadius === radius
                      ? "bg-[rgb(var(--primary))] text-white"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                  }`}>
                  {radius === "9999px" ? "Full" : radius}
                </button>
              ),
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Padding
          </label>
          <div className="grid grid-cols-4 gap-2">
            {["8px", "12px", "16px", "20px", "24px", "32px"].map(pad => (
              <button
                key={pad}
                type="button"
                onClick={() => onChange({ ...properties, padding: pad })}
                className={`py-1 px-2 text-sm rounded ${
                  padding === pad
                    ? "bg-[rgb(var(--primary))] text-white"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                }`}>
                {pad}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  },

  container: ({ properties, onChange }) => {
    const { width, backgroundColor, padding } = properties;

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Width
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min="10"
              max="100"
              value={(width || "100%").replace("%", "")}
              onChange={e =>
                onChange({ ...properties, width: `${e.target.value}%` })
              }
              className="w-full mr-2"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
              {width || "100%"}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Background Color
          </label>
          <input
            type="color"
            value={backgroundColor || "#ffffff"}
            onChange={e =>
              onChange({ ...properties, backgroundColor: e.target.value })
            }
            className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Padding
          </label>
          <div className="grid grid-cols-4 gap-2">
            {["0px", "8px", "16px", "24px", "32px", "48px", "64px", "80px"].map(
              size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onChange({ ...properties, padding: size })}
                  className={`py-1 px-2 text-sm rounded ${
                    padding === size
                      ? "bg-[rgb(var(--primary))] text-white"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                  }`}>
                  {size}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    );
  },

  divider: ({ properties, onChange }) => {
    const { style, color, width, thickness } = properties;

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Line Style
          </label>
          <select
            value={style || "solid"}
            onChange={e => onChange({ ...properties, style: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700">
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Color
          </label>
          <input
            type="color"
            value={color || "#e5e7eb"}
            onChange={e => onChange({ ...properties, color: e.target.value })}
            className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Width
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min="10"
              max="100"
              value={(width || "100%").replace("%", "")}
              onChange={e =>
                onChange({ ...properties, width: `${e.target.value}%` })
              }
              className="w-full mr-2"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
              {width || "100%"}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Thickness
          </label>
          <select
            value={thickness || "1px"}
            onChange={e =>
              onChange({ ...properties, thickness: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700">
            <option value="1px">Thin (1px)</option>
            <option value="2px">Medium (2px)</option>
            <option value="4px">Thick (4px)</option>
            <option value="8px">Extra Thick (8px)</option>
          </select>
        </div>
      </div>
    );
  },

  input: ({ properties, onChange }) => {
    const { placeholder, label, required } = properties;

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Label Text
          </label>
          <input
            type="text"
            value={label || ""}
            onChange={e => onChange({ ...properties, label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="Input Label"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Placeholder
          </label>
          <input
            type="text"
            value={placeholder || ""}
            onChange={e =>
              onChange({ ...properties, placeholder: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="Enter placeholder text"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={required || false}
            onChange={e =>
              onChange({ ...properties, required: e.target.checked })
            }
            className="h-4 w-4 text-[rgb(var(--primary))] border-gray-300 rounded focus:ring-[rgb(var(--primary))]"
          />
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Required field
          </label>
        </div>
      </div>
    );
  },

  textarea: ({ properties, onChange }) => {
    const { placeholder, label, required, rows } = properties;

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Label Text
          </label>
          <input
            type="text"
            value={label || ""}
            onChange={e => onChange({ ...properties, label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="Textarea Label"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Placeholder
          </label>
          <input
            type="text"
            value={placeholder || ""}
            onChange={e =>
              onChange({ ...properties, placeholder: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="Enter placeholder text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Rows
          </label>
          <input
            type="number"
            min="2"
            max="10"
            value={rows || 4}
            onChange={e =>
              onChange({ ...properties, rows: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={required || false}
            onChange={e =>
              onChange({ ...properties, required: e.target.checked })
            }
            className="h-4 w-4 text-[rgb(var(--primary))] border-gray-300 rounded focus:ring-[rgb(var(--primary))]"
          />
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Required field
          </label>
        </div>
      </div>
    );
  },

  spacer: ({ properties, onChange }) => {
    const { height, backgroundColor } = properties;

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Height
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min="10"
              max="200"
              value={parseInt(height?.replace("px", "") || "40")}
              onChange={e =>
                onChange({ ...properties, height: `${e.target.value}px` })
              }
              className="w-full mr-2"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
              {height || "40px"}
            </span>
          </div>
        </div>
      </div>
    );
  },

  columns: ({ properties, onChange }) => {
    const { columns, gap, alignment } = properties;

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Number of Columns
          </label>
          <select
            value={columns || 2}
            onChange={e =>
              onChange({ ...properties, columns: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700">
            <option value={1}>1 Column</option>
            <option value={2}>2 Columns</option>
            <option value={3}>3 Columns</option>
            <option value={4}>4 Columns</option>
            <option value={6}>6 Columns</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Gap Between Columns
          </label>
          <div className="grid grid-cols-4 gap-2">
            {["10px", "20px", "30px", "40px"].map(size => (
              <button
                key={size}
                type="button"
                onClick={() => onChange({ ...properties, gap: size })}
                className={`py-1 px-2 text-sm rounded ${
                  gap === size
                    ? "bg-[rgb(var(--primary))] text-white"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                }`}>
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Alignment
          </label>
          <select
            value={alignment || "stretch"}
            onChange={e =>
              onChange({ ...properties, alignment: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700">
            <option value="stretch">Stretch</option>
            <option value="start">Top</option>
            <option value="center">Center</option>
            <option value="end">Bottom</option>
          </select>
        </div>
      </div>
    );
  },

  hero: ({ properties, onChange }) => {
    const {
      title,
      subtitle,
      backgroundImage,
      textColor,
      alignment,
      height,
      buttonText,
      buttonUrl,
    } = properties;

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title || ""}
            onChange={e => onChange({ ...properties, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="Hero Title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subtitle
          </label>
          <textarea
            value={subtitle || ""}
            onChange={e =>
              onChange({ ...properties, subtitle: e.target.value })
            }
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="Add a subtitle here"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Background Image URL
          </label>
          <input
            type="text"
            value={backgroundImage || ""}
            onChange={e =>
              onChange({ ...properties, backgroundImage: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Text Color
          </label>
          <input
            type="color"
            value={textColor || "#ffffff"}
            onChange={e =>
              onChange({ ...properties, textColor: e.target.value })
            }
            className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Text Alignment
          </label>
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            {["left", "center", "right"].map(align => (
              <button
                key={align}
                type="button"
                onClick={() => onChange({ ...properties, alignment: align })}
                className={`flex-1 py-2 ${
                  alignment === align
                    ? "bg-[rgb(var(--primary))] text-white"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}>
                {align.charAt(0).toUpperCase() + align.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Height
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min="300"
              max="800"
              value={parseInt(height?.replace("px", "") || "400")}
              onChange={e =>
                onChange({ ...properties, height: `${e.target.value}px` })
              }
              className="w-full mr-2"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
              {height || "400px"}
            </span>
          </div>
        </div>
      </div>
    );
  },

  features: ({ properties, onChange }) => {
    const { title, featureCount, showIcons, backgroundColor } = properties;

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Section Title
          </label>
          <input
            type="text"
            value={title || ""}
            onChange={e => onChange({ ...properties, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="Our Features"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Number of Features
          </label>
          <select
            value={featureCount || 3}
            onChange={e =>
              onChange({
                ...properties,
                featureCount: parseInt(e.target.value),
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700">
            <option value={2}>2 Features</option>
            <option value={3}>3 Features</option>
            <option value={4}>4 Features</option>
            <option value={6}>6 Features</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={showIcons !== false}
            onChange={e =>
              onChange({ ...properties, showIcons: e.target.checked })
            }
            className="h-4 w-4 text-[rgb(var(--primary))] border-gray-300 rounded focus:ring-[rgb(var(--primary))]"
          />
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Show Icons
          </label>
        </div>
      </div>
    );
  },

  video: ({ properties, onChange }) => {
    const { url, width, height, autoplay, controls, muted } = properties;

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Video URL
          </label>
          <input
            type="text"
            value={url || ""}
            onChange={e => onChange({ ...properties, url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="https://www.youtube.com/watch?v=... or video file URL"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Width
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min="200"
              max="800"
              value={parseInt(width?.replace("px", "") || "560")}
              onChange={e =>
                onChange({ ...properties, width: `${e.target.value}px` })
              }
              className="w-full mr-2"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
              {width || "560px"}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Height
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min="200"
              max="600"
              value={parseInt(height?.replace("px", "") || "315")}
              onChange={e =>
                onChange({ ...properties, height: `${e.target.value}px` })
              }
              className="w-full mr-2"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
              {height || "315px"}
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={autoplay || false}
            onChange={e =>
              onChange({ ...properties, autoplay: e.target.checked })
            }
            className="h-4 w-4 text-[rgb(var(--primary))] border-gray-300 rounded focus:ring-[rgb(var(--primary))]"
          />
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Autoplay
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={controls !== false}
            onChange={e =>
              onChange({ ...properties, controls: e.target.checked })
            }
            className="h-4 w-4 text-[rgb(var(--primary))] border-gray-300 rounded focus:ring-[rgb(var(--primary))]"
          />
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Show Controls
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={muted || false}
            onChange={e => onChange({ ...properties, muted: e.target.checked })}
            className="h-4 w-4 text-[rgb(var(--primary))] border-gray-300 rounded focus:ring-[rgb(var(--primary))]"
          />
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Muted
          </label>
        </div>
      </div>
    );
  },

  icon: ({ properties, onChange }) => {
    const { iconName, size, color, backgroundColor, borderRadius } = properties;

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Icon Name
          </label>
          <select
            value={iconName || "star"}
            onChange={e =>
              onChange({ ...properties, iconName: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700">
            <option value="star">Star</option>
            <option value="heart">Heart</option>
            <option value="check">Check</option>
            <option value="lightning">Lightning</option>
            <option value="shield">Shield</option>
            <option value="globe">Globe</option>
            <option value="settings">Settings</option>
            <option value="user">User</option>
            <option value="mail">Mail</option>
            <option value="phone">Phone</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Size
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min="16"
              max="128"
              value={parseInt(size?.replace("px", "") || "32")}
              onChange={e =>
                onChange({ ...properties, size: `${e.target.value}px` })
              }
              className="w-full mr-2"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
              {size || "32px"}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Color
          </label>
          <input
            type="color"
            value={color || "#000000"}
            onChange={e => onChange({ ...properties, color: e.target.value })}
            className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Background Color
          </label>
          <input
            type="color"
            value={backgroundColor || "#transparent"}
            onChange={e =>
              onChange({ ...properties, backgroundColor: e.target.value })
            }
            className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Border Radius
          </label>
          <div className="grid grid-cols-4 gap-2">
            {["0px", "4px", "8px", "16px", "50%"].map(radius => (
              <button
                key={radius}
                type="button"
                onClick={() =>
                  onChange({ ...properties, borderRadius: radius })
                }
                className={`py-1 px-2 text-sm rounded ${
                  borderRadius === radius
                    ? "bg-[rgb(var(--primary))] text-white"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                }`}>
                {radius}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  },

  logo: ({ properties, onChange }) => {
    const { src, alt, width, height, link } = properties;

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Logo Image URL
          </label>
          <input
            type="text"
            value={src || ""}
            onChange={e => onChange({ ...properties, src: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="https://example.com/logo.png"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Alt Text
          </label>
          <input
            type="text"
            value={alt || ""}
            onChange={e => onChange({ ...properties, alt: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="Company Logo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Width
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min="50"
              max="400"
              value={parseInt(width?.replace("px", "") || "150")}
              onChange={e =>
                onChange({ ...properties, width: `${e.target.value}px` })
              }
              className="w-full mr-2"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
              {width || "150px"}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Height
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min="30"
              max="200"
              value={parseInt(height?.replace("px", "") || "60")}
              onChange={e =>
                onChange({ ...properties, height: `${e.target.value}px` })
              }
              className="w-full mr-2"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
              {height || "60px"}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Link URL (optional)
          </label>
          <input
            type="text"
            value={link || ""}
            onChange={e => onChange({ ...properties, link: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>
    );
  },

  checkbox: ({ properties, onChange }) => {
    const { label, required } = properties;

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Checkbox Label
          </label>
          <input
            type="text"
            value={label || ""}
            onChange={e => onChange({ ...properties, label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="I agree to the terms"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={required || false}
            onChange={e =>
              onChange({ ...properties, required: e.target.checked })
            }
            className="h-4 w-4 text-[rgb(var(--primary))] border-gray-300 rounded focus:ring-[rgb(var(--primary))]"
          />
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Required field
          </label>
        </div>
      </div>
    );
  },

  navbar: ({ properties, onChange, website }) => {
    const {
      brand,
      transparent,
      sticky,
      backgroundColor,
      textColor,
      brandColor,
      hoverColor,
      items = [],
    } = properties;

    const handleItemUpdate = (index, field, value) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      onChange({ ...properties, items: newItems });
    };

    const addNavItem = (type = "link") => {
      const newItem =
        type === "button"
          ? {
              label: "Button",
              type: "button",
              buttonColor: "#3b82f6",
              buttonTextColor: "#ffffff",
            }
          : { label: "Link", url: "#", type: "link" };
      onChange({ ...properties, items: [...items, newItem] });
    };

    const removeNavItem = index => {
      const newItems = items.filter((_, i) => i !== index);
      onChange({ ...properties, items: newItems });
    };

    return (
      <div className="space-y-4">
        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Brand/Logo Text
          </label>
          <input
            type="text"
            value={brand || ""}
            onChange={e => onChange({ ...properties, brand: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="Your Brand"
          />
        </div>

        {/* Style Options */}
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={transparent || false}
              onChange={e =>
                onChange({ ...properties, transparent: e.target.checked })
              }
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Transparent Background
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={sticky || false}
              onChange={e =>
                onChange({ ...properties, sticky: e.target.checked })
              }
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Sticky Navigation
            </span>
          </label>
        </div>

        {/* Colors */}
        {!transparent && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Background Color
            </label>
            <input
              type="color"
              value={backgroundColor || "#1f2937"}
              onChange={e =>
                onChange({ ...properties, backgroundColor: e.target.value })
              }
              className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Text Color
          </label>
          <input
            type="color"
            value={textColor || (transparent ? "#000000" : "#ffffff")}
            onChange={e =>
              onChange({ ...properties, textColor: e.target.value })
            }
            className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Brand Color
          </label>
          <input
            type="color"
            value={
              brandColor || textColor || (transparent ? "#000000" : "#ffffff")
            }
            onChange={e =>
              onChange({ ...properties, brandColor: e.target.value })
            }
            className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Hover Color
          </label>
          <input
            type="color"
            value={hoverColor || "#3b82f6"}
            onChange={e =>
              onChange({ ...properties, hoverColor: e.target.value })
            }
            className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
          />
        </div>

        {/* Navigation Items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Navigation Items
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => addNavItem("link")}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
                + Link
              </button>
              <button
                type="button"
                onClick={() => addNavItem("button")}
                className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">
                + Button
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map((item, index) => (
              <div
                key={index}
                className="p-3 border border-gray-200 dark:border-gray-600 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.type === "button" ? "Button" : "Link"} {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeNavItem(index)}
                    className="text-red-500 hover:text-red-700">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={item.label || ""}
                    onChange={e =>
                      handleItemUpdate(index, "label", e.target.value)
                    }
                    placeholder="Label"
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                  />

                  {item.type === "link" && (
                    <div>
                      <select
                        value={item.url || ""}
                        onChange={e => {
                          console.log("Dropdown changed:", e.target.value);
                          const newItems = [...items];
                          if (e.target.value === "custom") {
                            newItems[index] = {
                              ...newItems[index],
                              url: "custom",
                              customUrl: newItems[index].customUrl || "",
                            };
                          } else {
                            newItems[index] = {
                              ...newItems[index],
                              url: e.target.value,
                              customUrl: "",
                            };
                          }
                          console.log("Updated item:", newItems[index]);
                          onChange({ ...properties, items: newItems });
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700">
                        <option value="">Select a page...</option>
                        {website?.pages?.map(page => (
                          <option key={page.id} value={page.path}>
                            {page.title} ({page.path})
                          </option>
                        ))}
                        <option value="custom">Custom URL...</option>
                      </select>
                      {item.url === "custom" && (
                        <input
                          type="text"
                          value={item.customUrl || ""}
                          onChange={e => {
                            const newItems = [...items];
                            newItems[index] = {
                              ...newItems[index],
                              customUrl: e.target.value,
                            };
                            onChange({ ...properties, items: newItems });
                          }}
                          placeholder="Enter custom URL (e.g., https://example.com or #section)"
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 mt-2"
                        />
                      )}
                    </div>
                  )}

                  {item.type === "button" && (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="color"
                        value={item.buttonColor || "#3b82f6"}
                        onChange={e =>
                          handleItemUpdate(index, "buttonColor", e.target.value)
                        }
                        className="w-full h-8 p-1 border border-gray-300 dark:border-gray-600 rounded-md"
                        title="Button Color"
                      />
                      <input
                        type="color"
                        value={item.buttonTextColor || "#ffffff"}
                        onChange={e =>
                          handleItemUpdate(
                            index,
                            "buttonTextColor",
                            e.target.value,
                          )
                        }
                        className="w-full h-8 p-1 border border-gray-300 dark:border-gray-600 rounded-md"
                        title="Text Color"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No navigation items. Click "+ Link" or "+ Button" to add items.
            </p>
          )}
        </div>
      </div>
    );
  },
};

export default function BuilderProperties({
  component,
  onUpdateComponent,
  onDeleteComponent,
  website,
}) {
  const [localProperties, setLocalProperties] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Update local properties when selected component changes
  useEffect(() => {
    if (component) {
      setLocalProperties(component.properties || {});
      setHasUnsavedChanges(false);
    } else {
      setLocalProperties({});
      setHasUnsavedChanges(false);
    }
  }, [component]);

  // Save function
  const saveChanges = useCallback(() => {
    if (component && hasUnsavedChanges) {
      try {
        onUpdateComponent(component.id, { properties: localProperties });
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error("Error updating component properties:", error);
        alert("Failed to update component properties. Please try again.");
      }
    }
  }, [component, localProperties, hasUnsavedChanges, onUpdateComponent]);

  // Handle Ctrl+S keyboard shortcut
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        saveChanges();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [saveChanges]);

  // Handle property changes - only update local state
  const handleChange = newProperties => {
    setLocalProperties(newProperties);
    setHasUnsavedChanges(true);
  };

  // Get appropriate property editor for component type
  const getPropertyEditor = () => {
    if (!component) return null;

    const PropertyEditor = PropertyEditors[component.type];
    if (!PropertyEditor) {
      return (
        <div className="p-4 text-gray-600 dark:text-gray-400">
          No properties available for this component type.
        </div>
      );
    }

    return (
      <PropertyEditor
        properties={localProperties}
        onChange={handleChange}
        website={website}
      />
    );
  };

  // If no component is selected
  if (!component) {
    return (
      <div className="w-80 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Properties
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select a component to edit
          </p>
        </div>
        <div className="flex-1 p-4 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Click on a component in the canvas to edit its properties
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Properties
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Edit {component.type} component
            {hasUnsavedChanges && (
              <span className="ml-2 text-orange-500 dark:text-orange-400">
                • Unsaved changes
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && (
            <button
              onClick={saveChanges}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              title="Save changes (Ctrl+S)">
              Save
            </button>
          )}
          <button
            onClick={() => onDeleteComponent(component.id)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
            title="Delete component">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">{getPropertyEditor()}</div>
      {hasUnsavedChanges && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Press{" "}
            <kbd className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded">
              Ctrl+S
            </kbd>{" "}
            to save changes
          </p>
        </div>
      )}
    </div>
  );
}
