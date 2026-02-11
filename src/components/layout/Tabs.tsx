import type { Types } from "@a2ui/lit/0.8";
import { Tabs as AntdTabs } from "antd";
import { memo } from "react";
import { ComponentNode } from "../../core/ComponentNode";
import { useA2UIComponent } from "../../hooks/useA2UIComponent";
import type { A2UIComponentProps } from "../../types";
const { TabPane } = AntdTabs;

export const Tabs = memo(function Tabs({
  node,
  surfaceId,
}: A2UIComponentProps<Types.TabsNode>) {
  const { resolveString } = useA2UIComponent(node, surfaceId);
  const component = node as Types.TabsNode;
  const { tabItems = [] } = node.properties;

  const style: React.CSSProperties = {
    flex: component.weight ?? "initial",
  };

  return (
    <div data-id={component.id}>
      <AntdTabs style={style} type="card">
        {tabItems?.map((item, index) => {
          const title = resolveString(item.title);
          const node = tabItems[index]?.child;
          return (
            <TabPane tab={title} itemKey={String(index)} key={item.id || index}>
              {node && <ComponentNode node={node} surfaceId={surfaceId} />}
            </TabPane>
          );
        })}
      </AntdTabs>
    </div>
  );
});

export default Tabs;
