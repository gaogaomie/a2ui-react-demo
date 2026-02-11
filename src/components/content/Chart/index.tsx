import { useA2UIComponent } from "@/hooks/useA2UIComponent";
import { A2UIComponentProps } from "@/types";
import React, { memo } from "react";
import { DynamicChart } from "./components/DynamicChart";
import { DataItem } from "./types";

export const Chart = memo(function ChartA2UI({
  node,
  surfaceId,
}: A2UIComponentProps<Types.CustomNode>) {
  const { getValue, resolveString } = useA2UIComponent(node, surfaceId);
  const props = node.properties;

  // Get dataSource from data binding
  const dataSourcePath = (props.dataSourcePath as string) ?? "";
  let dataSource: DataItem[] = [];

  if (dataSourcePath) {
    const dataValue = getValue(dataSourcePath);

    if (dataValue && typeof dataValue === "object") {
      // Handle DataMap (Map) - this is what A2UI returns for valueMap entries
      if (dataValue instanceof Map) {
        const items = Array.from(dataValue.values()) as any[];

        dataSource = items.map((item: any) => {
          const obj: DataItem = {};
          // Check if data is in item.vals (Map structure)
          if (item.vals instanceof Map) {
            item.vals.forEach((val: any, key: string) => {
              obj[key] = val;
            });
          }
          // Fallback for valueMap array
          else if (Array.isArray(item.valueMap)) {
            item.valueMap.forEach((val: any) => {
              if (val.key) {
                obj[val.key] =
                  val.valueString ??
                  val.valueNumber ??
                  val.valueBoolean ??
                  undefined;
              }
            });
          }
          return obj;
        });
      }
      // Handle array directly
      else if (Array.isArray(dataValue)) {
        dataSource = dataValue as DataItem[];
      }
    }
  }

  // Get title from data binding or use default
  const titleValue = resolveString(props.title as any);
  const title = titleValue ?? "数据可视化看板";

  const style: React.CSSProperties = {
    // flex: node.weight ?? "initial",
    width: "100%",
    minHeight: "500px",
    height: "500px",
  };

  return (
    <div className="flex-1" style={style}>
      <DynamicChart dataSource={dataSource} defaultTitle={title} />
    </div>
  );
});

export default Chart;
