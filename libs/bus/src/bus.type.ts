export interface BusStream<S extends string> {
  name: S;
  subjects: string[];
}

export interface BusConsumer<S extends string> {
  name: string;
  stream: S;
  subjects?: string[];
}

export interface BusOptions<S extends string> {
  streams: BusStream<S>[];
  consumers: BusConsumer<S>[];
}
