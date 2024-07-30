import { z } from "zod";

export function toMessages<T>(parsed: z.SafeParseReturnType<any, T>) {
  const messages: Record<string, string> = {};
  if (parsed.success) return messages;

  parsed.error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    messages[path] = issue.message;
  });

  return messages;
}

