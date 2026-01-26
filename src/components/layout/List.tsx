import type { Types } from "@a2ui/lit/0.8";
import { memo } from "react";
import type { A2UIComponentProps } from "../../types";
import ChildrenRender from "../ChildrenRender";

export const List = memo(function List({
  node,
  surfaceId,
}: A2UIComponentProps<Types.ListNode>) {
  const props = node.properties;
  const { direction = "vertical" } = node.properties;

  // Match Lit renderer styles exactly:
  // - Vertical: display: grid
  // - Horizontal: display: flex with horizontal scroll
  const style: React.CSSProperties = {
    display: "flex",
    flexDirection: direction === "horizontal" ? "row" : "column",
    gap: "8px",
    overflow: "auto",
    flex: node.weight ?? "initial",
  };

  const children = Array.isArray(props.children) ? props.children : [];

  return (
    <div id={node.id} style={style}>
      <ChildrenRender children={children} surfaceId={surfaceId} />
    </div>
  );
});

export default List;
