"use client";

import React, { forwardRef } from 'react';

const Input = forwardRef(function Input({
  label,
  helperText,
  error,
  className = "",
  type = "text",
  id,
  required = false,
  placeholder,
  ...props
}, ref) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        id={inputId}
        className={`
          w-full px-3 py-2 
          border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} 
          rounded-md shadow-sm 
          focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] 
          dark:bg-gray-700 dark:text-white
          disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
          ${className}
        `}
        placeholder={placeholder}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={helperText ? `${inputId}-description` : undefined}
        required={required}
        {...props}
      />
      {(helperText || error) && (
        <p 
          id={`${inputId}-description`}
          className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
