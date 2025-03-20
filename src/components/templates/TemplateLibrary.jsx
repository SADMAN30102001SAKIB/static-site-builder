"use client";

import { useState } from 'react';
import Link from 'next/link';

// Template data - would typically come from a database
const templateCategories = [
  {
    id: 'business',
    name: 'Business',
    templates: [
      {
        id: 'business-1',
        name: 'Corporate',
        description: 'Professional template for corporate businesses',
        thumbnail: 'https://via.placeholder.com/300x200?text=Corporate+Template',
        tags: ['professional', 'corporate', 'business'],
        components: [], // Would contain actual component definitions
      },
      {
        id: 'business-2',
        name: 'Startup',
        description: 'Modern and bold template for startups',
        thumbnail: 'https://via.placeholder.com/300x200?text=Startup+Template',
        tags: ['startup', 'modern', 'bold'],
        components: [],
      },
      {
        id: 'business-3',
        name: 'Consulting',
        description: 'Elegant template for consulting firms',
        thumbnail: 'https://via.placeholder.com/300x200?text=Consulting+Template',
        tags: ['consulting', 'elegant', 'services'],
        components: [],
      },
    ],
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    templates: [
      {
        id: 'portfolio-1',
        name: 'Creative Portfolio',
        description: 'Showcase your creative work with this artistic template',
        thumbnail: 'https://via.placeholder.com/300x200?text=Creative+Portfolio',
        tags: ['creative', 'portfolio', 'artistic'],
        components: [],
      },
      {
        id: 'portfolio-2',
        name: 'Minimalist Portfolio',
        description: 'Clean and minimalist design to highlight your work',
        thumbnail: 'https://via.placeholder.com/300x200?text=Minimalist+Portfolio',
        tags: ['minimalist', 'clean', 'simple'],
        components: [],
      },
      {
        id: 'portfolio-3',
        name: 'Photography',
        description: 'Perfect for photographers to showcase their work',
        thumbnail: 'https://via.placeholder.com/300x200?text=Photography+Template',
        tags: ['photography', 'gallery', 'visual'],
        components: [],
      },
    ],
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    templates: [
      {
        id: 'ecommerce-1',
        name: 'Online Store',
        description: 'Complete template for online stores with product listings',
        thumbnail: 'https://via.placeholder.com/300x200?text=Online+Store',
        tags: ['ecommerce', 'shop', 'products'],
        components: [],
      },
      {
        id: 'ecommerce-2',
        name: 'Digital Products',
        description: 'Template optimized for selling digital products',
        thumbnail: 'https://via.placeholder.com/300x200?text=Digital+Products',
        tags: ['digital', 'downloads', 'ecommerce'],
        components: [],
      },
    ],
  },
  {
    id: 'blog',
    name: 'Blog',
    templates: [
      {
        id: 'blog-1',
        name: 'Personal Blog',
        description: 'Clean and readable template for personal blogs',
        thumbnail: 'https://via.placeholder.com/300x200?text=Personal+Blog',
        tags: ['blog', 'personal', 'writing'],
        components: [],
      },
      {
        id: 'blog-2',
        name: 'Magazine',
        description: 'Magazine-style layout with multiple content sections',
        thumbnail: 'https://via.placeholder.com/300x200?text=Magazine',
        tags: ['magazine', 'news', 'articles'],
        components: [],
      },
      {
        id: 'blog-3',
        name: 'Podcast',
        description: 'Template designed for podcast websites',
        thumbnail: 'https://via.placeholder.com/300x200?text=Podcast',
        tags: ['podcast', 'audio', 'episodes'],
        components: [],
      },
    ],
  },
  {
    id: 'landing',
    name: 'Landing Pages',
    templates: [
      {
        id: 'landing-1',
        name: 'Product Launch',
        description: 'High-converting template for product launches',
        thumbnail: 'https://via.placeholder.com/300x200?text=Product+Launch',
        tags: ['launch', 'product', 'conversion'],
        components: [],
      },
      {
        id: 'landing-2',
        name: 'App Download',
        description: 'Template optimized for mobile app downloads',
        thumbnail: 'https://via.placeholder.com/300x200?text=App+Download',
        tags: ['app', 'mobile', 'download'],
        components: [],
      },
      {
        id: 'landing-3',
        name: 'Event Registration',
        description: 'Template for events with registration functionality',
        thumbnail: 'https://via.placeholder.com/300x200?text=Event+Registration',
        tags: ['event', 'registration', 'conference'],
        components: [],
      },
    ],
  },
];

export default function TemplateLibrary({ onSelectTemplate, onClose }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Filter templates based on search and active category
  const filteredTemplates = templateCategories.flatMap(category => {
    if (activeCategory !== 'all' && category.id !== activeCategory) {
      return [];
    }
    
    return category.templates.filter(template => {
      const matchesSearch = 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesSearch;
    });
  });
  
  // Handle template selection
  const handleSelect = (template) => {
    setSelectedTemplate(template.id);
  };
  
  // Handle template use confirmation
  const handleUseTemplate = () => {
    const template = templateCategories
      .flatMap(category => category.templates)
      .find(t => t.id === selectedTemplate);
    
    if (template && onSelectTemplate) {
      onSelectTemplate(template);
    }
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Template Library</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          />
        </div>
      </div>
      
      {/* Category Navigation */}
      <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 text-sm rounded-md whitespace-nowrap ${activeCategory === 'all' ? 'bg-[rgb(var(--primary))] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            onClick={() => setActiveCategory('all')}
          >
            All Templates
          </button>
          {templateCategories.map(category => (
            <button 
              key={category.id}
              className={`px-4 py-2 text-sm rounded-md whitespace-nowrap ${activeCategory === category.id ? 'bg-[rgb(var(--primary))] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Templates Grid */}
      <div className="flex-grow px-6 py-4 overflow-y-auto">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2 text-gray-500 dark:text-gray-400">No templates found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleSelect(template)}
                className={`flex flex-col rounded-lg overflow-hidden border ${
                  selectedTemplate === template.id 
                    ? 'border-[rgb(var(--primary))] ring-2 ring-[rgb(var(--primary))]' 
                    : 'border-gray-200 dark:border-gray-700'
                } hover:shadow-md transition-shadow cursor-pointer`}
              >
                <div className="relative aspect-w-16 aspect-h-9">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Selected indicator */}
                  {selectedTemplate === template.id && (
                    <div className="absolute top-2 right-2 h-6 w-6 bg-[rgb(var(--primary))] rounded-full flex items-center justify-center text-white">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{template.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{template.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {template.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3">
                  <button
                    className="w-full px-4 py-2 text-sm font-medium rounded-md bg-[rgb(var(--primary))] text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(template);
                      handleUseTemplate();
                    }}
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {filteredTemplates.length} templates available
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleUseTemplate}
            disabled={!selectedTemplate}
            className={`px-4 py-2 rounded-md ${
              selectedTemplate
                ? 'bg-[rgb(var(--primary))] text-white'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
}
