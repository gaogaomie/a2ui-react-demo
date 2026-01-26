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
 * Row component - arranges children horizontally using flexbox.
 *
 * Supports distribution (justify-content), alignment (align-items), and gap properties.
 */
export const Row = memo(function Row({
  node,
  surfaceId,
}: A2UIComponentProps<Types.RowNode>) {
  const props = node.properties;
  const alignment = props.alignment as Alignment | undefined;
  const distribution = props.distribution as Distribution | undefined;

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
    flexDirection: "row",
    alignItems,
    justifyContent,
    gap: "16px",
    flex: node.weight ?? "initial",
  };

  const children = Array.isArray(props.children) ? props.children : [];

  return (
    <div style={style}>
      <ChildrenRender children={children} surfaceId={surfaceId} />
    </div>
  );
});

export default Row;
