import { GeneratorOf } from '@hexa/common/interfaces';
import { PickType } from '@hexa/common/types';
import { Credential } from '@hexa/sysadmin-context/domains/vo/credential.vo';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { Sysadmin } from '@hexa/sysadmin-context/domains/entities/sysadmin.entity';
import { UlidUid } from '@hexa/sysadmin-context/domains/vo/ulid-uid.vo';
import { ISysadminQuery } from '@hexa/sysadmin-context/domains/repositories/queries/sysadmin.query';
import { ISysadminCommand } from '@hexa/sysadmin-context/domains/repositories/commands/sysadmin.command';


export class SysadminIdDuplicatedError extends Error {
  constructor(
    stoadminId: PickType<Credential, 'id'>,
  ) {
    super('id ' + stoadminId + ' is duplicated');
  }
}

@AssertStaticInterface<GeneratorOf<Sysadmin>>()
export class SysadminFactory {
  public static create(user: Pick<Sysadmin, 'credential' | 'name'>) {
    return new Sysadmin(
      UlidUid.create(),
      user.credential,
      user.name,
    );
  }

  public static async generate(
    sysadminQuery: ISysadminQuery,
    sysadminCommand: ISysadminCommand,
    _sysadmin: Pick<Sysadmin, 'credential' | 'name'>,
  ) {
    if (await sysadminQuery.existsById(_sysadmin.credential.id)) {
      throw new SysadminIdDuplicatedError(_sysadmin.credential.id);
    }

    const user = SysadminFactory.create(_sysadmin);

    await sysadminCommand.create(user);

    return user;
  }
}
