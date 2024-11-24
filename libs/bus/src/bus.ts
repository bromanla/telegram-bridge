import { z } from "zod";
import { connect, headers, JSONCodec } from "nats";
import { logger } from "@bridge/common";

import type {
  AckPolicy,
  JetStreamClient,
  JetStreamManager,
  JsMsg,
  NatsConnection,
} from "nats";

import { MAX_MESSAGES } from "./constant.ts";
import type {
  BusStore,
  BusStream,
  BusSubject,
  GroupByStream,
} from "./types.ts";

const connectionString = z.string().default("localhost").parse(
  Deno.env.get("NATS_URL"),
);

export class BusService {
  private connection: NatsConnection;
  private client: JetStreamClient;
  private manager: JetStreamManager;

  readonly codec = JSONCodec<any>();

  private readonly streams: GroupByStream<BusStore> = {
    messages: ["messages.audio", "messages.video"],
    "notification": ["notification.warn"],
  };

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

  private async setupStreams() {
    for (const [name, subjects] of Object.entries(this.setupStreams)) {
      await this.manager.streams.add({
        name,
        subjects,
        max_msgs: MAX_MESSAGES,
      });
    }
  }

  async launch() {
    this.connection = await connect({ servers: connectionString });
    this.manager = await this.connection.jetstreamManager();
    this.client = this.connection.jetstream();

    await this.setupStreams();

    logger.info("success launch", {
      service: BusService.name,
    });
  }

  publish<S extends BusStore["subject"]>(
    subject: S,
    message: BusSubject<S>,
    headers?: Record<string, string>,
  ) {
    return this.client.publish(subject, this.codec.encode(message), {
      headers: this.prepareHeaders(headers),
    });
  }

  async consume<S extends BusStore["stream"]>(
    stream: S,
    consumer: string,
    fn: (
      message: JsMsg,
      data: BusStream<S>["data"],
    ) => Promise<void> | void,
  ) {
    const client = await this.client.consumers.get(String(stream), consumer);
    const messages = await client.consume({ max_messages: 1 });

    for await (const message of messages) {
      try {
        const data = this.codec.decode(message.data);
        await fn(message, data);

        message.ack();
      } catch {
        message.nak();
      }
    }
  }

  //   private async _setupConsumers() {
  //     for (const consumer of this.consumers) {
  //       await this._manager.consumers.add(consumer.stream, {
  //         durable_name: consumer.name,
  //         filter_subjects: consumer.subjects,
  //         ack_policy: AckPolicy.Explicit,
  //       });
  //     }
  //   }

  private prepareHeaders(rawHeaders?: Record<string, string>) {
    const preparedHeaders = headers();
    if (!rawHeaders) return preparedHeaders;

    for (const [key, value] of Object.entries(rawHeaders)) {
      preparedHeaders.append(key, value);
    }

    return preparedHeaders;
  }
}
