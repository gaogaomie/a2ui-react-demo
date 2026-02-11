import { Tabs } from "antd";
import {
  AreaChart,
  BarChart,
  ChevronRight,
  Image as ImageIcon,
  LineChart,
  Moon,
  PieChart,
  Settings2,
  Sun,
  Table,
  Target,
} from "lucide-react";
import React from "react";
import { CHART_OPTIONS, PALETTES } from "../constants";
import { ChartConfig, ChartType, ThemeType } from "../types";

interface ConfigPanelProps {
  config: ChartConfig;
  setConfig: React.Dispatch<React.SetStateAction<ChartConfig>>;
  xFields: string[];
  yFields: string[];
  onExport: (format: "png" | "svg") => void;
  open: boolean;
  onToggle: () => void;
}

const IconMap: Record<string, any> = {
  BarChart,
  LineChart,
  AreaChart,
  PieChart,
  Target,
  Table,
};

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  setConfig,
  xFields,
  yFields,
  onExport,
  open,
  onToggle,
}) => {
  const updateConfig = <K extends keyof ChartConfig>(
    key: K,
    value: ChartConfig[K],
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className={`bg-white border-l border-slate-200 shadow-xl flex flex-col overflow-hidden w-[40%] transition-all duration-300 ${
        open ? "w-[40%]" : "hidden"
      }`}
    >
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Settings2 size={18} className="text-blue-600" />
          配置
        </h2>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-auto px-2">
        <Tabs
          defaultActiveKey="1"
          className="flex flex-col"
          items={[
            {
              key: "1",
              label: "可视化",
              children: (
                <div className="p-4 space-y-5 h-full overflow-y-auto">
                  {/* 图表类型 */}
                  <section>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 block">
                      可视化类型
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {CHART_OPTIONS.map((opt) => {
                        const Icon = IconMap[opt.icon];
                        const active = config.type === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() =>
                              updateConfig("type", opt.value as ChartType)
                            }
                            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all ${
                              active
                                ? "border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm"
                                : "border-slate-100 hover:border-slate-300 text-slate-500"
                            }`}
                          >
                            <Icon size={18} />
                            <span className="text-[10px] mt-1 font-medium">
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* 字段映射 */}
                  <section className="space-y-3">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      坐标轴映射
                    </label>
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1 block">
                        X 轴 (分类/维度)
                      </label>
                      <select
                        value={config.xField}
                        onChange={(e) => updateConfig("xField", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                      >
                        {[...xFields, ...yFields].map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1 block">
                        Y 轴 (数值/指标)
                      </label>
                      <select
                        value={config.yField}
                        onChange={(e) => updateConfig("yField", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                      >
                        {[...yFields, ...xFields].map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>
                  </section>

                  {/* 数据控制 */}
                  <section className="space-y-3">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      数据范围控制
                    </label>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-slate-600">
                          展示数据行数
                        </label>
                        <span className="text-xs font-bold text-indigo-600">
                          {config.limit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="100"
                        step="5"
                        value={config.limit}
                        onChange={(e) =>
                          updateConfig("limit", parseInt(e.target.value))
                        }
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  </section>
                </div>
              ),
            },
            {
              key: "2",
              label: "设计",
              children: (
                <div className="p-4 space-y-5 h-full overflow-y-auto">
                  {/* 外观设置 */}
                  <section className="space-y-3">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      界面风格
                    </label>
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                        系统主题
                      </label>
                      <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                          onClick={() => updateConfig("theme", ThemeType.LIGHT)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                            config.theme === ThemeType.LIGHT
                              ? "bg-white text-slate-800 shadow-sm"
                              : "text-slate-500"
                          }`}
                        >
                          <Sun size={12} /> 亮色模式
                        </button>
                        <button
                          onClick={() => updateConfig("theme", ThemeType.DARK)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                            config.theme === ThemeType.DARK
                              ? "bg-slate-800 text-white shadow-sm"
                              : "text-slate-500"
                          }`}
                        >
                          <Moon size={12} /> 暗色模式
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                        配色方案
                      </label>
                      <div className="space-y-1.5">
                        {PALETTES.map((p) => (
                          <button
                            key={p.name}
                            onClick={() => updateConfig("palette", p.colors)}
                            className={`w-full flex items-center justify-between p-1.5 rounded-lg border transition-all ${
                              JSON.stringify(config.palette) ===
                              JSON.stringify(p.colors)
                                ? "border-indigo-600 bg-indigo-50/30"
                                : "border-slate-100 hover:border-slate-200"
                            }`}
                          >
                            <span className="text-[10px] font-medium text-slate-600">
                              {p.name}
                            </span>
                            <div className="flex -space-x-1">
                              {p.colors
                                .slice(0, 5)
                                .map((c: string, i: number) => (
                                  <div
                                    key={i}
                                    className="w-3 h-3 rounded-full border border-white shadow-sm"
                                    style={{ backgroundColor: c }}
                                  />
                                ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>
              ),
            },
            {
              key: "3",
              label: "导出",
              children: (
                <div className="p-4 space-y-5 h-full overflow-y-auto">
                  <section className="space-y-3">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      数据导出
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onExport("png")}
                        disabled={config.type === ChartType.TABLE}
                        className={`flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm ${config.type === ChartType.TABLE ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-900"}`}
                      >
                        <ImageIcon size={14} /> 导出 PNG
                      </button>
                    </div>
                  </section>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};
