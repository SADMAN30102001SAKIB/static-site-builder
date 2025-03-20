"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      // Theme preferences
      theme: 'system', // 'light', 'dark', or 'system'
      
      // UI preferences
      sidebarCollapsed: false,
      preferredView: 'grid', // 'grid' or 'list' for websites
      
      // Recent items
      recentlyVisitedWebsites: [],
      recentlyEditedPages: [],
      
      // Dashboard widgets settings
      dashboardWidgets: {
        recentWebsites: true,
        quickActions: true,
        statistics: true,
        notifications: true,
      },
      
      // Actions
      setTheme: (theme) => set({ theme }),
      
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      
      setPreferredView: (view) => set({ preferredView: view }),
      
      addRecentWebsite: (website) => set((state) => {
        // Filter out duplicates and limit to 5 items
        const filtered = state.recentlyVisitedWebsites
          .filter(item => item.id !== website.id)
          .slice(0, 4);
          
        return { 
          recentlyVisitedWebsites: [website, ...filtered] 
        };
      }),
      
      addRecentPage: (page) => set((state) => {
        // Filter out duplicates and limit to 5 items
        const filtered = state.recentlyEditedPages
          .filter(item => item.id !== page.id)
          .slice(0, 4);
          
        return { 
          recentlyEditedPages: [page, ...filtered] 
        };
      }),
      
      toggleDashboardWidget: (widgetName) => set((state) => ({
        dashboardWidgets: {
          ...state.dashboardWidgets,
          [widgetName]: !state.dashboardWidgets[widgetName]
        }
      })),
    }),
    {
      name: 'user-preferences',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        preferredView: state.preferredView,
        dashboardWidgets: state.dashboardWidgets,
      }),
    }
  )
);

export default useUserStore;
