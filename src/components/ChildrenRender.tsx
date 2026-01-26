import ComponentNode from "@/core/ComponentNode";
import { Types } from "@a2ui/lit/0.8";

function ChildrenRender({
  children,
  surfaceId,
}: {
  children: Types.AnyComponentNode[];
  surfaceId: string;
}) {
  if (!children || !Array.isArray(children)) {
    return null;
  }

  return (
    <>
      {children.map((child, index) => {
        const childId =
          typeof child === "object" && child !== null && "id" in child
            ? (child as Types.AnyComponentNode).id
            : `child-${index}`;
        const childNode =
          typeof child === "object" && child !== null && "type" in child
            ? (child as Types.AnyComponentNode)
            : null;
        return (
          <ComponentNode key={childId} node={childNode} surfaceId={surfaceId} />
        );
      })}
    </>
  );
}

export default ChildrenRender;
