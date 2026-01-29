import type { Types } from "@a2ui/lit/0.8";
import { Button as SemiButton } from "@douyinfe/semi-ui";
import { memo, useCallback } from "react";
import { ComponentNode } from "../../core/ComponentNode";
import { useA2UIComponent } from "../../hooks/useA2UIComponent";
import type { A2UIComponentProps } from "../../types";

/**
 * Button component - a clickable element that triggers an action.
 *
 * Contains a child component (usually Text or Icon) and dispatches
 * a user action when clicked.
 */
export const Button = memo(function Button({
  node,
  surfaceId,
}: A2UIComponentProps<Types.ButtonNode>) {
  const { sendAction } = useA2UIComponent(node, surfaceId);
  const props = node.properties;
  const component = node as Types.ButtonNode;

  const handleClick = useCallback(() => {
    if (props.action) {
      sendAction(props.action);
    }
  }, [props.action, sendAction]);

  const style: React.CSSProperties = {
    flex: component.weight ?? "initial",
  };

  return (
    <SemiButton
      data-id={component.id}
      theme="light"
      onClick={handleClick}
      style={style}
      type={(props as any).primary ? "primary" : "tertiary"}
    >
      <ComponentNode node={props.child} surfaceId={surfaceId} />
    </SemiButton>
  );
});

export default Button;
