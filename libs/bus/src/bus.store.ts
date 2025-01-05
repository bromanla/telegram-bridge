import type { Chat, User } from "@bridge/store";

type Base = {
  user: User & { full_name: string };
  chat?: Chat;
};

export type Unsupported = { text: string; url?: string };

export type Message =
  & Base
  & (
    | {
      type: "text";
      text: string;
      unsupported: Unsupported[];
    }
    | { type: "image"; urls: string[] }
    | { type: "audio"; url: string }
    | { type: "voice"; url: string }
    | { type: "sticker"; url: string }
  );

/**
 * Human-readable type structure for the broker
 */
export type Store = {
  "message": {
    telegram: Message;
    vk: Message;
  };
  "notification": {
    "warn": {
      message: string;
    };
  };
};
