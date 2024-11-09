import { z } from "zod";
import { config as defaultConfig } from "@bridge/common";

const tokenScheme = z.string().min(0);
const chatIdScheme = z.coerce.number();

export const config = {
  ...defaultConfig,
  chatId: chatIdScheme.parse(Deno.env.get("TELEGRAM_CHAT_ID")),
  token: tokenScheme.parse(Deno.env.get("TELEGRAM_TOKEN")),
};
