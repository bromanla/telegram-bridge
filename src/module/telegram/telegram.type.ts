import type { Context, SessionFlavor } from 'grammy';

export type BotContext = Context &
  SessionFlavor<{}> & {
    peerId: number;
  };
