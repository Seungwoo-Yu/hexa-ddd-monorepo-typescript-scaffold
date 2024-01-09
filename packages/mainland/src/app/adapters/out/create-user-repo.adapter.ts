import { CreateUserRepoOutPort } from '@hexa/mainland/app/ports/out/create-user-repo-out.port';
import { TransactionManagerOutPort } from '@hexa/mainland/app/ports/out/transaction-manager-out.port';
import { DataSource } from 'typeorm';
import { MikroORM } from '@mikro-orm/core';
import { IUserCommand } from '@hexa/user-context/domains/repositories/commands/user.command';
import { IUserQuery } from '@hexa/user-context/domains/repositories/queries/user.query';
import { UserCommand } from '@hexa/mainland/infra/repositories/mikro/commands/user.command';
import { UserQuery } from '@hexa/mainland/infra/repositories/typeorm/queries/user.query';
import { EntityManager as TypeEM } from 'typeorm/entity-manager/EntityManager';
import { EntityManager as MikroEM } from '@mikro-orm/core/EntityManager';
import { GlobalTransactionManagerAdapter } from '@hexa/mainland/infra/adapters/out/global-transaction-manager.adapter';

export class CreateUserRepoAdapter implements CreateUserRepoOutPort {
  private readonly typeormEM: TypeEM;
  private readonly mikroEM: MikroEM;

  public readonly transactionManager: TransactionManagerOutPort;
  public readonly command: IUserCommand;
  public readonly query: IUserQuery;

  constructor(
    typeorm: DataSource,
    mikroOrm: MikroORM,
  ) {
    const typeormQueryRunner = typeorm.createQueryRunner();
    this.typeormEM = typeorm.createEntityManager(typeormQueryRunner);
    this.mikroEM = mikroOrm.em.fork();
    this.query = new UserQuery(this.typeormEM);
    this.command = new UserCommand(this.mikroEM);
    this.transactionManager = new GlobalTransactionManagerAdapter(typeormQueryRunner, this.mikroEM);
  }
}
