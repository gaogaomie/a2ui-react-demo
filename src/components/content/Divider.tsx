import type { Types } from "@a2ui/lit/0.8";
import { Divider as AntdDivider } from "antd";
import { memo } from "react";
import type { A2UIComponentProps } from "../../types";

/**
 * Divider component - renders a visual separator line.
 */
export const Divider = memo(function Divider({
  node,
  surfaceId,
}: A2UIComponentProps<Types.DividerNode>) {
  const component = node as Types.DividerNode;

  const { axis = "horizontal", color, thickness } = node.properties;

  const style: React.CSSProperties = {
    flex: component.weight ?? "initial",
    ...(color && { borderColor: color }),
    ...(thickness && { borderWidth: thickness }),
  };

  return (
    <AntdDivider
      data-id={component.id}
      type={axis === "vertical" ? "vertical" : "horizontal"}
      // orientation="vertical"
      style={style}
    />
  );
});

export default Divider;
