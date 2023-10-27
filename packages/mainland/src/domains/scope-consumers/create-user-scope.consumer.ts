import { Credential } from '@hexa/user-context/domains/vo/credential.vo';
import { Name } from '@hexa/user-context/domains/vo/name.vo';
import { User } from '@hexa/user-context/domains/entities/user.entity';
import { ScopeConsumer } from '@hexa/common/interfaces';
import { CreateUserScope } from '@hexa/mainland/domains/scopes/create-user.scope';
import { ConsumedScope } from '@hexa/common/types';

export class DuplicatedIdError extends Error {
  constructor() {
    super('id is duplicated');
  }

  public toJSON() {
    return this.message;
  }
}

export class CreateUserScopeConsumer implements ScopeConsumer<CreateUserScope> {
  constructor(
    public readonly scope: ConsumedScope<CreateUserScope>,
  ) {}

  public async invoke(credential: Credential, name: Name) {
    if (await this.scope.userQuery.existsById(credential)) {
      throw new DuplicatedIdError();
    }

    const user = User.create(credential, name);
    await this.scope.userCommand.create(user);
  }

  public async revoke(credential: Credential) {
    const user = await this.scope.userQuery.readById(credential);

    if (user != null) {
      await this.scope.userCommand.delete(user.uid);
    }
  }
}
