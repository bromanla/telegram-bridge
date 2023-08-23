import { EmitterService } from '#src/common/emitter.instance.js';

export type EventChat =
  | { isChat: true; chatId: number; chatTitle: string }
  | { isChat: false };

export type EventBase = {
  handler: 'telegram';
  senderId: number;
  fullName: string;

  text?: string;
  extra?: string;

  isGroup: boolean;
} & EventChat;

export type EventVkBase = {
  handler: 'vk';
  peerId: number;

  text?: string;
};

export type Event = {
  'telegram:sendText': EventBase & {
    text: string;
  };
  'telegram:sendImage': EventBase & {
    url: string[];
  };
  'telegram:sendVoice': EventBase & {
    url: string;
  };
  'telegram:sendSticker': EventBase & {
    url: string;
  };
  'vk.sendText': EventVkBase & {
    text: string;
  };
  'vk.sendVoice': EventVkBase & {
    url: string;
  };
  'vk.sendImage': EventVkBase & {
    url: string;
  };
  'vk.sendGraffiti': EventVkBase & {
    url: string;
  };
};

export class EventService extends EmitterService<Event> {}
