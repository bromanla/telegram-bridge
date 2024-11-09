import { LruCache } from "@std/cache";

interface CacheOption {
  maxSize?: number;
}

export function cache(option?: CacheOption) {
  return function <This, Args extends [number], Return>(
    target: (this: This, ...args: Args) => Promise<Return>,
    _: ClassMethodDecoratorContext<
      This,
      (this: This, ...args: Args) => Promise<Return>
    >,
  ) {
    const maxSize = option?.maxSize ?? 100;
    const cache = new LruCache<number, Return>(maxSize);

    return async function (this: This, ...args: Args) {
      const [id] = args;

      const cacheData = cache.get(id);
      if (cacheData) return cacheData;

      const data = await target.call(this, ...args);
      if (data) cache.set(id, data);

      return data;
    };
  };
}
