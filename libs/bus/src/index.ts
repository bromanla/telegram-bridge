import {
  connect,
  JSONCodec,
  headers,
  AckPolicy,
  DeliverPolicy,
  RetentionPolicy,
} from 'nats';

import type { Codec, NatsConnection } from 'nats';

export class BusService {
  public readonly url: string;
  public readonly codec: Codec<unknown>;
  private _connection: NatsConnection;

  constructor() {
    this.url = process.env.NATS_URL ?? 'localhost';
    this.codec = JSONCodec();
  }

  async launch() {
    this._connection = await connect({ servers: this.url });
    const manager = await nc.jetstreamManager();
  }
}

const sc = JSONCodec();
const nc = await connect({ servers: '192.168.0.129' });
const jsm = await nc.jetstreamManager();

const streams = await jsm.streams.list().next();
// console.log(streams);

const stream = 'message';
// const subj = `message.*`;

// Список слушателей
const consumers = await jsm.consumers.list(stream).next();
console.warn(`consumers: ${consumers.map(({ name }) => name)}`);

// Регистрация слушателя
// await jsm.consumers.add(stream, {
//   durable_name: 'bromanla',
//   ack_policy: AckPolicy.Explicit,
// });
//

// Удаление слушателя
// await jsm.consumers.delete(stream, 'SH39W7SOS2SYFHSEQHX79A_1');

// await jsm.streams.add({
//   name: stream, subjects: [subj],
//   retention: RetentionPolicy.Workqueue
// });

// Очистить топик от сообщений
// await jsm.streams.purge(stream);

// for await (const si of jsm.streams.list()) {
//   console.log(si);
// }

const js = nc.jetstream();
await js.publish('message.telegram', sc.encode({ json: false }));

// console.table({
//   stream: pa.stream,
//   seq: pa.seq,
//   duplicate: pa.duplicate,
// });

// Слушатель

// retrieve an existing consumer
// const client_1 = await js.consumers.get(stream);

// getting an ordered consumer requires no name
// as the library will create it
// const client_2 = await js.consumers.get(stream);

// const messages = await client_1.consume({ max_messages: 1 });
// for await (const m of messages) {
//   console.log(m.seq);
//   m.ack();
// }
