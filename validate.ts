import { z } from "zod";
import { toMessages } from "./toMessages"

export function validate<T extends z.ZodTypeAny>(schema: T, data: unknown) {
  const output = schema.safeParse(data) as z.SafeParseReturnType<
    typeof data,
    z.infer<T>
  >;

  const messages = toMessages(output);

  return {
    ...output,
    messages,
  };
}
