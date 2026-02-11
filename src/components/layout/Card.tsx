import type { Types } from "@a2ui/lit/0.8";
import { Card as AntdCard } from "antd";
import { memo } from "react";
import type { A2UIComponentProps } from "../../types";
import ChildrenRender from "../ChildrenRender";

/**
 * Card component - a container that visually groups content.
 *
 * Renders either a single child or multiple children.
 */
export const Card = memo(function Card({
  node,
  surfaceId,
}: A2UIComponentProps<Types.CardNode>) {
  const props = node.properties;

  // Card can have either a single child or multiple children
  const rawChildren = props.children ?? (props.child ? [props.child] : []);
  const children = Array.isArray(rawChildren) ? rawChildren : [];

  // Match Lit's section styles: height/width 100%, min-height 0, overflow auto
  const style: React.CSSProperties = {
    flex: node?.weight ?? "initial",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    border: "1px solid rgba(var(--semi-grey-1), 0.1)",
    overflow: "hidden",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  };

  const bodyStyle: React.CSSProperties = {
    padding: "16px",
  };

  return (
    <AntdCard className="a2ui-card " style={style} bodyStyle={bodyStyle}>
      <ChildrenRender children={children} surfaceId={surfaceId} />
    </AntdCard>
  );
});

export default Card;
