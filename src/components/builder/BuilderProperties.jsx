"use client";

import { useState, useEffect } from 'react';

// Component property editor based on component type
const PropertyEditors = {
  heading: ({ properties, onChange }) => {
    const { text, level, textAlign, color } = properties;
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Text
          </label>
          <input
            type="text"
            value={text || ''}
            onChange={(e) => onChange({ ...properties, text: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Heading Level
          </label>
          <select
            value={level || 'h2'}
            onChange={(e) => onChange({ ...properties, level: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
          >
            <option value="h1">Heading 1 (Largest)</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="h5">Heading 5</option>
            <option value="h6">Heading 6 (Smallest)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Text Alignment
          </label>
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            {['left', 'center', 'right'].map((align) => (
              <button
                key={align}
                type="button"
                onClick={() => onChange({ ...properties, textAlign: align })}
                className={`flex-1 py-2 ${
                  textAlign === align
                    ? 'bg-[rgb(var(--primary))] text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {align.charAt(0).toUpperCase() + align.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Text Color
          </label>
          <input
            type="color"
            value={color || '#000000'}
            onChange={(e) => onChange({ ...properties, color: e.target.value })}
            className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
          />
        </div>
      </div>
    );
  },
  
  paragraph: ({ properties, onChange }) => {
    const { text, textAlign, color } = properties;
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Text
          </label>
          <textarea
            value={text || ''}
            onChange={(e) => onChange({ ...properties, text: e.target.value })}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Text Alignment
          </label>
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            {['left', 'center', 'right', 'justify'].map((align) => (
              <button
                key={align}
                type="button"
                onClick={() => onChange({ ...properties, textAlign: align })}
                className={`flex-1 py-2 ${
                  textAlign === align
                    ? 'bg-[rgb(var(--primary))] text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {align.charAt(0).toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Text Color
          </label>
          <input
            type="color"
            value={color || '#000000'}
            onChange={(e) => onChange({ ...properties, color: e.target.value })}
            className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
          />
        </div>
      </div>
    );
  },
  
  image: ({ properties, onChange }) => {
    const { src, alt, width } = properties;
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image URL
          </label>
          <input
            type="text"
            value={src || ''}
            onChange={(e) => onChange({ ...properties, src: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Alt Text
          </label>
          <input
            type="text"
            value={alt || ''}
            onChange={(e) => onChange({ ...properties, alt: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="Image description"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Width
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min="10"
              max="100"
              value={(width || '100%').replace('%', '')}
              onChange={(e) => onChange({ ...properties, width: `${e.target.value}%` })}
              className="w-full mr-2"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
              {(width || '100%')}
            </span>
          </div>
        </div>
      </div>
    );
  },
  
  button: ({ properties, onChange }) => {
    const { text, url, backgroundColor, textColor, size } = properties;
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Button Text
          </label>
          <input
            type="text"
            value={text || ''}
            onChange={(e) => onChange({ ...properties, text: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Link URL
          </label>
          <input
            type="text"
            value={url || '#'}
            onChange={(e) => onChange({ ...properties, url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="https://example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Background Color
          </label>
          <input
            type="color"
            value={backgroundColor || '#3b82f6'}
            onChange={(e) => onChange({ ...properties, backgroundColor: e.target.value })}
            className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Text Color
          </label>
          <input
            type="color"
            value={textColor || '#ffffff'}
            onChange={(e) => onChange({ ...properties, textColor: e.target.value })}
            className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Button Size
          </label>
          <select
            value={size || 'medium'}
            onChange={(e) => onChange({ ...properties, size: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>
    );
  },
  
  container: ({ properties, onChange }) => {
    const { width, backgroundColor, padding } = properties;
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Width
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min="10"
              max="100"
              value={(width || '100%').replace('%', '')}
              onChange={(e) => onChange({ ...properties, width: `${e.target.value}%` })}
              className="w-full mr-2"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
              {(width || '100%')}
            </span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Background Color
          </label>
          <input
            type="color"
            value={backgroundColor || '#ffffff'}
            onChange={(e) => onChange({ ...properties, backgroundColor: e.target.value })}
            className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Padding
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['0px', '8px', '16px', '24px', '32px', '48px', '64px', '80px'].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onChange({ ...properties, padding: size })}
                className={`py-1 px-2 text-sm rounded ${
                  padding === size
                    ? 'bg-[rgb(var(--primary))] text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  },
  
  divider: ({ properties, onChange }) => {
    const { style, color, width, thickness } = properties;
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Line Style
          </label>
          <select
            value={style || 'solid'}
            onChange={(e) => onChange({ ...properties, style: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Color
          </label>
          <input
            type="color"
            value={color || '#e5e7eb'}
            onChange={(e) => onChange({ ...properties, color: e.target.value })}
            className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Width
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min="10"
              max="100"
              value={(width || '100%').replace('%', '')}
              onChange={(e) => onChange({ ...properties, width: `${e.target.value}%` })}
              className="w-full mr-2"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
              {(width || '100%')}
            </span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Thickness
          </label>
          <select
            value={thickness || '1px'}
            onChange={(e) => onChange({ ...properties, thickness: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
          >
            <option value="1px">Thin (1px)</option>
            <option value="2px">Medium (2px)</option>
            <option value="4px">Thick (4px)</option>
            <option value="8px">Extra Thick (8px)</option>
          </select>
        </div>
      </div>
    );
  },
  
  input: ({ properties, onChange }) => {
    const { placeholder, label, required } = properties;
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Label Text
          </label>
          <input
            type="text"
            value={label || ''}
            onChange={(e) => onChange({ ...properties, label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="Input Label"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Placeholder
          </label>
          <input
            type="text"
            value={placeholder || ''}
            onChange={(e) => onChange({ ...properties, placeholder: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="Enter placeholder text"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={required || false}
            onChange={(e) => onChange({ ...properties, required: e.target.checked })}
            className="h-4 w-4 text-[rgb(var(--primary))] border-gray-300 rounded focus:ring-[rgb(var(--primary))]"
          />
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Required field
          </label>
        </div>
      </div>
    );
  },
  
  textarea: ({ properties, onChange }) => {
    const { placeholder, label, required, rows } = properties;
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Label Text
          </label>
          <input
            type="text"
            value={label || ''}
            onChange={(e) => onChange({ ...properties, label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="Textarea Label"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Placeholder
          </label>
          <input
            type="text"
            value={placeholder || ''}
            onChange={(e) => onChange({ ...properties, placeholder: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="Enter placeholder text"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Rows
          </label>
          <input
            type="number"
            min="2"
            max="10"
            value={rows || 4}
            onChange={(e) => onChange({ ...properties, rows: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={required || false}
            onChange={(e) => onChange({ ...properties, required: e.target.checked })}
            className="h-4 w-4 text-[rgb(var(--primary))] border-gray-300 rounded focus:ring-[rgb(var(--primary))]"
          />
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Required field
          </label>
        </div>
      </div>
    );
  },
  
  checkbox: ({ properties, onChange }) => {
    const { label, required } = properties;
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Checkbox Label
          </label>
          <input
            type="text"
            value={label || ''}
            onChange={(e) => onChange({ ...properties, label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--primary))] focus:border-[rgb(var(--primary))] dark:bg-gray-700"
            placeholder="I agree to the terms"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={required || false}
            onChange={(e) => onChange({ ...properties, required: e.target.checked })}
            className="h-4 w-4 text-[rgb(var(--primary))] border-gray-300 rounded focus:ring-[rgb(var(--primary))]"
          />
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Required field
          </label>
        </div>
      </div>
    );
  },
};

export default function BuilderProperties({ component, onUpdateComponent, onDeleteComponent }) {
  const [localProperties, setLocalProperties] = useState({});
  
  // Update local properties when selected component changes
  useEffect(() => {
    if (component) {
      setLocalProperties(component.properties || {});
    } else {
      setLocalProperties({});
    }
  }, [component]);
  
  // Handle property changes
  const handleChange = (newProperties) => {
    setLocalProperties(newProperties);
    onUpdateComponent(component.id, { properties: newProperties });
  };
  
  // Get appropriate property editor for component type
  const getPropertyEditor = () => {
    if (!component) return null;
    
    const PropertyEditor = PropertyEditors[component.type];
    if (!PropertyEditor) {
      return (
        <div className="p-4 text-gray-600 dark:text-gray-400">
          No properties available for this component type.
        </div>
      );
    }
    
    return (
      <PropertyEditor
        properties={localProperties}
        onChange={handleChange}
      />
    );
  };
  
  // If no component is selected
  if (!component) {
    return (
      <div className="w-80 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Properties</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Select a component to edit</p>
        </div>
        <div className="flex-1 p-4 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Click on a component in the canvas to edit its properties
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-80 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Properties</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Edit {component.type} component
          </p>
        </div>
        <button
          onClick={() => onDeleteComponent(component.id)}
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
          title="Delete component"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {getPropertyEditor()}
      </div>
    </div>
  );
}
