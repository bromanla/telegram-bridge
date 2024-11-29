import type { Chat, User } from "@bridge/store";

type Base = {
  user: User;
  chat?: Chat;
};

type Message =
  & Base
  & (
    | {
      type: "text";
      text: string;
      extra: Array<string | { text: string; url: string }>;
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
