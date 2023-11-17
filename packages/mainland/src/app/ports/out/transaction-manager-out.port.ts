export interface TransactionManagerOutPort<T extends Readonly<Array<unknown>>> {
  readonly repos: T,
  transaction(func: (tm: T) => Promise<void>): Promise<void>,
}
