import type { Chat, User } from "@bridge/store";

export interface AsyncContext {
  user: User;
  chat?: Chat;

  event: {
    text?: string;
  };
}

export type NextFunction = () => void;
