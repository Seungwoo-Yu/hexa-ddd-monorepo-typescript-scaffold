import { GlobalTransactionManager } from '@hexa/mainland/infra/adapters/out/global-transaction.manager';
import { UserCommand } from '@hexa/mainland/infra/repositories/mikro/commands/user.command';
import { DataSource } from 'typeorm';
import { MikroORM } from '@mikro-orm/core';
import { UserQuery } from '@hexa/mainland/infra/repositories/typeorm/queries/user.query';
import { EntityManager as TypeEM } from 'typeorm/entity-manager/EntityManager';
import { EntityManager as MikroEM } from '@mikro-orm/core/EntityManager';
import { type CreateUserRepo } from '@hexa/mainland/app/create-user.use-case';

export class CreateUserTransactionManager extends GlobalTransactionManager<CreateUserRepo> {
  constructor(typeorm: DataSource, mikroOrm: MikroORM) {
    super(typeorm.createEntityManager(), mikroOrm.em.fork());
  }

  public createRepo(typeormEM: TypeEM, mikroEM: MikroEM): CreateUserRepo {
    return [new UserQuery(typeormEM), new UserCommand(mikroEM)];
  }
}
