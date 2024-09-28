import { BusService } from '#src/bus.service.js';

type BusStream = ['messages', 'system'];
interface BusData {
  messages:
    | {
        _type: 'a';
        numberData: number;
      }
    | {
        _type: 'b';
        stringData: string;
      };
  system: {
    _type: 'a';
    data: boolean;
  };
}

const bus = new BusService<BusStream, BusData>({
  streams: [
    { name: 'messages', subjects: ['messages.head', 'messages.vk'] as const },
  ],
  consumers: [
    {
      name: 'head_consumer',
      stream: 'messages',
      subjects: ['messages.head'],
    },
  ],
});

// bus.publish('system', { data: true });
