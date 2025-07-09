// Component that renders a page using the shared component renderers
import componentRenderers, { defaultRenderer } from "./componentRenderers";

function renderComponentTree(components, parentId = null) {
  const componentsAtLevel = components.filter(c => c.parentId === parentId);

  return componentsAtLevel.map(component => {
    const childComponents = components.filter(c => c.parentId === component.id);
    const renderer = componentRenderers[component.type] || defaultRenderer;

    const childElements =
      childComponents.length > 0
        ? renderComponentTree(components, component.id)
        : null;

    return (
      <div key={component.id} className="mb-4">
        {renderer({
          properties: component.properties || {},
          children: childElements,
          type: component.type,
        })}
      </div>
    );
  });
}

export default function PageRenderer({ page }) {
  if (!page || !page.components) {
    return <div>No content found</div>;
  }

  return (
    <div className="space-y-4">{renderComponentTree(page.components)}</div>
  );
}
