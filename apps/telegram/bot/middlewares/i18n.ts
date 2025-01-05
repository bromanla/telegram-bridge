import { I18n } from "@grammyjs/i18n";
import type { BotContext } from "#src/bot/bot.type.ts";

export const defaultLocale = "en";

export const i18n = new I18n<BotContext>({
  defaultLocale,
  directory: "locales",
});
