import type { BusOptions } from "@bridge/bus";

export type BusData =
  /**
   * Messages from other Telegram services
   */
  | {
    stream: "messages";
    subject: "messages.telegram";
    type: {
      isChat: boolean;
      // chatId: number;
      // fullName: string;
      // chatTitle: string;
      // extra: Array<string>;
    };
  }
  | {
    stream: "messages";
    subject: "messages.vk";
    type: {
      stringData: string;
    };
  };

export const CONSUMERS = Object.freeze({
  TELEGRAM: "telegram#consumer",
  VK: "vk#consumer",
});

export const BUS_OPTIONS = Object.freeze(
  {
    streams: [
      {
        name: "messages",
        subjects: ["messages.telegram", "messages.vk"],
      },
    ],
    consumers: [
      {
        name: CONSUMERS.TELEGRAM,
        stream: "messages",
        subjects: ["messages.telegram"],
      },
      {
        name: CONSUMERS.VK,
        stream: "messages",
        subjects: ["messages.vk"],
      },
    ],
  } satisfies BusOptions<BusData>,
);
