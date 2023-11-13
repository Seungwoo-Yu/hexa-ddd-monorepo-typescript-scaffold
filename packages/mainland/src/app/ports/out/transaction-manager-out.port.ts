export interface TransactionManagerOutPort<T extends Readonly<Array<unknown>>> {
  repos: T,
  transaction(func: (tm: T) => Promise<void>): Promise<void>,
}
