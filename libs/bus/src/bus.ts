import { AckPolicy, connect, headers, JSONCodec, NatsError } from "nats";
import { catchError, logger, requiredEnv } from "@bridge/common";
import { MAX_MESSAGES } from "./constant.ts";

import type {
  Consumer,
  JetStreamClient,
  JetStreamManager,
  JsMsg,
  NatsConnection,
} from "nats";
import type {
  BusStore,
  BusStream,
  BusSubject,
  GroupByStream,
} from "./types.ts";

const connectionString = requiredEnv("NATS_URL", { default: "localhost" });

export class BusService {
  private connection: NatsConnection;
  private client: JetStreamClient;
  private manager: JetStreamManager;

  private readonly codec = JSONCodec<any>();

  private readonly streams: GroupByStream<BusStore> = {
    messages: ["messages.audio", "messages.video"],
    "notification": ["notification.warn"],
  };

  private async setupStreams() {
    for (const [name, subjects] of Object.entries(this.streams)) {
      await this.manager.streams.add({
        name,
        subjects,
        max_msgs: MAX_MESSAGES,
      });
    }
  }

  public async purge() {
    const streams = await this.manager.streams.list().next();

    for (const { config: { name: stream } } of streams) {
      const consumers = await this.manager.consumers.list(stream).next();
      for (const consumer of consumers) {
        await this.manager.consumers.delete(stream, consumer.name);

        logger.debug("Delete bus consumer", {
          consumer: consumer.name,
          stream,
        });
      }

      await this.manager.streams.delete(stream);
      logger.debug("Delete bus stream", { stream });
    }
  }

  async launch(options?: { purge?: boolean }) {
    this.connection = await connect({ servers: connectionString });
    this.manager = await this.connection.jetstreamManager();
    this.client = this.connection.jetstream();

    if (options?.purge) await this.purge();

    await this.setupStreams();

    logger.info("success launch", {
      service: BusService.name,
    });
  }

  publish<S extends BusStore["subject"]>(
    subject: S,
    message: BusSubject<S>["data"],
    headers?: Record<string, string>,
  ) {
    return this.client.publish(subject, this.codec.encode(message), {
      headers: this.createHeaders(headers),
    });
  }

  public async getConsumer(
    stream: BusStore["stream"],
    consumer: string,
  ): Promise<Consumer> {
    const [error, client] = await catchError(
      this.client.consumers.get(stream, consumer),
    );

    if (error) {
      // 10014 - consumer not found
      if (error instanceof NatsError && error.api_error?.err_code === 10014) {
        await this.manager.consumers.add(stream, {
          durable_name: consumer,
          filter_subjects: this.streams[stream],
          ack_policy: AckPolicy.Explicit,
        });

        return this.getConsumer(stream, consumer)!;
      }

      throw error;
    }

    return client;
  }

  async consume<S extends BusStore["stream"]>(
    stream: S,
    consumer: string,
    fn: (
      message: JsMsg,
      data: BusStream<S>["data"],
    ) => Promise<void> | void,
  ) {
    const client = await this.getConsumer(stream, consumer);
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

  private createHeaders(rawHeaders: Record<string, string> = {}) {
    const createdHeaders = headers();

    for (const [key, value] of Object.entries(rawHeaders)) {
      createdHeaders.append(key, value);
    }

    return createdHeaders;
  }
}
