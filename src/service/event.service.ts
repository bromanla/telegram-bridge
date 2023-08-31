import { EmitterService } from '#src/common/emitter.instance.js';

/* Telegram events */
export type TelegramBaseChatEvent =
  | { isChat: true; chatId: number; chatTitle: string }
  | { isChat: false };

export type TelegramBaseEvent = {
  handler: 'telegram';
  senderId: number;
  fullName: string;

  text?: string;
  extra: Array<string | { text: string; url: string }>;

  isGroup: boolean;
} & TelegramBaseChatEvent;

export type TelegramEvent = {
  'telegram:sendText': TelegramBaseEvent & {
    text: string;
  };
  'telegram:sendImage': TelegramBaseEvent & {
    url: string[];
  };
  'telegram:sendVoice': TelegramBaseEvent & {
    url: string;
  };
  'telegram:sendSticker': TelegramBaseEvent & {
    url: string;
  };
};

/* Vk events */
export type VkBaseEvent = {
  handler: 'vk';
  peerId: number;

  text?: string;
};

export type VkEvent = {
  'vk.sendText': VkBaseEvent & {
    text: string;
  };
  'vk.sendVoice': VkBaseEvent & {
    url: string;
  };
  'vk.sendImage': VkBaseEvent & {
    url: string;
  };
  'vk.sendGraffiti': VkBaseEvent & {
    url: string;
  };
};

export type Event = TelegramEvent & VkEvent;

export class EventService extends EmitterService<Event> {}
