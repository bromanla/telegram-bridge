import { AckPolicy, connect, headers, JSONCodec } from "nats";
import { logger } from "@bridge/common";
import { MAX_MESSAGES } from "./constant.ts";

import type { BusConfigBase, BusOptions } from "./types.ts";
import type {
  Codec,
  JetStreamClient,
  JetStreamManager,
  JsMsg,
  NatsConnection,
} from "nats";

export class BusService<BusConfig extends BusConfigBase> {
  readonly url: string;
  readonly codec: Codec<any>;

  private _connection: NatsConnection;
  private _client: JetStreamClient;
  private _manager: JetStreamManager;

  /**
   * @deprecated Use only during development
   */
  get manager() {
    return this._manager;
  }

  publish<S extends BusConfig["subject"]>(
    stream: S,
    message: Extract<BusConfig, { subject: S }>["type"],
    headers?: Record<string, string>,
  ) {
    return this._client.publish(stream, this.codec.encode(message), {
      headers: this._prepareHeaders(headers),
    });
  }

  async consume<S extends BusConfig["stream"]>(
    stream: S,
    consumer: string,
    fn: (
      message: JsMsg,
      data: Extract<BusConfig, { stream: S }>["type"],
    ) => Promise<void> | void,
  ) {
    const client = await this._client.consumers.get(String(stream), consumer);
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

  private _prepareHeaders(rawHeaders?: Record<string, string>) {
    const preparedHeaders = headers();
    if (!rawHeaders) return preparedHeaders;
    for (const [key, value] of Object.entries(rawHeaders)) {
      preparedHeaders.append(key, value);
    }
    return preparedHeaders;
  }

  private async _setupStreams() {
    for (const stream of this._options.streams) {
      await this._manager.streams.add({
        name: stream.name,
        subjects: stream.subjects,
        max_msgs: MAX_MESSAGES,
      });
    }
  }

  private async _setupConsumers() {
    for (const consumer of this._options.consumers) {
      await this._manager.consumers.add(consumer.stream, {
        durable_name: consumer.name,
        filter_subjects: consumer.subjects,
        ack_policy: AckPolicy.Explicit,
      });
    }
  }

  async launch() {
    this._connection = await connect({ servers: this.url });
    this._manager = await this._connection.jetstreamManager();
    this._client = this._connection.jetstream();

    await this._setupStreams();
    await this._setupConsumers();

    logger.info("success launch", {
      service: BusService.name,
    });
  }

  constructor(private _options: BusOptions<BusConfig>) {
    this.url = Deno.env.get("NATS_URL") ?? "localhost";
    this.codec = JSONCodec();
  }
}
