// import {
//   AckPolicy,
//   connect,
//   headers,
//   JetStreamClient,
//   JetStreamManager,
//   JsMsg,
//   JSONCodec,
//   NatsConnection,
// } from "nats";
// import { logger } from "@bridge/common";
// import { MAX_MESSAGES } from "./constant.ts";

// export class BusService {
//   private _connection: NatsConnection;
//   private _client: JetStreamClient;
//   private _manager: JetStreamManager;

//   readonly url: string;
//   readonly codec = JSONCodec();

//   private readonly streams = [
//     {
//       name: "messages",
//       subjects: ["messages.telegram", "messages.vk"],
//     },
//   ];

//   private readonly consumers = [
//     {
//       name: "telegram#consumer",
//       stream: "messages",
//       subjects: ["messages.telegram"],
//     },
//     {
//       name: "vk#consumer",
//       stream: "messages",
//       subjects: ["messages.vk"],
//     },
//   ];

//   constructor() {
//     this.url = Deno.env.get("NATS_URL") ?? "localhost";
//   }

//   async launch() {
//     this._connection = await connect({ servers: this.url });
//     this._manager = await this._connection.jetstreamManager();
//     this._client = this._connection.jetstream();

//     await this._setupStreams();
//     await this._setupConsumers();

//     logger.info("success launch", {
//       service: BusService.name,
//     });
//   }

//   async publish<S extends BusData["subject"]>(
//     stream: S,
//     message: Extract<BusData, { subject: S }>["type"],
//     headers?: Record<string, string>,
//   ) {
//     await this._client.publish(stream, this.codec.encode(message), {
//       headers: this._prepareHeaders(headers),
//     });
//   }

//   async consume<S extends BusData["stream"]>(
//     stream: S,
//     consumer: string,
//     fn: (
//       message: JsMsg,
//       data: Extract<BusData, { stream: S }>["type"],
//     ) => Promise<void> | void,
//   ) {
//     const client = await this._client.consumers.get(String(stream), consumer);
//     const messages = await client.consume({ max_messages: 1 });

//     for await (const message of messages) {
//       try {
//         const data = this.codec.decode(message.data);
//         await fn(message, data);
//         message.ack();
//       } catch {
//         message.nak();
//       }
//     }
//   }

//   private async _setupStreams() {
//     for (const stream of this.streams) {
//       await this._manager.streams.add({
//         name: stream.name,
//         subjects: stream.subjects,
//         max_msgs: MAX_MESSAGES,
//       });
//     }
//   }

//   private async _setupConsumers() {
//     for (const consumer of this.consumers) {
//       await this._manager.consumers.add(consumer.stream, {
//         durable_name: consumer.name,
//         filter_subjects: consumer.subjects,
//         ack_policy: AckPolicy.Explicit,
//       });
//     }
//   }

//   private _prepareHeaders(rawHeaders?: Record<string, string>) {
//     const preparedHeaders = headers();
//     if (!rawHeaders) return preparedHeaders;
//     for (const [key, value] of Object.entries(rawHeaders)) {
//       preparedHeaders.append(key, value);
//     }
//     return preparedHeaders;
//   }
// }

// // Типы данных для BusService
// type BusData =
//   | {
//     stream: "messages";
//     subject: "messages.telegram";
//     type: {
//       isChat: boolean;
//       chatId: number;
//       fullName: string;
//       chatTitle: string;
//       extra: Array<string>;
//     };
//   }
//   | {
//     stream: "messages";
//     subject: "messages.vk";
//     type: {
//       stringData: string;
//     };
//   };
