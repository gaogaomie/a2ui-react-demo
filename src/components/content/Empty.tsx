import { useA2UIComponent } from "@/hooks/useA2UIComponent";
import { Empty as AntEmpty } from "antd";
import React from "react";

export const Empty: React.FC = ({ node, surfaceId }) => {
  const { resolveString } = useA2UIComponent(node, surfaceId);
  const props = node.properties;

  const textValue = resolveString(props.text);
  const usageHint = props.usageHint as UsageHint | undefined;

  const description = <span>No Data Available</span>;

  return <AntEmpty description={textValue} />;
};
