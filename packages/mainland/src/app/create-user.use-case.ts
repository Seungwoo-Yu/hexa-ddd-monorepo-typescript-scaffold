import { Credential } from '@hexa/user-context/domains/vo/credential.vo';
import { Name } from '@hexa/user-context/domains/vo/name.vo';
import { TransactionManagerOutPort } from '@hexa/mainland/app/ports/out/transaction-manager-out.port';
import { IUserQuery } from '@hexa/user-context/domains/repositories/queries/user.query';
import { IUserCommand } from '@hexa/user-context/domains/repositories/commands/user.command';
import { CreateUserScope } from '@hexa/mainland/domains/scopes/create-user.scope';

export class CreateUserUseCase {
  constructor(
    private readonly transactionManager: TransactionManagerOutPort<readonly [IUserQuery, IUserCommand]>,
  ) {}

  public async invoke(credential: Credential, name: Name) {
    const [userQuery, userCommand] = this.transactionManager.repos;
    const scopeRunner = new CreateUserScope(userQuery, userCommand);
    await scopeRunner.invoke(credential, name);
  }
}
