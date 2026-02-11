import type { Types } from "@a2ui/lit/0.8";
import { Table as AntTable } from "antd";
import { memo } from "react";
import { useA2UIComponent } from "../../hooks/useA2UIComponent";
import type { A2UIComponentProps } from "../../types";

export interface TableColumn {
  title: string;
  dataIndex: string;
  key?: string;
  width?: number;
}

/**
 * Table component - displays tabular data with columns and rows.
 *
 * Supports data binding for dataSource and columns definition.
 */
export const Table = memo(function Table({
  node,
  surfaceId,
}: A2UIComponentProps<Types.CustomNode>) {
  const { getValue } = useA2UIComponent(node, surfaceId);
  const props = node.properties;
  console.log(props, "---");
  // Get dataSource from data binding
  const dataSourcePath = (props.dataSourcePath as string) ?? "";
  let dataSource: Record<string, unknown>[] = [];
  if (dataSourcePath) {
    const dataValue = getValue(dataSourcePath);
    console.log(dataValue, "---");

    if (dataValue && typeof dataValue === "object") {
      // Handle DataMap (Map) - this is what A2UI returns for valueMap entries
      if (dataValue instanceof Map) {
        const items = Array.from(dataValue.values()) as any[];

        dataSource = items.map((item: any) => {
          const obj: Record<string, unknown> = {};
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
        dataSource = dataValue as Record<string, unknown>[];
      }
    }
  }
  console.log(dataSource, "11---");

  // Get columns definition
  const columnsPath = (props.columnsPath as string) ?? "";
  let columns: TableColumn[] = [];

  if (columnsPath) {
    const columnsValue = getValue(columnsPath);

    if (columnsValue) {
      if (
        columnsValue instanceof Map &&
        Array.isArray(columnsValue.get("valueMap"))
      ) {
        const columnMap = columnsValue.get("valueMap") as Types.ValueMap[];
        columns = columnMap.map((col) => {
          const title = col.valueString;
          const dataIndex = col.key;
          return {
            title: title ?? "",
            dataIndex: dataIndex ?? "",
            key: dataIndex ?? "",
          };
        });
      } else if (Array.isArray(columnsValue)) {
        columns = columnsValue as unknown as TableColumn[];
      }
    }
  }

  // 如果没有 columns，从 dataSource 自动生成列定义
  if (columns.length === 0 && dataSource.length > 0) {
    const keys = new Set<string>();
    dataSource.forEach((row) => {
      Object.keys(row).forEach((key) => keys.add(key));
    });
    columns = Array.from(keys).map((key) => ({
      title: key,
      dataIndex: key,
      key: key,
    }));
  }

  // Fall back to inline column definitions
  if (columns.length === 0 && props.columns) {
    const inlineColumns = props.columns as unknown as TableColumn[];
    if (Array.isArray(inlineColumns)) {
      columns = inlineColumns;
    }
  }

  const style: React.CSSProperties = {
    flex: node.weight ?? "initial",
    width: "100%",
  };

  return (
    <div data-id={node.id} style={style} className="a2ui-table">
      <AntTable
        dataSource={dataSource}
        columns={columns}
        rowKey={String(Math.random())}
        pagination={false}
        size="small"
        bordered
      />
    </div>
  );
});

export default Table;
