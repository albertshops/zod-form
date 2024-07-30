import { z } from "zod";

export function stringTo<
  T extends z.ZodType<any, z.ZodTypeDef, number | Date | undefined>,
>(schema: T) {
  return z
    .string()
    .transform((string) => {
      if (string == "") return undefined;

      const root = (function rootSchema(schema: z.ZodTypeAny) {
        if (schema._def.hasOwnProperty("innerType"))
          return rootSchema(schema._def.innerType);
        if (schema._def.hasOwnProperty("schema"))
          return rootSchema(schema._def.schema);
        return schema;
      })(schema);

      if (root._def.typeName == "ZodNumber") {
        const parsed = parseFloat(string);
        if (string.trim() !== parsed.toString()) return NaN;
        return parsed;
      }

      if (root._def.typeName == "ZodDate") {
        const [d, m, y] = string.split("/");
        const day = parseInt(d);
        const monthIndex = parseInt(m) - 1;
        const year = parseInt(y);
        return new Date(year, monthIndex, day);
      }
    })
    .pipe(schema);
}

