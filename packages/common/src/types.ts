import { IsolatedScope, Scope } from '@hexa/common/interfaces';

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
export type PickNestedType<T, U extends Array<keyof T>> =
  U extends [keyof T, ...infer V]
    ? V extends []
      ? PickType<T, U[0]>
      : V extends Array<keyof PickType<T, U[0]>>
        ? PickNestedType<PickType<T, U[0]>, V>
        : never
    : never;
export type Enum<T extends readonly unknown[]> = T extends readonly (infer U)[] ? U : never;
export type FunctionPropertyNames<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
export type OmitFuncs<T> = Omit<T, FunctionPropertyNames<T>>;
export type ConsumedScope<T extends Scope | IsolatedScope> = T extends Scope
  ? Omit<T, 'runInScope' | 'runInIsolatedScope'>
  : Omit<T, 'runInIsolatedScope'>;
