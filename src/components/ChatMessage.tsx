import A2UIRenderWrap, { TestWrapper } from "@/components/A2UIRenderWrap";
import { litTheme } from "@/theme/litTheme";
import { ChatMessage as ChatMessageType } from "@/types";
import { Bot, Clock, Code, Eye, User } from "lucide-react";
import React from "react";

interface Props {
  message: ChatMessageType;
  onAction: (val: string) => void;
  onFormSubmit: (data: any) => void;
}

const ChatMessage: React.FC<Props> = ({ message }) => {
  const [viewMode, setViewMode] = React.useState<"ui" | "json">("ui");
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-8 group animate-in fade-in slide-in-from-bottom-4 duration-300`}
    >
      <div
        className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${isUser ? "flex-row-reverse" : "flex-row"}`}
      >
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${isUser ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white border border-slate-200 text-slate-400"}`}
        >
          {isUser ? (
            <User size={20} />
          ) : (
            <Bot size={20} className="text-blue-500" />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div
            className={`flex items-center gap-2 mb-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}
          >
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              {isUser ? "You" : "AI"}
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock size={10} />{" "}
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div
            className={`relative px-5 py-4 rounded-2xl ${isUser ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border border-slate-200 rounded-tl-none shadow-sm"}`}
          >
            {!isUser && message.ui && (
              <button
                onClick={() => setViewMode((v) => (v === "ui" ? "json" : "ui"))}
                className="absolute -top-3 -right-3 p-1.5 bg-slate-800 text-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:scale-110 active:scale-95"
                title={viewMode === "ui" ? "View JSON" : "View UI"}
              >
                {viewMode === "ui" ? <Code size={14} /> : <Eye size={14} />}
              </button>
            )}

            {viewMode === "ui" ? (
              <div className="flex flex-col gap-4">
                <p
                  className={`text-base leading-relaxed ${isUser ? "text-white" : "text-slate-800"}`}
                >
                  {message.text}
                </p>
                <TestWrapper
                  theme={litTheme}
                  onAction={(a) => {
                    console.log(a, "provider点击事件");
                  }}
                >
                  {!isUser && message.ui && (
                    <A2UIRenderWrap
                      messages={message.ui}
                      // messageId={message.id}
                      onAction={(a) => {
                        console.log(a, "点击事件");
                      }}
                      key={message.id}
                    />
                  )}
                </TestWrapper>
              </div>
            ) : (
              <pre className="text-[11px] font-mono overflow-auto  bg-slate-900 text-green-400 p-4 rounded-xl custom-scrollbar">
                {JSON.stringify(message.ui, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
