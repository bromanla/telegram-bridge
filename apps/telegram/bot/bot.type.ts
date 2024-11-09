import type { I18nFlavor } from "@grammyjs/i18n";
import type { Context, SessionFlavor } from "grammy";
import { Forum } from "@bridge/store";

export type SessionData = {
  // TODO: peerId
  __language_code?: "ru" | "en";
};

export interface LocalStorage {
  forum: Forum;
}

export type BotContext = Context & I18nFlavor & SessionFlavor<SessionData>;
