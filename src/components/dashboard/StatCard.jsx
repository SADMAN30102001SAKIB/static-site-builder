"use client";

import React from "react";

export default function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  bgColor = "bg-white dark:bg-gray-800",
}) {
  // Determine trend styling
  const trendStyles = {
    up: {
      wrapper:
        "text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30",
      icon: "text-green-500 dark:text-green-400",
    },
    down: {
      wrapper: "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30",
      icon: "text-red-500 dark:text-red-400",
    },
    neutral: {
      wrapper: "text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-700",
      icon: "text-gray-500 dark:text-gray-400",
    },
  };

  const trendStyle = trend ? trendStyles[trend] : trendStyles.neutral;

  return (
    <div
      className={`rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${bgColor} p-5`}>
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <div className="flex items-baseline mt-1">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {value}
            </p>
            {trend && trendValue && (
              <span
                className={`ml-2 text-xs font-medium ${trendStyle.wrapper} px-2 py-0.5 rounded-full`}>
                {trend === "up" && <span className="inline-block mr-1">↑</span>}
                {trend === "down" && (
                  <span className="inline-block mr-1">↓</span>
                )}
                {trendValue}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        {icon && (
          <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-2 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
