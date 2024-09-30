import { BusService } from '@bridge/bus';
import { BUS_OPTIONS } from '@bridge/contract';

import type { BusData } from '@bridge/contract';

const bus = new BusService<BusData>(BUS_OPTIONS);

await bus.launch();

import { setTimeout } from 'timers/promises';

await setTimeout(3000);

bus.consume('messages', 'head_consumer', (message, data) => {
  console.log(data);
});

bus.publish('messages.vk', { stringData: '2' });
bus.publish('messages.vk', { stringData: '3' });
