import type { I18nFlavor } from "@grammyjs/i18n";
import type { Context, SessionFlavor } from "grammy";
import type { Forum } from "@bridge/store";
import type { ParseModeFlavor } from "@grammyjs/parse-mode";

export type SessionData = {
  // TODO: peerId
  __language_code?: "ru" | "en";
};

export interface LocalStorage {
  forum: Forum;
}

export type BotContext =
  & ParseModeFlavor<Context>
  & I18nFlavor
  & SessionFlavor<SessionData>;
