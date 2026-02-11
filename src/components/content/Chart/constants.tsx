
import { ColorPalette } from './types';

export const PALETTES: ColorPalette[] = [
  {
    name: '经典 G2',
    colors: ['#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16', '#E8684A', '#6DC8EC', '#9270CA', '#FF9D4D', '#269A99', '#FF99C3'],
  },
  {
    name: '落日余晖',
    colors: ['#ff5f6d', '#ffc371', '#ff9a9e', '#fecfef', '#fad0c4', '#ffecd2'],
  },
  {
    name: '深邃海洋',
    colors: ['#00d2ff', '#3a7bd5', '#1CB5E0', '#000046', '#2193b0', '#6dd5ed'],
  },
  {
    name: '活力炫彩',
    colors: ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e'],
  }
];

export const CHART_OPTIONS = [
  { label: '柱状图', value: 'interval', icon: 'BarChart' },
  { label: '折线图', value: 'line', icon: 'LineChart' },
  { label: '面积图', value: 'area', icon: 'AreaChart' },
  { label: '饼图/环图', value: 'pie', icon: 'PieChart' },
  { label: '散点图', value: 'point', icon: 'Target' },
  { label: '数据表格', value: 'table', icon: 'Table' },
];
