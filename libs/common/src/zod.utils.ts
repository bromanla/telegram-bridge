import z from "zod";

function zDefaultMessage(message: string) {
  return {
    errorMap: (() => ({ message })),
  };
}

export function requiredEnv(env: string, options?: { default?: string }) {
  const params = zDefaultMessage(`Required ${env}`);

  const baseSchema = z.string(params).min(0);
  const schema = options?.default
    ? baseSchema.default(options.default)
    : baseSchema;

  return schema.parse(Deno.env.get(env));
}
