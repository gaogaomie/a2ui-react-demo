// json清洗+解析+校验
export function cleanLLMOutput(text: string): string {
  return text
    .trim()
    .replace(/^```json/, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();
}

export function safeParseJSON(text: string): {
  ok: boolean;
  data?: any;
  error?: Error;
} {
  try {
    const cleaned = cleanLLMOutput(text);
    const data = JSON.parse(cleaned);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err as Error };
  }
}
