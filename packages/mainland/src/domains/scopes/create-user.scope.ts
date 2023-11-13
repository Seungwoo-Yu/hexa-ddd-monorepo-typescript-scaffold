import { Credential } from '@hexa/user-context/domains/vo/credential.vo';
import { Name } from '@hexa/user-context/domains/vo/name.vo';
import { User } from '@hexa/user-context/domains/entities/user.entity';
import { IUserQuery } from '@hexa/user-context/domains/repositories/queries/user.query';
import { IUserCommand } from '@hexa/user-context/domains/repositories/commands/user.command';
import { Invocable } from '@hexa/common/interfaces';

export class DuplicatedIdError extends Error {
  constructor() {
    super('id is duplicated');
  }

  // noinspection JSUnusedGlobalSymbols
  public toJSON() {
    return this.message;
  }
}

export class CreateUserScope implements Invocable {
  constructor(
    public readonly userQuery: IUserQuery,
    public readonly userCommand: IUserCommand,
  ) {}

  public async invoke(credential: Credential, name: Name) {
    if (await this.userQuery.existsById(credential)) {
      throw new DuplicatedIdError();
    }

    const user = User.create(credential, name);
    await this.userCommand.create(user);
  }
}
