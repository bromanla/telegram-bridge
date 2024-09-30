import type { BusOptions } from '@bridge/bus';

export type BusData =
  | {
      stream: 'messages';
      subject: 'messages.head';
      type: {
        numberData: number;
      };
    }
  | {
      stream: 'messages';
      subject: 'messages.vk';
      type: {
        stringData: string;
      };
    }
  | {
      stream: 'system';
      subject: 'system.command';
      type: {
        data: boolean;
      };
    };

export const BUS_CONSUMERS = {
  HEAD: 'head_consumer',
};

export const BUS_OPTIONS: BusOptions<BusData> = {
  streams: [
    {
      name: 'messages',
      subjects: ['messages.head', 'messages.vk'],
    },
    {
      name: 'system',
      subjects: ['system.command'],
    },
  ],
  consumers: [
    {
      name: BUS_CONSUMERS.HEAD,
      stream: 'messages',
      subjects: ['messages.vk'],
    },
  ],
};
