
export enum ChartType {
  BAR = 'interval',
  LINE = 'line',
  AREA = 'area',
  PIE = 'pie',
  SCATTER = 'point',
  TABLE = 'table'
}

export enum ThemeType {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface ColorPalette {
  name: string;
  colors: string[];
}

export interface ChartConfig {
  type: ChartType;
  xField: string;
  yField: string;
  theme: ThemeType;
  palette: string[];
  limit: number;
  showTable: boolean; // 保留字段以维持兼容性，但 UI 上将不再使用
  title: string;
}

export type DataItem = Record<string, string | number>;

export interface DynamicChartProps {
  dataSource: DataItem[];
  defaultTitle?: string;
}
