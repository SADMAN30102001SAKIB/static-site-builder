"use client";

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import BuilderProperties from './BuilderProperties';
import StyleEditor from './StyleEditor';
import MediaLibrary from '@/components/media/MediaLibrary';
import TemplateLibrary from '@/components/templates/TemplateLibrary';
import SeoPanel from '@/components/seo/SeoPanel';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function PropertyPanel({
  selectedComponent,
  onPropertyChange,
  onDeleteComponent,
  pageData,
  onPageDataChange,
  onApplyTemplate
}) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaSearch, setMediaSearch] = useState('');
  const [mediaFilter, setMediaFilter] = useState('all');

  // Tab categories
  const categories = [
    { key: 'properties', label: 'Properties' },
    { key: 'styles', label: 'Styles' },
    { key: 'media', label: 'Media' },
    { key: 'templates', label: 'Templates' },
    { key: 'seo', label: 'SEO' }
  ];

  // Media handlers
  const handleMediaSelect = (media) => {
    if (!selectedComponent) return;

    if (selectedComponent.type === 'image') {
      onPropertyChange(selectedComponent.id, {
        properties: {
          ...selectedComponent.properties,
          src: media.url,
          alt: media.alt || media.filename || 'Image'
        }
      });
    } else if (selectedComponent.type === 'video') {
      onPropertyChange(selectedComponent.id, {
        properties: {
          ...selectedComponent.properties,
          src: media.url
        }
      });
    } else if (selectedComponent.type === 'hero' && media.type === 'image') {
      onPropertyChange(selectedComponent.id, {
        properties: {
          ...selectedComponent.properties,
          backgroundImage: media.url
        }
      });
    }
  };

  const handleMediaUpload = async (files) => {
    setUploadingMedia(true);
    try {
      // In a real app, this would upload to a server
      // Mock implementation for now
      const uploadedMedia = Array.from(files).map((file, index) => ({
        id: `media-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        filename: file.name,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 'document',
        size: file.size,
        createdAt: new Date().toISOString()
      }));

      // In a real app, we would save this to the server and database
      console.log('Uploaded media:', uploadedMedia);
      
      // If a component is selected, update it with the first media item
      if (selectedComponent && uploadedMedia.length > 0) {
        handleMediaSelect(uploadedMedia[0]);
      }
    } catch (error) {
      console.error('Error uploading media:', error);
    } finally {
      setUploadingMedia(false);
    }
  };

  // Template handlers
  const handleTemplateSelect = (template) => {
    onApplyTemplate(template);
  };

  // Page Settings handler
  const handlePageSettingsChange = (field, value) => {
    const newPageData = { 
      ...pageData,
      [field]: value
    };
    onPageDataChange(newPageData);
  };

  // SEO handler
  const handleSeoChange = (seoData) => {
    const newPageData = {
      ...pageData,
      seo: seoData
    };
    onPageDataChange(newPageData);
  };

  // Component property change
  const handleComponentPropertyChange = (properties) => {
    if (!selectedComponent) return;
    onPropertyChange(selectedComponent.id, { properties });
  };

  // Component style change
  const handleComponentStyleChange = (styles) => {
    if (!selectedComponent) return;
    
    // Merge new styles with existing properties
    const updatedProperties = {
      ...selectedComponent.properties,
      ...styles
    };
    
    onPropertyChange(selectedComponent.id, { properties: updatedProperties });
  };

  if (!selectedComponent && selectedTab < 2) {
    setSelectedTab(2); // Default to Media tab when no component is selected
  }

  return (
    <div className="w-80 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex p-1 space-x-1 bg-white dark:bg-gray-800">
            {categories.map((category) => (
              <Tab
                key={category.key}
                disabled={!selectedComponent && (category.key === 'properties' || category.key === 'styles')}
                className={({ selected }) =>
                  classNames(
                    'flex-1 py-2.5 text-sm font-medium text-center ring-opacity-60 focus:outline-none',
                    selected
                      ? 'text-[rgb(var(--primary))] border-b-2 border-[rgb(var(--primary))]'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  )
                }
              >
                {category.label}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-1">
            {/* Properties Panel */}
            <Tab.Panel className="p-3 bg-white dark:bg-gray-800 overflow-y-auto max-h-[calc(100vh-8rem)]">
              {selectedComponent && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {selectedComponent.type.charAt(0).toUpperCase() + selectedComponent.type.slice(1)} Properties
                    </h3>
                    
                    <button
                      onClick={() => onDeleteComponent(selectedComponent.id)}
                      className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full"
                      aria-label="Delete component"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <BuilderProperties
                    component={selectedComponent}
                    onUpdateComponent={(id, updates) => {
                      onPropertyChange(id, updates);
                    }}
                    onDeleteComponent={onDeleteComponent}
                  />
                </div>
              )}
            </Tab.Panel>

            {/* Style Editor Panel */}
            <Tab.Panel className="p-3 bg-white dark:bg-gray-800 overflow-y-auto max-h-[calc(100vh-8rem)]">
              {selectedComponent && (
                <StyleEditor
                  component={selectedComponent}
                  onStyleChange={handleComponentStyleChange}
                />
              )}
            </Tab.Panel>

            {/* Media Library Panel */}
            <Tab.Panel className="bg-white dark:bg-gray-800 overflow-y-auto max-h-[calc(100vh-8rem)]">
              <MediaLibrary
                onSelect={handleMediaSelect}
                onUpload={handleMediaUpload}
                isUploading={uploadingMedia}
                searchTerm={mediaSearch}
                onSearchChange={setMediaSearch}
                filter={mediaFilter}
                onFilterChange={setMediaFilter}
                selectedComponent={selectedComponent}
              />
            </Tab.Panel>

            {/* Templates Panel */}
            <Tab.Panel className="bg-white dark:bg-gray-800 overflow-y-auto max-h-[calc(100vh-8rem)]">
              <TemplateLibrary
                onSelect={handleTemplateSelect}
              />
            </Tab.Panel>

            {/* SEO Panel */}
            <Tab.Panel className="p-3 bg-white dark:bg-gray-800 overflow-y-auto max-h-[calc(100vh-8rem)]">
              <SeoPanel
                seoData={pageData.seo}
                onChange={handleSeoChange}
                pageTitle={pageData.title}
                pageSlug={pageData.slug}
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Page settings (always visible at bottom) */}
      <div className="flex-shrink-0 p-3 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Page Title
            </label>
            <input
              type="text"
              value={pageData.title || ''}
              onChange={(e) => handlePageSettingsChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Slug
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 dark:text-gray-400 text-sm mr-1">/</span>
              <input
                type="text"
                value={pageData.slug || ''}
                onChange={(e) => handlePageSettingsChange('slug', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={pageData.status || 'draft'}
              onChange={(e) => handlePageSettingsChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
