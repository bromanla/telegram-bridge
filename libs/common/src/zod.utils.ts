import z from "zod";

export function zDefaultMessage(message: string) {
  return {
    errorMap: (() => ({ message })),
  };
}

export function requiredEnv(env: string, options?: { default?: string }) {
  const params = zDefaultMessage(`Required ${env}`);
  const schema = z.string(params).min(0);

  if (options?.default) {
    schema.default(options.default);
  }

  return schema.parse(Deno.env.get(env));
}
