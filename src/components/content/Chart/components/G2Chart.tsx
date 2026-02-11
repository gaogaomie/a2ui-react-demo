import { Chart } from "@antv/g2";
import React, { useEffect, useRef } from "react";
import { ChartConfig, ChartType, DataItem, ThemeType } from "../types";

interface G2ChartProps {
  config: ChartConfig;
  data: DataItem[];
  onChartReady: (chart: Chart) => void;
}

export const G2Chart: React.FC<G2ChartProps> = ({
  config,
  data,
  onChartReady,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    // 基础校验：表格类型不在此渲染
    if (
      !containerRef.current ||
      !config.xField ||
      !config.yField ||
      !data.length ||
      config.type === ChartType.TABLE
    )
      return;

    // 销毁上一个实例
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    // 销毁之前的 ResizeObserver
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }

    const initChart = async () => {
      try {
        const chart = new Chart({
          container: containerRef.current!,
          autoFit: true,
          theme: config.theme === ThemeType.DARK ? "dark" : "light",
        });

        const displayData = data.slice(0, config.limit);
        chart.data(displayData);

        if (config.type === ChartType.PIE) {
          chart.coordinate({ type: "theta", innerRadius: 0.5 });
          chart
            .interval()
            .transform({ type: "stackY" })
            .encode("y", config.yField)
            .encode("color", config.xField)
            .label({
              text: config.xField,
              position: "outside",
              fontSize: 10,
              connector: true,
            })
            .style("inset", 1)
            .style("radius", 4)
            .animate("enter", { type: "waveIn" });
        } else {
          const markTypeMap: Record<string, any> = {
            [ChartType.BAR]: "interval",
            [ChartType.LINE]: "line",
            [ChartType.AREA]: "area",
            [ChartType.SCATTER]: "point",
          };

          const type = markTypeMap[config.type] || "interval";
          const node = chart[type as "interval"]();

          node.encode("x", config.xField).encode("y", config.yField);

          // 关键修复：折线图和面积图如果 encode('color', xField)，会导致每个点都是独立系列，无法连线
          // 因此仅在柱状图、散点图时编码颜色。折线和面积图使用首选颜色。
          if (
            config.type === ChartType.BAR ||
            config.type === ChartType.SCATTER
          ) {
            node.encode("color", config.xField);
          } else {
            // 折线/面积图使用首个颜色，并启用平滑和点展示
            node.style("stroke", config.palette[0]);
            if (config.type === ChartType.LINE) {
              node.style("lineWidth", 2).encode("shape", "smooth");
              // 在线上增加点
              chart
                .point()
                .encode("x", config.xField)
                .encode("y", config.yField)
                .encode("color", config.palette[0])
                .encode("shape", "point")
                .encode("size", 3)
                .tooltip(false);
            }
            if (config.type === ChartType.AREA) {
              node.style("fillOpacity", 0.4).encode("shape", "smooth");
            }
          }

          if (config.type === ChartType.BAR) {
            node.style("radius", 4);
          }

          if (config.type === ChartType.SCATTER) {
            node.encode("shape", "point").encode("size", 4);
          }

          node.animate("enter", { type: "fadeIn" });
        }

        // 配置颜色比例尺
        chart.scale("color", {
          range: config.palette,
        });

        chart.interaction("tooltip", { shared: true });

        await chart.render();
        chartRef.current = chart;
        onChartReady(chart);

        // 添加 ResizeObserver 监听容器尺寸变化
        resizeObserverRef.current = new ResizeObserver(() => {
          if (chartRef.current) {
            chartRef.current.forceFit();
          }
        });
        resizeObserverRef.current.observe(containerRef.current!);
      } catch (err) {
        console.error("[G2 渲染异常]", err);
      }
    };

    initChart();

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [config, data, onChartReady]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full min-h-[400px] transition-all duration-500 rounded-xl overflow-hidden flex items-center justify-center relative ${
        config.theme === ThemeType.DARK ? "bg-slate-900 shadow-inner" : "bg-red"
      }`}
    >
      {(!config.xField || !config.yField) && (
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">
            初始化数据引擎...
          </p>
        </div>
      )}
    </div>
  );
};
