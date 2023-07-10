export type ReadOnlyProperty<T, U extends keyof T> = {
  readonly [P in keyof Pick<T, U>]: T[P];
} & {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  [P in keyof Exclude<T, U>]: T[P];
};
export type PartialExcept<T, U extends keyof T> = {
  [P in keyof Pick<T, U>]: T[P];
} & {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  [P in keyof Exclude<T, U>]?: T[P];
};
export type PickType<T, U extends keyof T> = T[U];
export type Enum<T extends readonly unknown[]> = T extends readonly (infer U)[] ? U : never;
export type FunctionPropertyNames<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
export type OmitFuncs<T> = Omit<T, FunctionPropertyNames<T>>;
