import { EntityManager as TypeEM } from 'typeorm';
import { EntityManager as MikroEM } from '@mikro-orm/core';
import { TransactionManagerOutPort } from '@hexa/mainland/app/ports/out/transaction-manager-out.port';
import { RepositoryFactory } from '@hexa/mainland/infra/interfaces/repository-factory.interface';

export abstract class GlobalTransactionManager<T extends Readonly<Array<unknown>>>
  implements RepositoryFactory<T>, TransactionManagerOutPort<T> {
  public readonly repos = this.createRepo(this.typeormEM, this.mikroEM);

  protected constructor(
    protected readonly typeormEM: TypeEM,
    protected readonly mikroEM: MikroEM,
  ) {}

  public abstract createRepo(typeormEM: TypeEM, mikroEM: MikroEM): T;

  public async transaction(func: (tm: T) => Promise<void>): Promise<void> {
    await this.typeormEM.transaction(async typeormEM => {
      await this.mikroEM.transactional(async mikroEM => {
        await func(this.createRepo(typeormEM, mikroEM));
      });
    });
  }
}
