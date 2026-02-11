import type { Types } from "@a2ui/lit/0.8";
import { Button as AntdButton } from "antd";
import { memo, useCallback } from "react";
import { ComponentNode } from "../../core/ComponentNode";
import { useA2UIComponent } from "../../hooks/useA2UIComponent";
import type { A2UIComponentProps } from "../../types";

export const Button = memo(function Button({
  node,
  surfaceId,
}: A2UIComponentProps<Types.ButtonNode>) {
  const { sendAction } = useA2UIComponent(node, surfaceId);
  const props = node.properties;
  const component = node as Types.ButtonNode;

  const handleClick = useCallback(() => {
    if (props?.action) {
      sendAction(props?.action);
    }
  }, [props.action, sendAction]);

  const style: React.CSSProperties = {
    flex: component.weight ?? "initial",
  };
  return (
    <AntdButton
      data-id={component.id}
      onClick={handleClick}
      style={style}
      type={(props as any).primary ? "primary" : "default"}
    >
      <ComponentNode node={props.child} surfaceId={surfaceId} />
    </AntdButton>
  );
});
