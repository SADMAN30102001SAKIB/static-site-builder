"use client";

import { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import { Popover } from '@headlessui/react';

export default function StyleEditor({ component, onChange }) {
  if (!component) return null;
  
  // Common style properties for all components
  const CommonStyler = () => {
    const [styles, setStyles] = useState({
      backgroundColor: component.properties?.backgroundColor || '',
      textColor: component.properties?.textColor || '',
      borderRadius: component.properties?.borderRadius || '',
      borderWidth: component.properties?.borderWidth || '',
      borderColor: component.properties?.borderColor || '',
      borderStyle: component.properties?.borderStyle || 'solid',
      padding: component.properties?.padding || '',
      margin: component.properties?.margin || '',
      width: component.properties?.width || '',
      height: component.properties?.height || '',
      fontSize: component.properties?.fontSize || '',
      fontWeight: component.properties?.fontWeight || '',
      textAlign: component.properties?.textAlign || 'left',
      opacity: component.properties?.opacity || '100',
      boxShadow: component.properties?.boxShadow || '',
    });
    
    const updateStyle = (key, value) => {
      const updatedStyles = { ...styles, [key]: value };
      setStyles(updatedStyles);
      onChange(updatedStyles);
    };
    
    return (
      <div className="space-y-4">
        {/* Layout section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Layout</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Width</label>
              <input
                type="text"
                value={styles.width}
                onChange={(e) => updateStyle('width', e.target.value)}
                placeholder="e.g. 100%, 300px"
                className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Height</label>
              <input
                type="text"
                value={styles.height}
                onChange={(e) => updateStyle('height', e.target.value)}
                placeholder="e.g. auto, 200px"
                className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Padding</label>
              <input
                type="text"
                value={styles.padding}
                onChange={(e) => updateStyle('padding', e.target.value)}
                placeholder="e.g. 10px, 10px 20px"
                className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Margin</label>
              <input
                type="text"
                value={styles.margin}
                onChange={(e) => updateStyle('margin', e.target.value)}
                placeholder="e.g. 10px, 10px 20px"
                className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>
          </div>
        </div>
        
        {/* Typography section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Typography</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Font Size</label>
              <input
                type="text"
                value={styles.fontSize}
                onChange={(e) => updateStyle('fontSize', e.target.value)}
                placeholder="e.g. 16px, 1.5rem"
                className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Font Weight</label>
              <select
                value={styles.fontWeight}
                onChange={(e) => updateStyle('fontWeight', e.target.value)}
                className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md"
              >
                <option value="">Default</option>
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="lighter">Lighter</option>
                <option value="bolder">Bolder</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
                <option value="500">500</option>
                <option value="600">600</option>
                <option value="700">700</option>
                <option value="800">800</option>
                <option value="900">900</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Text Align</label>
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                {['left', 'center', 'right', 'justify'].map((align) => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => updateStyle('textAlign', align)}
                    className={`flex-1 py-1 text-xs ${
                      styles.textAlign === align
                        ? 'bg-gray-200 dark:bg-gray-700'
                        : 'bg-white dark:bg-gray-800'
                    }`}
                  >
                    {align.charAt(0).toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Text Color</label>
              <Popover className="relative">
                <Popover.Button className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md flex items-center">
                  <div
                    className="h-4 w-4 mr-2 rounded-sm border border-gray-300"
                    style={{ backgroundColor: styles.textColor || 'transparent' }}
                  />
                  {styles.textColor || 'Select'}
                </Popover.Button>
                <Popover.Panel className="absolute z-10 mt-1">
                  <SketchPicker
                    color={styles.textColor || '#000000'}
                    onChange={(color) => updateStyle('textColor', color.hex)}
                  />
                </Popover.Panel>
              </Popover>
            </div>
          </div>
        </div>
        
        {/* Background section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Background</h3>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Background Color</label>
            <Popover className="relative">
              <Popover.Button className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md flex items-center">
                <div
                  className="h-4 w-4 mr-2 rounded-sm border border-gray-300"
                  style={{ backgroundColor: styles.backgroundColor || 'transparent' }}
                />
                {styles.backgroundColor || 'Select'}
              </Popover.Button>
              <Popover.Panel className="absolute z-10 mt-1">
                <SketchPicker
                  color={styles.backgroundColor || '#ffffff'}
                  onChange={(color) => updateStyle('backgroundColor', color.hex)}
                />
              </Popover.Panel>
            </Popover>
          </div>
        </div>
        
        {/* Border section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Border</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Border Width</label>
              <input
                type="text"
                value={styles.borderWidth}
                onChange={(e) => updateStyle('borderWidth', e.target.value)}
                placeholder="e.g. 1px, 2px"
                className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Border Radius</label>
              <input
                type="text"
                value={styles.borderRadius}
                onChange={(e) => updateStyle('borderRadius', e.target.value)}
                placeholder="e.g. 4px, 50%"
                className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Border Style</label>
              <select
                value={styles.borderStyle}
                onChange={(e) => updateStyle('borderStyle', e.target.value)}
                className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
                <option value="none">None</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Border Color</label>
              <Popover className="relative">
                <Popover.Button className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md flex items-center">
                  <div
                    className="h-4 w-4 mr-2 rounded-sm border border-gray-300"
                    style={{ backgroundColor: styles.borderColor || 'transparent' }}
                  />
                  {styles.borderColor || 'Select'}
                </Popover.Button>
                <Popover.Panel className="absolute z-10 mt-1">
                  <SketchPicker
                    color={styles.borderColor || '#000000'}
                    onChange={(color) => updateStyle('borderColor', color.hex)}
                  />
                </Popover.Panel>
              </Popover>
            </div>
          </div>
        </div>
        
        {/* Effects section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Effects</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Opacity (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={styles.opacity}
                onChange={(e) => updateStyle('opacity', e.target.value)}
                className="w-full"
              />
              <div className="text-xs text-center mt-1">{styles.opacity}%</div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Box Shadow</label>
              <select
                value={styles.boxShadow}
                onChange={(e) => updateStyle('boxShadow', e.target.value)}
                className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md"
              >
                <option value="">None</option>
                <option value="0 1px 3px rgba(0,0,0,0.12)">Small</option>
                <option value="0 4px 6px rgba(0,0,0,0.1)">Medium</option>
                <option value="0 10px 15px rgba(0,0,0,0.1)">Large</option>
                <option value="0 20px 25px rgba(0,0,0,0.15)">Extra Large</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Specific component stylers
  const componentStylers = {
    heading: () => (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heading Text</label>
          <input
            type="text"
            value={component.properties?.text || ''}
            onChange={(e) => onChange({ ...component.properties, text: e.target.value })}
            placeholder="Enter heading text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heading Level</label>
          <select
            value={component.properties?.level || 'h2'}
            onChange={(e) => onChange({ ...component.properties, level: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
          >
            <option value="h1">H1</option>
            <option value="h2">H2</option>
            <option value="h3">H3</option>
            <option value="h4">H4</option>
            <option value="h5">H5</option>
            <option value="h6">H6</option>
          </select>
        </div>
        <CommonStyler />
      </div>
    ),
    
    paragraph: () => (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paragraph Text</label>
          <textarea
            value={component.properties?.text || ''}
            onChange={(e) => onChange({ ...component.properties, text: e.target.value })}
            placeholder="Enter paragraph text"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
          />
        </div>
        <CommonStyler />
      </div>
    ),
    
    image: () => (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
          <div className="flex">
            <input
              type="text"
              value={component.properties?.src || ''}
              onChange={(e) => onChange({ ...component.properties, src: e.target.value })}
              placeholder="Enter image URL"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md"
            />
            <button
              type="button"
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md"
              onClick={() => {
                // This would open the media library
                console.log('Open media library');
              }}
            >
              Browse
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alt Text</label>
          <input
            type="text"
            value={component.properties?.alt || ''}
            onChange={(e) => onChange({ ...component.properties, alt: e.target.value })}
            placeholder="Describe the image"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
          />
        </div>
        <CommonStyler />
      </div>
    ),
    
    button: () => (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Button Text</label>
          <input
            type="text"
            value={component.properties?.text || ''}
            onChange={(e) => onChange({ ...component.properties, text: e.target.value })}
            placeholder="Enter button text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL</label>
          <input
            type="text"
            value={component.properties?.url || ''}
            onChange={(e) => onChange({ ...component.properties, url: e.target.value })}
            placeholder="Enter URL"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Size</label>
          <select
            value={component.properties?.size || 'medium'}
            onChange={(e) => onChange({ ...component.properties, size: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <CommonStyler />
      </div>
    ),
  };
  
  // Fallback to CommonStyler if no specific styler is available for this component type
  const ComponentStyler = componentStylers[component.type] || (() => <CommonStyler />);
  
  return (
    <div className="h-full overflow-y-auto px-4 py-4">
      <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
        Edit {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
      </h2>
      <ComponentStyler />
    </div>
  );
}
