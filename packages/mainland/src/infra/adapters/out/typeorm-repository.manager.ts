import { RepositoryFactory } from '@hexa/mainland/infra/interfaces/repository-factory.interface';
import { TransactionManagerOutPort } from '@hexa/mainland/app/ports/out/transaction-manager-out.port';
import { TypeormRepository } from '@hexa/mainland/infra/repositories/typeorm/typeorm.repository';
import { EntityManager } from 'typeorm';

export abstract class TypeormRepositoryManager<T extends Readonly<Array<TypeormRepository>>>
  implements RepositoryFactory<T>, TransactionManagerOutPort<T> {
  public readonly repos = this.createRepo(this.em);

  protected constructor(
    protected readonly em: EntityManager,
  ) {}

  public abstract createRepo(em: EntityManager): T;

  public async transaction(func: (tm: T) => Promise<void>) {
    await this.em.transaction(async em => {
      await func(this.createRepo(em));
    });
  }
}
