import { Chart } from "@antv/g2";
import { Settings2, X } from "lucide-react";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { PALETTES } from "../../constants";
import {
  ChartConfig,
  ChartType,
  DynamicChartProps,
  ThemeType,
} from "../../types";
import { analyzeData } from "../../utils/dataHelpers";
import { ConfigPanel } from "../ConfigPanel";
import { DataTable } from "../DataTable";
import { G2Chart } from "../G2Chart";

export const DynamicChart: React.FC<DynamicChartProps> = ({
  dataSource,
  defaultTitle = "数据可视化看板",
}) => {
  const chartInstance = useRef<Chart | null>(null);
  const [configPanelOpen, setConfigPanelOpen] = useState(false);

  // 分析数据以获取初始建议
  const analysis = useMemo(() => analyzeData(dataSource), [dataSource]);

  // UI 状态
  const [config, setConfig] = useState<ChartConfig>({
    type: ChartType.BAR,
    xField: analysis.suggestedX || "",
    yField: analysis.suggestedY || "",
    theme: ThemeType.LIGHT,
    palette: PALETTES[0].colors,
    limit: 20,
    showTable: false,
    title: defaultTitle,
  });

  const handleChartReady = useCallback((chart: Chart) => {
    chartInstance.current = chart;
  }, []);

  const handleExport = async (format: "png" | "svg") => {
    if (!chartInstance.current || config.type === ChartType.TABLE) return;

    const context = chartInstance.current.getContext();
    const gCanvas = context?.canvas;

    if (!gCanvas) {
      console.error("无法获取 G2 Canvas 实例");
      return;
    }

    // 获取 DOM canvas 元素
    const dom = gCanvas.getContextService().getDomElement();

    if (!dom || !(dom instanceof HTMLCanvasElement)) {
      console.error("无法获取 canvas DOM 元素");
      return;
    }

    if (format === "png") {
      // PNG 导出：直接使用 toDataURL
      const url = dom.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `图表导出-${Date.now()}.png`;
      link.href = url;
      link.click();
    } else {
      console.warn("svg export not supported");
    }
  };

  const chartTypeNameMap: Record<string, string> = {
    interval: "柱状图",
    line: "折线图",
    area: "面积图",
    pie: "饼图",
    point: "散点图",
    table: "数据明细表",
  };
  console.log(configPanelOpen, "configPanelOpen");

  return (
    <div className="flex  bg-slate-50 overflow-hidden font-sans h-full">
      {/* 主视图区域 */}
      <main
        className={`${configPanelOpen ? "w-[60%]" : "w-[100%]"} transition-all duration-300 ${config.theme === ThemeType.DARK ? "bg-slate-950" : "bg-slate-50"}`}
      >
        <div
          className={`relative p-8 min-h-[500px] h-full flex flex-col ${
            config.theme === ThemeType.DARK
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-200"
          }`}
        >
          {/* 配置按钮 */}
          <button
            onClick={() => setConfigPanelOpen(!configPanelOpen)}
            className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
              configPanelOpen
                ? "bg-blue-100 text-blue-600"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {configPanelOpen ? <X size={20} /> : <Settings2 size={20} />}
          </button>

          <div className="mb-6 flex items-center justify-between pr-12">
            <div>
              <h3
                className={`text-lg font-bold ${config.theme === ThemeType.DARK ? "text-white" : "text-slate-800"}`}
              >
                {chartTypeNameMap[config.type] || "图表"} 分析
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                正在通过可视化呈现基于 <b>{config.xField}</b> 的{" "}
                <b>{config.yField}</b> 洞察数据 (已选前 {config.limit} 项)
              </p>
            </div>
            <div className="flex items-center gap-1">
              {config.palette.slice(0, 4).map((c, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex-1 w-full overflow-hidden">
            {config.type === ChartType.TABLE ? (
              <div className="h-full overflow-y-auto">
                <DataTable
                  data={dataSource.slice(0, config.limit)}
                  theme={config.theme}
                />
              </div>
            ) : (
              <G2Chart
                config={config}
                data={dataSource}
                onChartReady={handleChartReady}
              />
            )}
          </div>
        </div>
      </main>
      {/* 配置面板 */}

      <ConfigPanel
        config={config}
        setConfig={setConfig}
        xFields={analysis.xFields}
        yFields={analysis.yFields}
        onExport={handleExport}
        open={configPanelOpen}
        onToggle={() => setConfigPanelOpen(!configPanelOpen)}
      />
    </div>
  );
};
