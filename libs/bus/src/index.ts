export * from '#src/bus.constant.js';
export * from '#src/bus.service.js';
export * from '#src/bus.type.js';

// import { BusService } from '#src/bus.service.js';
// import { setTimeout } from 'timers/promises';

// type Bromanla =
//   | {
//       stream: 'messages';
//       subject: 'messages.head';
//       type: {
//         _type: 'a';
//         numberData: number;
//       };
//     }
//   | {
//       stream: 'messages';
//       subject: 'messages.vk';
//       type: {
//         _type: 'b';
//         stringData: string;
//       };
//     }
//   | {
//       stream: 'system';
//       subject: 'system.command';
//       type: {
//         _type: 'c';
//         data: boolean;
//       };
//     };

// const bus = new BusService<Bromanla>({
//   streams: [
//     {
//       name: 'messages',
//       subjects: ['messages.head', 'messages.vk'],
//     },
//     {
//       name: 'system',
//       subjects: ['system.command'],
//     },
//   ],
//   consumers: [
//     {
//       name: 'head_consumer',
//       stream: 'messages',
//       subjects: ['messages.vk'],
//     },
//   ],
// });

// await bus.launch();
// await setTimeout(3000);

// bus.consume('messages', 'head_consumer', (message, data) => {
//   console.log(data);
// });

// bus.publish('messages.vk', { _type: 'b', stringData: '2' });
// bus.publish('messages.vk', { _type: 'b', stringData: '3' });
