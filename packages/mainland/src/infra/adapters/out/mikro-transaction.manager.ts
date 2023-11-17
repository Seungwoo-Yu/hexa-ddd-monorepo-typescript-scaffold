import { RepositoryFactory } from '@hexa/mainland/infra/interfaces/repository-factory.interface';
import { TransactionManagerOutPort } from '@hexa/mainland/app/ports/out/transaction-manager-out.port';
import { MikroRepository } from '@hexa/mainland/infra/repositories/mikro/mikro.repository';
import { EntityManager } from '@mikro-orm/core';

export abstract class MikroTransactionManager<T extends Readonly<Array<MikroRepository>>>
  implements RepositoryFactory<T>, TransactionManagerOutPort<T> {
  public readonly repos = this.createRepo(this.em);

  protected constructor(
    protected readonly em: EntityManager,
  ) {}

  public abstract createRepo(em: EntityManager): T;

  public async transaction(func: (tm: T) => Promise<void>) {
    await this.em.transactional(async em => {
      await func(this.createRepo(em));
    });
  }
}
