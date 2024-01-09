import { GeneratorOf } from '@hexa/common/interfaces';
import { User } from '@hexa/user-context/domains/entities/user.entity';
import { UlidUid } from '@hexa/user-context/domains/vo/ulid-uid.vo';
import { Balance } from '@hexa/user-context/domains/vo/balance.vo';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { IUserQuery } from '@hexa/user-context/domains/repositories/queries/user.query';
import { IUserCommand } from '@hexa/user-context/domains/repositories/commands/user.command';
import { PickType } from '@hexa/common/types';
import { Credential } from '@hexa/user-context/domains/vo/credential.vo';

export class UserIdDuplicatedError extends Error {
  constructor(
    stoadminId: PickType<Credential, 'id'>,
  ) {
    super('id ' + stoadminId.id + ' is duplicated');
  }

  // noinspection JSUnusedGlobalSymbols
  public toJSON() {
    return this.toString();
  }
}

@AssertStaticInterface<GeneratorOf<User>>()
export class UserFactory {
  public static create(user: Pick<User, 'credential' | 'name'>) {
    return new User(
      UlidUid.create(),
      user.credential,
      user.name,
      new Balance(0),
    );
  }

  public static async generate(
    userQuery: IUserQuery,
    userCommand: IUserCommand,
    _user: Pick<User, 'credential' | 'name'>,
  ) {
    if (await userQuery.existsById(_user.credential.id)) {
      throw new UserIdDuplicatedError(_user.credential.id);
    }

    const user = UserFactory.create(_user);

    await userCommand.create(user);

    return user;
  }
}
