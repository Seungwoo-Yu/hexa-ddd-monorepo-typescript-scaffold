export interface TransactionManagerOutPort {
  start(): Promise<void>,
  commit(): Promise<void>,
  rollback(): Promise<void>,
  run<T>(cb: () => Promise<T>): Promise<T>,
}
