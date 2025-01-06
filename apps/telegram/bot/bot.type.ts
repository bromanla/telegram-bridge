import type { I18nFlavor } from "@grammyjs/i18n";
import type { Context, SessionFlavor } from "grammy";
import type { Chat, Forum, User } from "@bridge/store";
import type { ParseModeFlavor } from "@grammyjs/parse-mode";

export type SessionData = {
  // TODO: peerId
  __language_code?: "ru" | "en";
};

export interface LocalStorage {
  forum: Forum;
  user?: User;
  chat?: Chat;
}

export type BotContext =
  & ParseModeFlavor<Context>
  & I18nFlavor
  & SessionFlavor<SessionData>;
