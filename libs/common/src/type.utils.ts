export type Prettify<T> =
  & {
    [K in keyof T]: T[K];
  }
  // deno-lint-ignore ban-types
  & {};

export type Union<U> = (U extends any ? (k: U) => void : never) extends
  (k: infer I) => void ? I
  : never;
