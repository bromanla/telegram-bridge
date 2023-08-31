import { CacheInstance } from '#src/common/cache.instance.js';
import type { CacheOption } from '#src/common/cache.instance.js';

export function Cache(option?: CacheOption) {
  return function <This, Args extends [number], Return>(
    target: (this: This, ...args: Args) => Promise<Return>,
    _: ClassMethodDecoratorContext<
      This,
      (this: This, ...args: Args) => Promise<Return>
    >,
  ) {
    const cache = new CacheInstance<number, Return>(option);

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
