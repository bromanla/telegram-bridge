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

type OptionalKey<T, K extends keyof T> = T extends { type: infer U }
  ? { type: U } & Omit<T, K> & Partial<Pick<T, K>>
  : T;

/**
 * Human-readable type structure for the broker
 */
export type Store = {
  "message": {
    telegram: Message;
    vk: OptionalKey<Message, "user">;
  };
  "notification": {
    "warn": {
      message: string;
    };
  };
};
