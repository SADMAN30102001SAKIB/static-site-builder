"use client";

import React from 'react';
import Card from '@/components/ui/Card';

/**
 * Activity log component for displaying recent user actions
 * 
 * @param {Object[]} activities - Array of activity objects
 * @param {string} activities[].id - Unique identifier for the activity
 * @param {string} activities[].action - Description of the action
 * @param {string} activities[].timestamp - Timestamp of when the action occurred
 * @param {string} activities[].icon - Optional icon component or element
 * @param {string} activities[].status - Optional status (success, warning, error, info)
 * @param {number} maxItems - Maximum number of items to display
 * @param {string} title - Optional custom title for the card
 * @param {boolean} showHeader - Whether to show the card header
 */
export default function ActivityLog({
  activities = [],
  maxItems = 5,
  title = "Recent Activity",
  showHeader = true
}) {
  // Status styles mapping
  const statusStyles = {
    success: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
    warning: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400", 
    error: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400",
    info: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
  };

  // Format relative time
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.round((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.round(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.round(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return activityTime.toLocaleDateString();
  };

  return (
    <Card title={showHeader ? title : undefined}>
      {activities.length === 0 ? (
        <div className="py-6 text-center text-gray-500 dark:text-gray-400">
          <p>No recent activity to display</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.slice(0, maxItems).map((activity) => (
            <div key={activity.id} className="flex items-start">
              {/* Activity icon or status indicator */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                activity.status ? statusStyles[activity.status] : "bg-gray-100 dark:bg-gray-700"
              }`}>
                {activity.icon || (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              
              {/* Activity details */}
              <div className="ml-3 flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.action}
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {getRelativeTime(activity.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {activities.length > maxItems && (
            <div className="text-center pt-2">
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                View all activities
              </button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
