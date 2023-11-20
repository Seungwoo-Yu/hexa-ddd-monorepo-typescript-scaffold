import { TransactionManagerOutPort } from '@hexa/mainland/app/ports/out/transaction-manager-out.port';
import { QueryRunner } from 'typeorm';
import { EntityManager } from '@mikro-orm/core';

export class GlobalTransactionManagerAdapter implements TransactionManagerOutPort {
  private inTransaction = false;

  constructor(
    private readonly typeormEM: QueryRunner,
    private readonly mikroEM: EntityManager,
  ) {}

  public async commit() {
    if (!this.inTransaction) {
      throw new Error('not in transaction');
    }
    this.inTransaction = false;

    await this.mikroEM.commit();
    await this.typeormEM.commitTransaction();
  }

  public async rollback() {
    if (!this.inTransaction) {
      throw new Error('not in transaction');
    }
    this.inTransaction = false;

    await this.mikroEM.rollback();
    await this.typeormEM.rollbackTransaction();
  }

  public async start() {
    if (this.inTransaction) {
      throw new Error('already in transaction');
    }
    this.inTransaction = true;

    await this.mikroEM.begin();
    await this.typeormEM.startTransaction();
  }
}
