"use client";

import React from 'react';
import Link from 'next/link';

const variants = {
  primary: "bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-light))] text-white",
  secondary: "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  success: "bg-green-600 hover:bg-green-700 text-white",
  outline: "bg-transparent border border-[rgb(var(--primary))] text-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-light))] hover:text-white",
  ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
  "danger-ghost": "bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400",
};

const sizes = {
  sm: "px-2.5 py-1 text-xs rounded",
  md: "px-4 py-2 text-sm rounded-md",
  lg: "px-5 py-2.5 text-base rounded-lg",
  xl: "px-6 py-3 text-lg rounded-lg",
};

export default function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  href,
  disabled = false,
  isLoading = false,
  type = "button",
  onClick,
  fullWidth = false,
  ...props
}) {
  const baseClasses = "font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-[rgb(var(--primary))] inline-flex items-center justify-center";
  const widthClass = fullWidth ? "w-full" : "";
  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;
  const disabledClass = disabled || isLoading ? "opacity-60 cursor-not-allowed" : "";
  
  const combinedClasses = `${baseClasses} ${widthClass} ${variantClass} ${sizeClass} ${disabledClass} ${className}`;
  
  if (href && !disabled) {
    return (
      <Link href={href} className={combinedClasses} {...props}>
        {isLoading ? (
          <>
            <span className="mr-2 inline-block h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
            Loading...
          </>
        ) : (
          children
        )}
      </Link>
    );
  }
  
  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="mr-2 inline-block h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}
