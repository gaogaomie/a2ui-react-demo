import React from "react";
import { Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { DataItem, ThemeType } from "../types";

interface DataTableProps {
  data: DataItem[];
  theme: ThemeType;
}

export const DataTable: React.FC<DataTableProps> = ({ data, theme }) => {
  if (!data || data.length === 0) return null;

  // Generate columns from data keys
  const columns: ColumnsType<DataItem> = Object.keys(data[0]).map((key) => ({
    title: key,
    dataIndex: key,
    key: key,
    width: 150,
  }));

  // AntD dark theme config
  const isDark = theme === ThemeType.DARK;

  const pagination: TablePaginationConfig = {
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
    showTotal: (total) => `共 ${total} 条`,
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(_record, index) => index ?? 0}
      pagination={pagination}
      bordered
      size="small"
      className={
        isDark
          ? "ant-table-dark-wrapper"
          : "ant-table-light-wrapper"
      }
      style={{
        background: isDark ? "#0f172a" : "#ffffff",
      }}
    />
  );
};
