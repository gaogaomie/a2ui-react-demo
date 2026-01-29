import ChatMessage from "@/components/ChatMessage";
import { ChatMessage as ChatMessageType } from "@/types";
import { Bot, Cpu, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { initializeDefaultCatalog } from "./registry/defaultCatalog";
// import { generateProject1 } from "./services/a2UIGeminiService";
import { generateProject } from "./services/a2UIService";

initializeDefaultCatalog();

const INITIAL_MESSAGE: ChatMessageType = {
  id: "welcome",
  role: "system",
  text: "你好！我是您的智能助手。",
  timestamp: new Date(),
};

export default function App() {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    INITIAL_MESSAGE,
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  /** 自动滚动到底部 */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessageType = {
      id: Date.now().toString(),
      role: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const res = await generateProject(text, history);
      // const res = await generateProject1(text, []);
      console.log(res, "res");
      const result = typeof res === "string" ? JSON.parse(res) : res;
      console.log(result, "result");
      const aiMsg: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: "system",
        text: result.message,
        ui: result.ui,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (data: any) => {
    const formattedData = Object.entries(data)
      .map(([key, val]) => `${key}: ${val}`)
      .join(", ");
    handleSendMessage(`表单已提交：${formattedData}`);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-slate-50 text-slate-900 overflow-hidden">
      {/* 顶部导航 */}
      <header className="h-16 shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="lg:hidden w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Cpu size={18} />
          </div>
          <h2 className="font-semibold text-slate-800">对话会话</h2>
        </div>
      </header>

      {/* 主体区域 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 中间：唯一可滚动区域 */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 md:px-8 py-8 scroll-smooth"
        >
          <div className="w-full space-y-4">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onAction={(a, b, c) => {
                  console.log(a, b, c);
                }}
                onFormSubmit={handleFormSubmit}
              />
            ))}

            {isLoading && (
              <div className="flex gap-3 items-start">
                {/* AI 头像占位 */}
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
                  <Bot size={20} className="text-blue-500" />
                </div>

                {/* Loading 内容 */}
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    {/* 转圈 Spinner */}
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
                    <span>生成中</span>
                  </div>
                  {/* 轻量占位，保留空间但不迷惑 */}
                  <div className="flex gap-3 animate-pulse">
                    <div className="space-y-2 mt-2">
                      <div className="h-6 w-48 bg-slate-300 rounded" />
                      <div className="h-8 w-50 bg-slate-200 rounded-xl" />
                      <div className="h-10 w-52 bg-slate-100 rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 底部输入区（固定，不滚） */}
        <div className="shrink-0 p-4 md:p-6 bg-white border-t border-slate-200">
          <div className="w-full relative group">
            <div className="absolute inset-0 bg-blue-400 blur-xl opacity-0 group-focus-within:opacity-10 transition-opacity" />

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="relative flex items-center bg-slate-100 border border-slate-200 rounded-2xl px-4 py-2 transition-all focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-2xl focus-within:shadow-blue-100"
            >
              <input
                type="text"
                placeholder="请输入你的想法……"
                className="flex-1 bg-transparent py-3 px-2 outline-none text-slate-800 placeholder:text-slate-400"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="ml-2 p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-slate-300 disabled:shadow-none transition-all active:scale-95"
              >
                <Send size={20} />
              </button>
            </form>

            <div className="mt-2 text-[10px] text-center text-slate-400">
              按回车发送消息。回复将以结构化的 A2UI JSON 格式生成。
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
