import { Credential } from '@hexa/user-context/domains/vo/credential.vo';
import { Name } from '@hexa/user-context/domains/vo/name.vo';
import { CreateUserScope } from '@hexa/mainland/domains/scopes/create-user.scope';
import { CreateUserScopeConsumer } from '@hexa/mainland/domains/scope-consumers/create-user-scope.consumer';

export class CreateUserUseCase {
  constructor(
    private readonly scope: CreateUserScope,
  ) {}

  public async invoke(credential: Credential, name: Name) {
    const scopeRunner = new CreateUserScopeConsumer(this.scope);
    await scopeRunner.invoke(credential, name);
  }
}
