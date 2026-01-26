// 重试兜底
export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: {
    retries?: number;
    onRetry?: (count: number, error: unknown) => void;
  },
): Promise<T> {
  const retries = options?.retries ?? 2;

  let lastError: unknown;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      options?.onRetry?.(i + 1, err);
    }
  }

  throw lastError;
}
