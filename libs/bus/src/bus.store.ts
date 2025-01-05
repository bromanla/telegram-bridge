import type { Chat, User } from "@bridge/store";

type Base = {
  user: User;
  chat?: Chat;
  text?: string;
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
    | { type: "voice"; url: string }
    | { type: "sticker"; url: string }
  );

type OptionalUser<T extends { user: any }> =
  & Omit<T, "user">
  & Partial<Pick<T, "user">>;

/**
 * Human-readable type structure for the broker
 */
export type Store = {
  "message": {
    telegram: Message;
    vk: Message & { test: 1 };
  };
  "notification": {
    "warn": {
      message: string;
    };
  };
};

// TODO: handle OptionalUser type
