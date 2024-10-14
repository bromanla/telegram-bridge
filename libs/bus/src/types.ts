export interface BusConfigBase {
  stream: string;
  subject: string;
  type: any;
}

export interface BusStream<C extends BusConfigBase> {
  name: C["stream"];
  subjects: C["subject"][];
}

export interface BusConsumer<C extends BusConfigBase> {
  name: string;
  stream: C["stream"];
  subjects?: C["subject"][];
}

export interface BusOptions<C extends BusConfigBase> {
  streams: BusStream<C>[];
  consumers: BusConsumer<C>[];
}
