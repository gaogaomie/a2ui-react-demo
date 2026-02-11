//调用接口 json合法校验和重试
import { createLLMClient } from "../llm/client"; //generateGeminiContent
import { safeParseJSON } from "../llm/jsonGuard";
import { buildSystemPrompt } from "../llm/prompts";
import { withRetry } from "../llm/retry";

// deepseek.com接口示例
export const llm = createLLMClient({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.API_KEY,
  model: "deepseek-chat",
});

// 火山引擎接口示例
// const llm = createLLMClient({
//   baseURL: "https://ark.cn-beijing.volces.com/api/v3",
//   apiKey: process.env.VE_API_KEY,
//   model: "doubao-seed-code-preview-251028",
// });

export async function generateProject(userPrompt: string, history: any[]) {
  return withRetry(
    async () => {
      const content = await llm([
        {
          role: "system",
          content: buildSystemPrompt(),
        },
        {
          role: "user",
          content: userPrompt,
        },
      ]);

      const result = safeParseJSON(content);

      if (!result.ok) {
        throw new Error("Invalid JSON from LLM");
      }

      // 最低限度 schema 兜底
      if (!result.data || typeof result.data !== "object") {
        throw new Error("Schema is not an object");
      }

      return result.data;
    },
    {
      retries: 2,
      onRetry: (count, err) => {
        console.warn(`LLM retry ${count}`, err);
      },
    },
  );
}
