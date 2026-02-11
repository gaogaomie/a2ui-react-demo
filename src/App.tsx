import A2UIRenderWrap, { TestWrapper } from "@/components/A2UIRenderWrap";
import originData from "@/template/analysis-diaochawenjuan.json";
import diaochawenquan from "@/template/index.json";
import { litTheme } from "@/theme/litTheme";
import { Types } from "@/types";
import { message, Spin } from "antd";
import { Code, Play, RotateCcw, Zap } from "lucide-react";
import { useState } from "react";
import { initializeDefaultCatalog } from "./registry/defaultCatalog";
import { generateProject } from "./services/a2UIService";

initializeDefaultCatalog();

const DEFAULT_JSON = JSON.stringify(diaochawenquan, null, 2);

export default function App() {
  const [jsonInput, setJsonInput] = useState(DEFAULT_JSON);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [parsedMessages, setParsedMessages] = useState<
    Types.ServerToClientMessage[] | null
  >(null);

  const handleRender = () => {
    try {
      setRenderError(null);
      const parsed = JSON.parse(jsonInput);
      setParsedMessages(parsed);
    } catch (err) {
      setRenderError(err instanceof Error ? err.message : "JSON 解析失败");
      setParsedMessages(null);
    }
  };

  const handleReset = () => {
    setJsonInput("[]");
    setRenderError(null);
    setParsedMessages(null);
  };

  const [loading, setLoading] = useState(false);
  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      setRenderError(null);
    } catch (err) {
      setRenderError(err instanceof Error ? err.message : "JSON 格式化失败");
    }
  };

  const handleSubmit = async (a) => {
    console.log("=== handleSubmit ===");
    console.log("Full action:", a);
    const {
      userAction: { context, name },
    } = a;

    if (name === "submitAnswers") {
      // 提交答卷：将问题和答案整合成对象格式
      const answers = context.answers.vals;
      let allQuestions: any[] = [];
      Object.values(originData).forEach((item) => {
        console.log("item:", item);
        allQuestions = [...allQuestions, ...item];
      });

      let answersArr: any[] = [];

      for (const [key, value] of answers) {
        const questionObj = allQuestions.find((item) => item.id == key);

        const question = questionObj?.question || key;
        answersArr = [
          ...answersArr,
          {
            question,
            user_answer: Array.isArray(value) ? value.join(",") : value,
            correct_answer: questionObj.answer,
            correct_answer_explain: questionObj.analysis,
            score: questionObj.score,
          },
        ];
      }

      const text = `# 试卷评分任务

请根据以下试卷标准答案和用户提交的答案，生成一份评分报告。

## 评分规则
- 满分：100分
- 对比用户答案与正确答案，计算得分
- 单选题/判断题：答对得分，答错不得分
- 多选题：全对得满分，部分正确按比例给分

## 输出要求
请以 JSON 格式返回以下 A2UI 界面数据：

1. **得分展示**：总分数字（突出显示）
2. **总体表现评价**：根据得分给出评价等级（优秀/良好/及格/需努力）
3. **改进建议**：1-2条针对性的学习建议
4. **得分分布**（可选,表格展示最好）：各题型得分情况

**注意**：不要逐题解析，只给出总体评价和建议。

---

## 标准答案
\`\`\`json
${JSON.stringify(originData, null, 2)}
\`\`\`

## 用户答案
\`\`\`json
${JSON.stringify(answersArr, null, 2)}
\`\`\`

---

请直接返回可用的 A2UI JSON 数组格式。`;

      try {
        setLoading(true);
        message.success("答案提交中，请稍后...");
        const res = await generateProject(text, []);
        setParsedMessages(res);
        setJsonInput(
          typeof res === "object" ? JSON.stringify(res, null, 2) : res,
        );

        message.success("得分报告已生成");
      } catch (innerErr) {
        message.error("提交失败，请重试");
        console.error("生成报告失败：", innerErr);
        throw innerErr; // 抛出错误让外层 catch 处理（如果需要）
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Spin spinning={loading}>
      <div className="w-full h-screen flex flex-col bg-slate-50 text-slate-900 overflow-hidden">
        {/* 顶部导航 */}
        <header className="h-16 shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Zap size={20} />
            </div>
            <div>
              <h1 className="font-semibold text-slate-800">
                A2UI 可视化编辑器
              </h1>
              <p className="text-xs text-slate-500">JSON → UI 实时预览</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFormat}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Code size={16} />
              格式化
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw size={16} />
              重置
            </button>
            <button
              onClick={handleRender}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-lg shadow-blue-200"
            >
              <Play size={16} />
              渲染
            </button>
          </div>
        </header>

        {/* 主体两栏区域 */}
        <main className="flex-1 flex overflow-hidden">
          {/* 左侧：JSON 编辑器 */}
          <div className="w-1/2 flex flex-col border-r border-slate-200 bg-white">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
              <h2 className="font-medium text-slate-700 flex items-center gap-2">
                <Code size={16} />
                JSON 输入
              </h2>
            </div>
            <div className="flex-1 relative">
              <textarea
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                }}
                className="w-full h-full p-4 font-mono text-sm text-slate-800 bg-slate-50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 custom-scrollbar"
                placeholder="在此输入 A2UI JSON 数据..."
                spellCheck={false}
              />
              {renderError && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-red-50 border-t border-red-200">
                  <p className="text-sm text-red-600 font-medium">解析错误：</p>
                  <p className="text-sm text-red-500 mt-1">{renderError}</p>
                </div>
              )}
            </div>
          </div>

          {/* 右侧：A2UI 渲染预览 */}
          <div className="w-1/2 flex flex-col bg-slate-100">
            <div className="px-4 py-3 border-b border-slate-200 bg-white">
              <h2 className="font-medium text-slate-700 flex items-center gap-2">
                <Zap size={16} />
                UI 预览
              </h2>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <TestWrapper theme={litTheme} onAction={handleSubmit}>
                {parsedMessages ? (
                  <A2UIRenderWrap messages={parsedMessages} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <Zap size={48} className="mb-4 opacity-50" />
                    <p className="text-sm">点击"渲染"按钮查看效果</p>
                  </div>
                )}
              </TestWrapper>
            </div>
          </div>
        </main>
      </div>
    </Spin>
  );
}
