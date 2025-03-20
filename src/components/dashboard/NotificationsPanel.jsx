"use client";

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

/**
 * A notifications panel component for displaying user notifications
 * 
 * @param {Object[]} notifications - Array of notification objects
 * @param {string} notifications[].id - Unique identifier for the notification
 * @param {string} notifications[].title - Notification title
 * @param {string} notifications[].message - Notification message content
 * @param {string} notifications[].timestamp - Timestamp of notification creation
 * @param {string} notifications[].type - Notification type (info, success, warning, error)
 * @param {boolean} notifications[].read - Whether the notification has been read
 * @param {function} onMarkRead - Callback for marking notifications as read
 * @param {function} onMarkAllRead - Callback for marking all notifications as read
 * @param {function} onDismiss - Callback for dismissing a notification
 */
export default function NotificationsPanel({
  notifications = [],
  onMarkRead,
  onMarkAllRead,
  onDismiss,
  title = "Notifications",
  maxItems = 5
}) {
  const [expandedIds, setExpandedIds] = useState([]);
  
  // Toggle expanded state for a notification
  const toggleExpand = (id) => {
    setExpandedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };
  
  // Handle marking a notification as read
  const handleMarkRead = (id, e) => {
    e.stopPropagation();
    if (onMarkRead) onMarkRead(id);
  };
  
  // Handle dismissing a notification
  const handleDismiss = (id, e) => {
    e.stopPropagation();
    if (onDismiss) onDismiss(id);
  };
  
  // Type-based styling
  const typeStyles = {
    info: {
      icon: (
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: "bg-blue-50 dark:bg-blue-900/30",
      border: "border-blue-200 dark:border-blue-800"
    },
    success: {
      icon: (
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: "bg-green-50 dark:bg-green-900/30",
      border: "border-green-200 dark:border-green-800"
    },
    warning: {
      icon: (
        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      bg: "bg-yellow-50 dark:bg-yellow-900/30",
      border: "border-yellow-200 dark:border-yellow-800"
    },
    error: {
      icon: (
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: "bg-red-50 dark:bg-red-900/30",
      border: "border-red-200 dark:border-red-800"
    }
  };
  
  // Format relative time
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffInMinutes = Math.round((now - notifTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.round(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.round(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return notifTime.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card 
      title={title}
      description={unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'No new notifications'}
      headerAction={
        unreadCount > 0 && onMarkAllRead ? (
          <Button 
            variant="ghost"
            size="sm"
            onClick={onMarkAllRead}
          >
            Mark all read
          </Button>
        ) : null
      }
    >
      {notifications.length === 0 ? (
        <div className="py-6 text-center text-gray-500 dark:text-gray-400">
          <p>No notifications to display</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.slice(0, maxItems).map((notification) => {
            const isExpanded = expandedIds.includes(notification.id);
            const styles = typeStyles[notification.type] || typeStyles.info;
            
            return (
              <div 
                key={notification.id}
                className={`rounded-lg border ${styles.border} ${styles.bg} overflow-hidden transition-all cursor-pointer ${!notification.read ? 'ring-2 ring-blue-400 dark:ring-blue-500 ring-opacity-50' : ''}`}
                onClick={() => toggleExpand(notification.id)}
              >
                <div className="p-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      {styles.icon}
                    </div>
                    
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="ml-2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {getRelativeTime(notification.timestamp)}
                        </p>
                      </div>
                      
                      <div className={`mt-1 text-sm text-gray-600 dark:text-gray-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
                        {notification.message}
                      </div>
                      
                      <div className="mt-2 flex justify-end space-x-2">
                        {!notification.read && onMarkRead && (
                          <button 
                            onClick={(e) => handleMarkRead(notification.id, e)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Mark as read
                          </button>
                        )}
                        
                        {onDismiss && (
                          <button 
                            onClick={(e) => handleDismiss(notification.id, e)}
                            className="text-xs text-gray-600 dark:text-gray-400 hover:underline"
                          >
                            Dismiss
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {notifications.length > maxItems && (
            <div className="text-center pt-2">
              <Button
                variant="ghost"
                size="sm"
              >
                View all notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
