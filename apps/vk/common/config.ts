import { z } from "zod";
import { config as defaultConfig } from "@bridge/common";

const tokenScheme = z.string().min(0);

export const config = {
  ...defaultConfig,
  token: tokenScheme.parse(Deno.env.get("VK_TOKEN")),
};
