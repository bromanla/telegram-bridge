import ms from 'ms';

type CacheValue<V> = {
  value: V;
  expiresAt: number;
};

export type CacheOption = {
  /**
   * Time to live in ms
   */
  ttl?: number;
  /**
   * Max size cache storage
   */
  size?: number;
  /**
   * Deleting records with a periodicity
   */
  period?: number;
};

export class CacheInstance<K, V> {
  private readonly storage = new Map<K, CacheValue<V>>();
  private readonly ttl: number;
  private readonly size: number;
  private readonly period: number;

  constructor(option?: CacheOption) {
    this.ttl = option?.ttl ?? ms('10m');
    this.size = option?.size ?? -1;
    this.period = option?.period ?? ms('1m');

    this.startTimer();
  }

  private startTimer() {
    setTimeout(() => {
      const now = Date.now();

      for (const [key, value] of this.storage.entries()) {
        if (value.expiresAt <= now) {
          this.storage.delete(key);
        }
      }

      this.startTimer();
    }, this.period);
  }

  private deleteOlderValue() {
    const key = this.storage.keys().next().value;
    this.storage.delete(key);
  }

  public get(key: K) {
    return this.storage.get(key)?.value;
  }

  public delete(key: K) {
    this.storage.delete(key);
  }

  public set(key: K, value: V) {
    if (this.size !== -1 && this.storage.size >= this.size)
      this.deleteOlderValue();

    this.storage.set(key, {
      value,
      expiresAt: Date.now() + this.ttl,
    });
  }
}
