import type { Chat, User } from "@bridge/store";
import type { Unsupported } from "@bridge/bus";

export interface AsyncContext {
  user: User & { full_name: string };
  chat?: Chat;

  event: {
    text?: string;
  };

  unsupported: Unsupported[];
}

export type NextFunction = () => void;
