import EventEmitter from 'events';

export type EventMap = Record<string, any>;
export type EventKey<T extends EventMap> = string & keyof T;
export type EventReceiver<T> = (params: T) => void;

export class EmitterService<T extends EventMap> {
  private emitter = new EventEmitter();

  public on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>) {
    this.emitter.on(eventName, fn);
  }

  public off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>) {
    this.emitter.off(eventName, fn);
  }

  public emit<K extends EventKey<T>>(eventName: K, params: T[K]) {
    this.emitter.emit(eventName, params);
  }
}
