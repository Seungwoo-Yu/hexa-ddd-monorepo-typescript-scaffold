import { GlobalRepositoryManager } from '@hexa/mainland/infra/adapters/out/global-repository.manager';
import { TransactionManagerOutPort } from '@hexa/mainland/app/ports/out/transaction-manager-out.port';
import { IUserQuery } from '@hexa/user-context/domains/repositories/queries/user.query';
import { IUserCommand } from '@hexa/user-context/domains/repositories/commands/user.command';
import { UserCommand } from '@hexa/mainland/infra/repositories/mikro/commands/user.command';
import { DataSource } from 'typeorm';
import { MikroORM } from '@mikro-orm/core';
import { UserQuery } from '@hexa/mainland/infra/repositories/typeorm/queries/user.query';

export class CreateUserRepository extends GlobalRepositoryManager
  implements TransactionManagerOutPort<readonly [IUserQuery, IUserCommand]> {
  public repos = [
    new UserQuery(this.typeormEM),
    new UserCommand(this.mikroEM),
  ] as const;

  public static create(typeorm: DataSource, mikroOrm: MikroORM) {
    return new CreateUserRepository(typeorm.createEntityManager(), mikroOrm.em.fork());
  }

  public async transaction(
    func: (tm: readonly [IUserQuery, IUserCommand]) => Promise<void>,
  ) {
    await this.typeormEM.transaction(async typeormEM => {
      await this.mikroEM.transactional(async mikroEM => {
        await func([new UserQuery(typeormEM), new UserCommand(mikroEM)]);
      });
    });
  }
}
