"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useBuilderStore = create(
  persist(
    (set, get) => ({
      // Current selected component
      selectedComponentId: null,
      
      // All components in the current page
      components: [],
      
      // Current page being edited
      currentPage: null,
      
      // UI state
      isSidebarOpen: true,
      propertiesPanelWidth: 300,
      
      // Undo/redo history
      history: [],
      historyIndex: -1,
      
      // Actions
      setSelectedComponentId: (id) => set({ selectedComponentId: id }),
      
      setComponents: (components) => set({ components }),
      
      addComponent: (component) => {
        const newComponents = [...get().components, component];
        set({ components: newComponents });
        
        // Add to history
        get().addToHistory(newComponents);
      },
      
      updateComponent: (id, updates) => {
        const newComponents = get().components.map(component => 
          component.id === id ? { ...component, ...updates } : component
        );
        set({ components: newComponents });
        
        // Add to history
        get().addToHistory(newComponents);
      },
      
      deleteComponent: (id) => {
        const newComponents = get().components.filter(component => component.id !== id);
        set({ components: newComponents });
        
        // Add to history
        get().addToHistory(newComponents);
        
        // If deleted component was selected, clear selection
        if (get().selectedComponentId === id) {
          set({ selectedComponentId: null });
        }
      },
      
      moveComponent: (id, newPosition, newParentId = null) => {
        const component = get().components.find(c => c.id === id);
        if (!component) return;
        
        const updatedComponent = {
          ...component,
          position: newPosition,
          parentId: newParentId
        };
        
        const newComponents = get().components.map(c => 
          c.id === id ? updatedComponent : c
        );
        
        set({ components: newComponents });
        
        // Add to history
        get().addToHistory(newComponents);
      },
      
      setCurrentPage: (page) => set({ 
        currentPage: page,
        components: page?.components || []
      }),
      
      // History management
      addToHistory: (components) => {
        const { history, historyIndex } = get();
        
        // Remove all future history if we've gone back in time
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(components);
        
        set({
          history: newHistory,
          historyIndex: newHistory.length - 1
        });
      },
      
      undo: () => {
        const { historyIndex, history } = get();
        if (historyIndex <= 0) return;
        
        const newIndex = historyIndex - 1;
        const prevState = history[newIndex];
        
        set({
          historyIndex: newIndex,
          components: prevState
        });
      },
      
      redo: () => {
        const { historyIndex, history } = get();
        if (historyIndex >= history.length - 1) return;
        
        const newIndex = historyIndex + 1;
        const nextState = history[newIndex];
        
        set({
          historyIndex: newIndex,
          components: nextState
        });
      },
      
      // UI state actions
      toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
      
      setPropertiesPanelWidth: (width) => set({ propertiesPanelWidth: width }),
    }),
    {
      name: 'builder-store', // unique name for localStorage
      partialize: (state) => ({
        // Only persist these fields
        isSidebarOpen: state.isSidebarOpen,
        propertiesPanelWidth: state.propertiesPanelWidth,
      }),
    }
  )
);

export default useBuilderStore;
