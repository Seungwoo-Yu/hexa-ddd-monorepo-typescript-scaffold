export interface TransactionManagerOutPort {
  start(): Promise<void>,
  commit(): Promise<void>,
  rollback(): Promise<void>,
}
