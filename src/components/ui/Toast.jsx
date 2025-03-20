"use client";

import React from "react";

// Toast list component
export default function Toast({ toasts, dismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-0 right-0 p-4 z-50 flex flex-col gap-2 max-w-xs w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-md p-4 shadow-lg transition-opacity duration-300 ${
            toast.variant === "destructive"
              ? "bg-red-500 text-white"
              : toast.variant === "success"
              ? "bg-green-500 text-white"
              : "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-50"
          }`}
        >
          {toast.title && (
            <div className="font-semibold">{toast.title}</div>
          )}
          {toast.description && (
            <div className="text-sm mt-1">{toast.description}</div>
          )}
          <button
            onClick={() => dismiss(toast.id)}
            className="absolute top-1 right-1 p-1 rounded-full opacity-70 hover:opacity-100"
            aria-label="Close toast"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
