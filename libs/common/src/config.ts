import z from "zod";

export const isDevelopment = Deno.env.get("NODE_ENV") === "development";

export const config = {
  isDevelopment,
};

function defaultMessage(message: string) {
  return {
    errorMap: (() => ({ message })),
  };
}

function getEnv<T extends string | number>(
  env: string,
  schemaFactory: (params: z.RawCreateParams) => z.ZodType<T>,
  fallback?: T,
) {
  const params = defaultMessage(`Required ${env}`);
  const baseSchema = schemaFactory(params);
  const schema = typeof fallback === "undefined"
    ? baseSchema
    : baseSchema.default(fallback);

  return schema.parse(Deno.env.get(env));
}

export function getStringEnv(env: string, fallback?: string) {
  return getEnv(env, (params) => z.string(params).min(1), fallback);
}

export function getNumberEnv(env: string, fallback?: number) {
  return getEnv(env, (params) => z.coerce.number(params), fallback);
}
