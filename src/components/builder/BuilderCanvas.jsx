"use client";

import { useDrop } from "react-dnd";
import CanvasComponent from "./CanvasComponent";
import { useCallback } from "react";

export default function BuilderCanvas({
  components,
  selectedComponentId,
  onSelectComponent,
  onAddComponent,
  onMoveComponent,
  onUpdateComponent,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
}) {
  // Simplified drop handler - only for new components from library
  // All new components go to the end of the page by default
  const handleDropNewComponent = componentType => {
    // Send undefined position to let API append to the end
    onAddComponent(componentType, undefined, null);
  };

  // Setup drop target for canvas - only accept new components from library
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ["COMPONENT"], // Only new components from library
    drop: (item, monitor) => {
      // If dropped directly on canvas (not on another component)
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }

      // Only handle new components from library
      if (item.type && !item.id) {
        handleDropNewComponent(item.type);
        return;
      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver({ shallow: true }),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  // Organize components into a tree structure
  const rootComponents = components
    .filter(component => !component.parentId)
    .map(component => ({
      ...component,
      position: component.position || 0, // Ensure position is never null
    }));

  // Helper function to get children of a component
  const getChildComponents = useCallback(
    parentId => {
      return components
        .filter(component => component.parentId === parentId)
        .map(component => ({
          ...component,
          position: component.position || 0, // Ensure position is never null
        }))
        .sort((a, b) => a.position - b.position);
    },
    [components],
  );

  // Recursive component rendering
  const renderComponent = useCallback(
    (component, parentType = null) => {
      const children = getChildComponents(component.id);

      return (
        <CanvasComponent
          key={component.id}
          component={component}
          parentType={parentType}
          isSelected={selectedComponentId === component.id}
          onSelect={() => onSelectComponent(component.id)}
          onAddChild={(childType, position) => {
            onAddComponent(childType, position, component.id);
          }}
          onMove={(draggedId, newPosition, newParentId) => {
            onMoveComponent(draggedId, newPosition, newParentId);
          }}
          onMoveUp={() => onMoveUp && onMoveUp(component.id)}
          onMoveDown={() => onMoveDown && onMoveDown(component.id)}
          onMoveLeft={() => onMoveLeft && onMoveLeft(component.id)}
          onMoveRight={() => onMoveRight && onMoveRight(component.id)}
          onUpdate={updates => {
            onUpdateComponent(component.id, updates);
          }}>
          {children.map(child => renderComponent(child, component.type))}
        </CanvasComponent>
      );
    },
    [
      selectedComponentId,
      getChildComponents,
      onSelectComponent,
      onAddComponent,
      onMoveComponent,
      onUpdateComponent,
      onMoveUp,
      onMoveDown,
      onMoveLeft,
      onMoveRight,
    ],
  );

  return (
    <div className="flex-1 overflow-auto">
      <div
        ref={drop}
        className={`min-h-full p-6 transition-colors ${
          isOver && canDrop
            ? "bg-blue-50 dark:bg-blue-900/10 border-2 border-dashed border-blue-400"
            : "bg-white dark:bg-gray-900"
        }`}
        onClick={() => onSelectComponent(null)}>
        {/* Canvas Header */}
        <div className="mb-6 text-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Canvas
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Drag components here to build your page
          </p>
        </div>

        {/* Components */}
        <div className="space-y-4">
          {rootComponents.length > 0 ? (
            rootComponents
              .sort((a, b) => (a.position || 0) - (b.position || 0))
              .map(component => renderComponent(component))
          ) : (
            <div className="text-center py-20">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p className="text-lg font-medium">Start building your page</p>
                <p className="text-sm">
                  Drag components from the sidebar to get started
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
