import { CreateUserScope } from '@hexa/mainland/domains/scopes/create-user.scope';
import { MikroAdapter } from '@hexa/mainland/infra/adapters/out/mikro/mikro.adapter';
import { UserCommand } from '@hexa/mainland/infra/repositories/mikro/commands/user.command';
import { UserQuery } from '@hexa/mainland/infra/repositories/mikro/queries/user.query';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { ScopeStartOption } from '@hexa/common/interfaces';
import { MikroORM } from '@mikro-orm/core';

@AssertStaticInterface<ScopeStartOption<CreateUserScopeAdapter>>()
export class CreateUserScopeAdapter extends MikroAdapter implements CreateUserScope {
  public userCommand = new UserCommand(this.em);
  public userQuery = new UserQuery(this.em);

  public static async start(orm: MikroORM) {
    return new CreateUserScopeAdapter(orm, orm.em.fork());
  }

  public async runInIsolatedScope(func: (scope: CreateUserScope) => Promise<void>) {
    const forked = this.orm.em.fork();

    try {
      await forked.begin();
      await func(new CreateUserScopeAdapter(this.orm, forked));
      forked.clear();
    } catch (e) {
      await forked.rollback();
      forked.clear();
      throw e;
    }
  }

  public async runInScope(func: (scope: CreateUserScope) => Promise<void>) {
    await func(new CreateUserScopeAdapter(this.orm, this.em));
  }
}
