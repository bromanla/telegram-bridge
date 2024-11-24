import type { Prettify } from "@bridge/common";

type BusItem<K, P, T> = {
  subject: `${K & string}.${P & string}`;
  stream: K;
  data: T;
};

/**
 * I couldn't output a strict Tuple
 */
export type GroupByStream<T extends BusItem<string, string, unknown>> = {
  [K in T["stream"]]: Extract<T, { stream: K }>["subject"][];
};

/**
 * Convert to a flat structure with multiple duplications
 */
type BusTransform<T> = {
  [K in keyof T]: {
    [P in keyof T[K]]: BusItem<K, P, T[K][P]>;
  }[keyof T[K]];
}[keyof T];

/**
 * Human-readable type structure for the broker
 */
type Store = {
  "messages": {
    "audio": {
      url: string;
    };
    "video": {
      text: string;
    };
  };
  "notification": {
    "warn": {
      message: string;
    };
  };
};

export type BusStore = Prettify<BusTransform<Store>>;

export type BusStream<T extends BusStore["stream"]> = Extract<
  BusStore,
  { stream: T }
>;

export type BusSubject<T extends BusStore["subject"]> = Extract<
  BusStore,
  { subject: T }
>;
