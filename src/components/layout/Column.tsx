import type { Types } from "@a2ui/lit/0.8";
import { memo } from "react";
import type { A2UIComponentProps } from "../../types";
import ChildrenRender from "../ChildrenRender";

type Distribution =
  | "start"
  | "center"
  | "end"
  | "spaceBetween"
  | "spaceAround"
  | "spaceEvenly";
type Alignment = "start" | "center" | "end" | "stretch";

/**
 * Column component - arranges children vertically using flexbox.
 *
 * Supports distribution (justify-content) and alignment (align-items) properties.
 */
export const Column = memo(function Column({
  node,
  surfaceId,
}: A2UIComponentProps<Types.ColumnNode>) {
  const props = node.properties;
  const { alignment = "stretch", distribution = "start" } = node.properties;

  const alignItems =
    alignment === "stretch"
      ? "stretch"
      : alignment === "start"
        ? "flex-start"
        : alignment === "end"
          ? "flex-end"
          : "center";

  const justifyContent =
    distribution === "start"
      ? "flex-start"
      : distribution === "end"
        ? "flex-end"
        : distribution === "center"
          ? "center"
          : distribution === "spaceAround"
            ? "space-around"
            : distribution === "spaceBetween"
              ? "space-between"
              : distribution === "spaceEvenly"
                ? "space-evenly"
                : "flex-start";

  // Gap is controlled by theme classes (layout-g-*), not inline styles
  const style: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems,
    justifyContent,
    gap: "8px",
    flex: node.weight ?? "initial",
  };

  const children = Array.isArray(props.children) ? props.children : [];

  return (
    <div data-id={node.id} style={style}>
      <ChildrenRender surfaceId={surfaceId} children={children} />
    </div>
  );
});

export default Column;
