"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BuilderSidebar from '@/components/builder/BuilderSidebar';
import BuilderCanvas from '@/components/builder/BuilderCanvas';
import PropertyPanel from '@/components/builder/PropertyPanel';
import ComponentLibrary from '@/components/builder/ComponentLibrary';
import { use } from 'react';

export default function BuilderPage({ params }) {
  const router = useRouter();
  const paramValues = use(params);
  const websiteId = paramValues.id; // Properly unwrap params
  const [website, setWebsite] = useState(null);
  const [page, setPage] = useState(null);
  const [components, setComponents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [savedStatus, setSavedStatus] = useState('saved'); // 'saved', 'saving', 'error'
  const [pageData, setPageData] = useState({
    title: '',
    slug: '',
    status: 'draft',
    seo: {
      title: '',
      description: '',
      keywords: '',
      canonical: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      twitterCard: 'summary',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: ''
    },
    featuredImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: 'Admin'
  });

  // Fetch website and its homepage
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError('');
        
        // First fetch the website
        const websiteResponse = await fetch(`/api/websites/${websiteId}`);
        
        if (!websiteResponse.ok) {
          throw new Error('Failed to fetch website data');
        }
        
        const websiteData = await websiteResponse.json();
        setWebsite(websiteData.website);
        
        // Find the homepage from the pages array
        const homePage = websiteData.pages.find(page => page.isHomePage) || 
                         (websiteData.pages.length > 0 ? websiteData.pages[0] : null);
        
        if (!homePage) {
          throw new Error('No pages found for this website');
        }
        
        // Then fetch the complete page data with components
        const pageResponse = await fetch(`/api/pages/${homePage.id}`);
        
        if (!pageResponse.ok) {
          throw new Error('Failed to fetch page data');
        }
        
        const pageData = await pageResponse.json();
        setPage(pageData.page);
        setComponents(pageData.page.components || []);
        
        // Initialize page data with fetched values
        setPageData({
          title: pageData.page.title || '',
          slug: pageData.page.path || '',
          status: pageData.page.status || 'draft',
          seo: pageData.page.seo || {
            title: pageData.page.title || '',
            description: pageData.page.description || '',
            keywords: '',
            canonical: '',
            ogTitle: '',
            ogDescription: '',
            ogImage: '',
            twitterCard: 'summary',
            twitterTitle: '',
            twitterDescription: '',
            twitterImage: ''
          },
          featuredImage: pageData.page.featuredImage || null,
          createdAt: pageData.page.createdAt || new Date().toISOString(),
          updatedAt: pageData.page.updatedAt || new Date().toISOString(),
          author: pageData.page.author || 'Admin'
        });
      } catch (err) {
        console.error('Error fetching page data:', err);
        setError('Failed to load page data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [websiteId]);
  
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
  
  // Update page data
  const handlePageDataChange = async (newPageData) => {
    try {
      setSavedStatus('saving');
      setPageData(newPageData);
      
      const response = await fetch(`/api/pages/${page.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPageData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update page data');
      }
      
      setSavedStatus('saved');
    } catch (error) {
      console.error('Error updating page data:', error);
      setSavedStatus('error');
    }
  };
  
  // Apply template to the page
  const handleApplyTemplate = (template) => {
    try {
      setSavedStatus('saving');
      
      // In a real application, this would fetch the template components
      // For now, we'll just replace with mock components
      const templateComponents = [
        {
          id: `template-header-${Date.now()}`,
          type: 'navigation',
          pageId: page.id,
          position: 0,
          parentId: null,
          properties: {
            backgroundColor: '#ffffff',
            textColor: '#000000',
            logoUrl: template.logo || '',
          },
        },
        {
          id: `template-hero-${Date.now()}`,
          type: 'hero',
          pageId: page.id,
          position: 1,
          parentId: null,
          properties: {
            heading: 'Welcome to Your New Website',
            subheading: 'Built with our powerful website builder',
            backgroundColor: '#f3f4f6',
            textColor: '#111827',
            alignment: 'center',
            backgroundImage: '',
          },
        },
        {
          id: `template-content-${Date.now()}`,
          type: 'container',
          pageId: page.id,
          position: 2,
          parentId: null,
          properties: {
            width: '100%',
            backgroundColor: '#ffffff',
            padding: '40px',
          },
        },
        {
          id: `template-footer-${Date.now()}`,
          type: 'footer',
          pageId: page.id,
          position: 3,
          parentId: null,
          properties: {
            text: ' 2025 Your Company. All rights reserved.',
            backgroundColor: '#111827',
            textColor: '#ffffff',
          },
        },
      ];
      
      setComponents(templateComponents);
      setSavedStatus('saved');
    } catch (error) {
      console.error('Error applying template:', error);
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
      case 'video':
        return {
          src: '',
          controls: true,
          autoplay: false,
          loop: false,
          muted: false,
          width: '100%',
        };
      case 'navigation':
        return {
          links: [
            { text: 'Home', url: '#' },
            { text: 'About', url: '#' },
            { text: 'Services', url: '#' },
            { text: 'Contact', url: '#' },
          ],
          backgroundColor: '#ffffff',
          textColor: '#000000',
          logoUrl: '',
        };
      case 'footer':
        return {
          text: ' 2025 Your Company. All rights reserved.',
          backgroundColor: '#111827',
          textColor: '#ffffff',
          links: [
            { text: 'Privacy Policy', url: '#' },
            { text: 'Terms of Service', url: '#' },
          ],
        };
      case 'hero':
        return {
          heading: 'Welcome to Your Website',
          subheading: 'A beautiful and functional website built with our website builder',
          buttonText: 'Learn More',
          buttonUrl: '#',
          backgroundImage: '',
          backgroundColor: '#f3f4f6',
          textColor: '#111827',
          alignment: 'center',
        };
      case 'contactForm':
        return {
          title: 'Contact Us',
          nameLabel: 'Your Name',
          emailLabel: 'Email Address',
          messageLabel: 'Message',
          buttonText: 'Send Message',
          successMessage: 'Thank you! Your message has been sent.',
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
            onClick={() => router.push('/dashboard')}
            className="bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-light))] text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  // If no page
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
                Editing:
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {page.title}
              </span>
            </div>
            
            <div className="ml-auto flex items-center space-x-3 text-sm">
              <button
                onClick={() => router.push(`/dashboard/websites/${page.websiteId}`)}
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
        
        {/* Right Sidebar - Enhanced Property Panel */}
        <PropertyPanel
          selectedComponent={selectedComponent}
          onPropertyChange={handleUpdateComponent}
          onDeleteComponent={handleDeleteComponent}
          pageData={pageData}
          onPageDataChange={handlePageDataChange}
          onApplyTemplate={handleApplyTemplate}
        />
      </div>
    </DndProvider>
  );
}
