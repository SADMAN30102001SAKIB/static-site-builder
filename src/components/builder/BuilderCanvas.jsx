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
}) {
  // Setup drop target for canvas
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ["COMPONENT", "CANVAS_COMPONENT"],
    drop: (item, monitor) => {
      // If dropped directly on canvas (not on another component)
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }

      // If it's a new component from the library
      if (item.type && !item.id) {
        onAddComponent(item.type, components.length, null);
        return;
      }

      // If it's an existing component being moved
      if (item.id) {
        onMoveComponent(item.id, components.length, null);
        return;
      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver({ shallow: true }),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  // Helper function to get default properties for each component type
  const getDefaultProperties = useCallback(type => {
    const defaults = {
      heading: {
        text: "New Heading",
        level: "h2",
        textAlign: "left",
        color: "#000000",
      },
      paragraph: {
        text: "New paragraph text. Double-click to edit.",
        textAlign: "left",
        color: "#000000",
      },
      button: {
        text: "Click me",
        backgroundColor: "#3b82f6",
        textColor: "#ffffff",
        size: "medium",
        url: "#",
      },
      image: {
        src: "https://via.placeholder.com/300x200",
        alt: "Image description",
        width: "300px",
      },
      container: {
        backgroundColor: "transparent",
        padding: "20px",
        width: "100%",
      },
      divider: {
        style: "solid",
        color: "#e5e7eb",
        width: "100%",
        thickness: "1px",
      },
      input: {
        placeholder: "Enter text...",
        label: "Input Label",
        required: false,
      },
      textarea: {
        placeholder: "Enter text...",
        label: "Textarea Label",
        required: false,
        rows: 4,
      },
      checkbox: {
        label: "Checkbox Label",
      },
      video: {
        url: "",
        width: "100%",
        height: "auto",
        controls: true,
        autoplay: false,
      },
      icon: {
        name: "star",
        size: "24px",
        color: "#000000",
      },
      columns: {
        columns: 2,
        gap: "20px",
      },
      spacer: {
        height: "40px",
      },
      select: {
        label: "Select Label",
        options: ["Option 1", "Option 2", "Option 3"],
        required: false,
      },
      contactForm: {
        title: "Contact Us",
        submitButtonText: "Send Message",
        showNameField: true,
        showSubjectField: true,
      },
      hero: {
        title: "Hero Title",
        subtitle: "Add a subtitle here",
        backgroundImage: "",
        textColor: "#ffffff",
        alignment: "center",
        height: "400px",
      },
      features: {
        title: "Our Features",
        featureCount: 3,
        showIcons: true,
      },
      testimonials: {
        text: "This is a great testimonial.",
        author: "John Doe",
        position: "CEO, Company",
        avatar: "https://via.placeholder.com/60x60",
      },
      pricing: {
        title: "Pricing Plans",
        plans: [
          {
            name: "Basic",
            price: "$10",
            features: ["Feature 1", "Feature 2"],
          },
          {
            name: "Pro",
            price: "$20",
            features: ["Feature 1", "Feature 2", "Feature 3"],
          },
        ],
      },
      gallery: {
        images: [
          "https://via.placeholder.com/300x200",
          "https://via.placeholder.com/300x200",
          "https://via.placeholder.com/300x200",
        ],
        columns: 3,
      },
      logo: {
        src: "https://via.placeholder.com/150x50",
        alt: "Logo",
        width: "150px",
      },
      navbar: {
        brand: "Brand Name",
        links: [
          { text: "Home", url: "/" },
          { text: "About", url: "/about" },
          { text: "Contact", url: "/contact" },
        ],
        backgroundColor: "#ffffff",
        textColor: "#000000",
      },
      footer: {
        text: "© 2024 Your Company. All rights reserved.",
        backgroundColor: "#374151",
        textColor: "#ffffff",
        links: [
          { text: "Privacy", url: "/privacy" },
          { text: "Terms", url: "/terms" },
        ],
      },
      socialLinks: {
        platforms: ["facebook", "twitter", "instagram"],
        layout: "horizontal",
        iconSize: "24px",
      },
      callToAction: {
        title: "Ready to get started?",
        subtitle: "Join thousands of satisfied customers today!",
        buttonText: "Get Started",
        align: "center",
        backgroundColor: "#3b82f6",
      },
    };

    return defaults[type] || {};
  }, []);

  // Organize components into a tree structure
  const rootComponents = components.filter(component => !component.parentId);

  // Helper function to get children of a component
  const getChildComponents = useCallback(
    parentId => {
      return components
        .filter(component => component.parentId === parentId)
        .sort((a, b) => a.position - b.position);
    },
    [components],
  );

  // Recursive component rendering
  const renderComponent = useCallback(
    component => {
      const children = getChildComponents(component.id);

      return (
        <CanvasComponent
          key={component.id}
          component={component}
          isSelected={selectedComponentId === component.id}
          onSelect={() => onSelectComponent(component.id)}
          onAddChild={(childType, position) => {
            onAddComponent(childType, position, component.id);
          }}
          onMove={(draggedId, newPosition, newParentId) => {
            onMoveComponent(draggedId, newPosition, newParentId);
          }}
          onUpdate={updates => {
            onUpdateComponent(component.id, updates);
          }}>
          {children.map(renderComponent)}
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
              .sort((a, b) => a.position - b.position)
              .map(renderComponent)
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
