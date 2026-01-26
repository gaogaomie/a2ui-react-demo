// openai-compatible调用分钟
import axios from "axios";

export interface ChatMessage {
  role: "system" | "user";
  content: string;
}

export interface LLMClientOptions {
  baseURL: string;
  apiKey: string;
  model: string;
}

export function createLLMClient(options: LLMClientOptions) {
  const instance = axios.create({
    baseURL: options.baseURL,
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
    },
  });

  return async function chat(messages: ChatMessage[]) {
    const res = await instance.post("/chat/completions", {
      model: options.model,
      messages,
      temperature: 0.3,
      response_format: {
        type: "json_object",
      },
    });

    return res.data.choices[0].message.content as string;
  };
}
