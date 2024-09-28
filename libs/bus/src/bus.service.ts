import { connect, JSONCodec, headers, AckPolicy } from 'nats';
import { logger } from '@bridge/common';
import { MAX_MESSAGES } from '#src/bus.constant.js';

import type { BusOptions } from '#src/bus.type.js';
import type {
  Codec,
  NatsConnection,
  JetStreamClient,
  JetStreamManager,
} from 'nats';

export class BusService<
  BusStream extends readonly string[],
  BusData extends Record<BusStream[number], unknown>,
> {
  readonly url: string;
  readonly codec: Codec<unknown>;

  private _connection: NatsConnection;
  private _client: JetStreamClient;
  private _manager: JetStreamManager;

  constructor(private _options: BusOptions<BusStream[number]>) {
    this.url = process.env.NATS_URL ?? 'localhost';
    this.codec = JSONCodec();
  }

  /**
   * @deprecated Use only during development
   */
  get manager() {
    return this._manager;
  }

  publish<S extends BusStream[number]>(
    stream: S,
    message: Omit<BusData[S], '_type'>,
    headers?: Record<string, string>,
  ) {
    return this._client.publish(stream, this.codec.encode(message), {
      headers: this._prepareHeaders(headers),
    });
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

    logger.info({
      service: BusService.name,
      message: 'success launch',
    });
  }
}
