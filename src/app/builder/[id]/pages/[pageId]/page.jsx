"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BuilderSidebar from '@/components/builder/BuilderSidebar';
import BuilderCanvas from '@/components/builder/BuilderCanvas';
import BuilderProperties from '@/components/builder/BuilderProperties';
import ComponentLibrary from '@/components/builder/ComponentLibrary';
import { use } from 'react';

export default function PageBuilderEditor({ params }) {
  const router = useRouter();
  const paramValues = use(params);
  const { id, pageId } = paramValues; // Website ID and Page ID
  const [website, setWebsite] = useState(null);
  const [page, setPage] = useState(null);
  const [components, setComponents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [savedStatus, setSavedStatus] = useState('saved'); // 'saved', 'saving', 'error'

  // Fetch page data
  useEffect(() => {
    async function fetchPageData() {
      try {
        setIsLoading(true);
        setError('');
        
        // Fetch the page with its components
        const response = await fetch(`/api/pages/${pageId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch page data');
        }
        
        const data = await response.json();
        setPage(data.page);
        setWebsite(data.page.website);
        setComponents(data.page.components || []);
      } catch (err) {
        console.error('Error fetching page data:', err);
        setError('Failed to load page data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPageData();
  }, [pageId]);
  
  // Handle selecting a component
  const handleSelectComponent = (componentId) => {
    setSelectedComponentId(componentId);
  };
  
  // Add a new component to the page
  const handleAddComponent = async (componentType, position, parentId = null) => {
    if (!page) return;
    
    try {
      setSavedStatus('saving');
      
      const newComponent = {
        type: componentType,
        pageId: page.id,
        position,
        parentId,
        properties: getDefaultPropertiesForType(componentType),
      };
      
      const response = await fetch(`/api/components`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComponent),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add component');
      }
      
      const data = await response.json();
      
      // Update local state with the new component
      setComponents(prev => [...prev, data.component]);
      
      // Select the newly added component
      setSelectedComponentId(data.component.id);
      
      setSavedStatus('saved');
    } catch (error) {
      console.error('Error adding component:', error);
      setSavedStatus('error');
    }
  };
  
  // Update a component's properties
  const handleUpdateComponent = async (componentId, updates) => {
    try {
      setSavedStatus('saving');
      
      const response = await fetch(`/api/components/${componentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update component');
      }
      
      const data = await response.json();
      
      // Update local state with the updated component
      setComponents(prev => 
        prev.map(component => 
          component.id === componentId ? data.component : component
        )
      );
      
      setSavedStatus('saved');
    } catch (error) {
      console.error('Error updating component:', error);
      setSavedStatus('error');
    }
  };
  
  // Delete a component
  const handleDeleteComponent = async (componentId) => {
    try {
      setSavedStatus('saving');
      
      const response = await fetch(`/api/components/${componentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete component');
      }
      
      // Update local state by removing the deleted component
      setComponents(prev => prev.filter(component => component.id !== componentId));
      
      // If the selected component was deleted, deselect it
      if (selectedComponentId === componentId) {
        setSelectedComponentId(null);
      }
      
      setSavedStatus('saved');
    } catch (error) {
      console.error('Error deleting component:', error);
      setSavedStatus('error');
    }
  };
  
  // Move a component (change position or parent)
  const handleMoveComponent = async (componentId, newPosition, newParentId = null) => {
    try {
      setSavedStatus('saving');
      
      const updates = {
        position: newPosition,
        parentId: newParentId,
      };
      
      const response = await fetch(`/api/components/${componentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to move component');
      }
      
      const data = await response.json();
      
      // Update local state with the moved component
      setComponents(prev => {
        const updated = prev.map(component => {
          if (component.id === componentId) {
            return {
              ...component,
              position: newPosition,
              parentId: newParentId,
            };
          }
          return component;
        });
        
        // Sort by position
        return updated.sort((a, b) => a.position - b.position);
      });
      
      setSavedStatus('saved');
    } catch (error) {
      console.error('Error moving component:', error);
      setSavedStatus('error');
    }
  };
  
  // Get default properties based on component type
  const getDefaultPropertiesForType = (type) => {
    switch (type) {
      case 'heading':
        return {
          text: 'New Heading',
          level: 'h2',
          textAlign: 'left',
          color: '#000000',
        };
      case 'paragraph':
        return {
          text: 'New paragraph text. Click to edit.',
          textAlign: 'left',
          color: '#000000',
        };
      case 'image':
        return {
          src: 'https://via.placeholder.com/300x200',
          alt: 'Image description',
          width: '100%',
        };
      case 'button':
        return {
          text: 'Button',
          url: '#',
          backgroundColor: '#3b82f6',
          textColor: '#ffffff',
          size: 'medium',
        };
      case 'container':
        return {
          width: '100%',
          backgroundColor: 'transparent',
          padding: '20px',
        };
      case 'divider':
        return {
          style: 'solid',
          color: '#e5e7eb',
          width: '100%',
          thickness: '1px',
        };
      case 'input':
        return {
          placeholder: 'Enter text...',
          label: 'Input Field',
          required: false,
        };
      case 'textarea':
        return {
          placeholder: 'Enter text...',
          label: 'Text Area',
          required: false,
          rows: 4,
        };
      case 'checkbox':
        return {
          label: 'Checkbox option',
          required: false,
        };
      default:
        return {};
    }
  };
  
  // Get the selected component
  const selectedComponent = selectedComponentId
    ? components.find(component => component.id === selectedComponentId)
    : null;
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--primary))]"></div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Error</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => router.push(`/dashboard/websites/${id}`)}
            className="bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-light))] text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Return to Website
          </button>
        </div>
      </div>
    );
  }
  
  // If no page found
  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Page not found</p>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Component Library */}
        <BuilderSidebar>
          <ComponentLibrary onAddComponent={handleAddComponent} />
        </BuilderSidebar>
        
        {/* Main Canvas */}
        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900">
          <div className="h-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                Editing Page:
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {page.title}
              </span>
              {page.isHomePage && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 py-0.5 px-1.5 rounded">
                  Home
                </span>
              )}
            </div>
            
            <div className="ml-auto flex items-center space-x-3 text-sm">
              <button
                onClick={() => router.push(`/dashboard/websites/${id}`)}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md"
              >
                Exit Editor
              </button>
              <span className={`
                ${savedStatus === 'saved' ? 'text-green-600 dark:text-green-400' : ''}
                ${savedStatus === 'saving' ? 'text-yellow-600 dark:text-yellow-400' : ''}
                ${savedStatus === 'error' ? 'text-red-600 dark:text-red-400' : ''}
              `}>
                {savedStatus === 'saved' && 'Changes saved'}
                {savedStatus === 'saving' && 'Saving...'}
                {savedStatus === 'error' && 'Error saving'}
              </span>
            </div>
          </div>
          
          <BuilderCanvas
            components={components}
            selectedComponentId={selectedComponentId}
            onSelectComponent={handleSelectComponent}
            onAddComponent={handleAddComponent}
            onMoveComponent={handleMoveComponent}
          />
        </div>
        
        {/* Right Sidebar - Properties */}
        <BuilderProperties
          component={selectedComponent}
          onUpdateComponent={handleUpdateComponent}
          onDeleteComponent={handleDeleteComponent}
        />
      </div>
    </DndProvider>
  );
}
