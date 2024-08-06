import { z } from "zod";

type FieldPath<T, Prefix extends string = ""> = {
  [K in keyof T]: T[K] extends object
    ? `${Prefix}${K & string}.${FieldPath<T[K]>}`
    : `${Prefix}${K & string}`;
}[keyof T] extends infer D
  ? Extract<D, string>
  : never;

export function toMessages<T>(parsed: z.SafeParseReturnType<T, any>) {
  const messages: Record<FieldPath<T>, string> = {};
  if (parsed.success) return messages;

  parsed.error.issues.forEach((issue) => {
    const path = issue.path.join(".") as FieldPath<T>;
    if (path in messages) {
      messages[path].push(issue.message);
    } else {
      messages[path] = [issue.message];
    }
  });

  return messages;
}
