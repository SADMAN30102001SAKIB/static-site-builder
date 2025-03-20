"use client";

import { useDrop } from 'react-dnd';
import CanvasComponent from './CanvasComponent';

export default function BuilderCanvas({
  components,
  selectedComponentId,
  onSelectComponent,
  onAddComponent,
  onMoveComponent
}) {
  // Setup drop target for canvas
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item, monitor) => {
      // If dropped directly on canvas (not on another component)
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }

      // Add component to the end of the list
      onAddComponent(
        item.type,
        components.length,
        null // No parent for top-level components
      );
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  // Organize components into a tree structure
  const rootComponents = components.filter(component => !component.parentId);
  
  // Helper function to get children of a component
  const getChildComponents = (parentId) => {
    return components.filter(component => component.parentId === parentId)
      .sort((a, b) => a.position - b.position);
  };

  // Recursive component rendering
  const renderComponent = (component) => {
    const children = getChildComponents(component.id);
    
    return (
      <CanvasComponent
        key={component.id}
        component={component}
        isSelected={component.id === selectedComponentId}
        onSelect={() => onSelectComponent(component.id)}
        onAddChild={(type, position) => onAddComponent(type, position, component.id)}
        onMove={onMoveComponent}
      >
        {children.map(child => renderComponent(child))}
      </CanvasComponent>
    );
  };

  return (
    <div 
      ref={drop}
      className={`min-h-[calc(100vh-8rem)] p-6 ${
        isOver && canDrop ? 'bg-blue-50 dark:bg-blue-900/10' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md min-h-[60vh] p-8">
        {rootComponents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Empty Canvas</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Drag components from the left sidebar and drop them here to start building your website
            </p>
          </div>
        ) : (
          rootComponents
            .sort((a, b) => a.position - b.position)
            .map(component => renderComponent(component))
        )}
      </div>
    </div>
  );
}
