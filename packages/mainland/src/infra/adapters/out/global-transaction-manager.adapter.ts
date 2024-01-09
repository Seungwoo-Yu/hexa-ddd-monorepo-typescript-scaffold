import { TransactionManagerOutPort } from '@hexa/mainland/app/ports/out/transaction-manager-out.port';
import { QueryRunner } from 'typeorm';
import { EntityManager } from '@mikro-orm/core';
import { Enum } from '@hexa/common/types';

export const InvalidTransactionStatusReason = [
  'not_in_transaction',
  'already_in_transaction',
] as const;

export class InvalidTransactionStatus extends Error {
  constructor(reason: Enum<typeof InvalidTransactionStatusReason>) {
    super('invalid transaction status detected: ' + reason);
  }
}

export class GlobalTransactionManagerAdapter implements TransactionManagerOutPort {
  private inTransaction = false;

  constructor(
    private readonly typeormQR: QueryRunner,
    private readonly mikroEM: EntityManager,
  ) {}

  public async commit() {
    if (!this.inTransaction) {
      throw new InvalidTransactionStatus('not_in_transaction');
    }
    this.inTransaction = false;

    await this.mikroEM.commit();
    await this.typeormQR.commitTransaction();
  }

  public async rollback() {
    if (!this.inTransaction) {
      throw new InvalidTransactionStatus('not_in_transaction');
    }
    this.inTransaction = false;

    await this.mikroEM.rollback();
    await this.typeormQR.rollbackTransaction();
  }

  public async start() {
    if (this.inTransaction) {
      throw new InvalidTransactionStatus('already_in_transaction');
    }
    this.inTransaction = true;

    await this.mikroEM.begin();
    await this.typeormQR.startTransaction();
  }

  public async run<T>(cb: () => Promise<T>) {
    await this.start();
    try {
      const result = await cb();
      await this.commit();

      return result;
    } catch (e) {
      await this.rollback();

      throw e;
    }
  }
}
