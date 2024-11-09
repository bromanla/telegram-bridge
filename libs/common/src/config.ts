export const isDevelopment = Deno.env.get("NODE_ENV") === "development";

export const config = {
  isDevelopment,
};
