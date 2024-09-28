import { connect, JSONCodec, StringCodec, headers } from 'nats';

const sc = StringCodec();
const nc = await connect({ servers: '192.168.0.129' });

const js = nc.jetstream();

const consumer = 'vk_consumer';

console.warn(`consumer: ${consumer}`);

const client = await js.consumers.get('messages', consumer);
const messages = await client.consume({ max_messages: 1 });

for await (const m of messages) {
  console.log('---');
  console.log(m.seq);
  console.log(sc.decode(m.data));
  m.ack();
}
