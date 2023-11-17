import { Credential } from '@hexa/user-context/domains/vo/credential.vo';
import { Name } from '@hexa/user-context/domains/vo/name.vo';
import { CreateUserInPort } from '@hexa/mainland/app/ports/in/create-user-in.port';
import { User } from '@hexa/user-context/domains/entities/user.entity';
import { TransactionManagerOutPort } from '@hexa/mainland/app/ports/out/transaction-manager-out.port';
import { IUserQuery } from '@hexa/user-context/domains/repositories/queries/user.query';
import { IUserCommand } from '@hexa/user-context/domains/repositories/commands/user.command';

export class DuplicatedIdError extends Error {
  constructor() {
    super('id is duplicated');
  }

  // noinspection JSUnusedGlobalSymbols
  public toJSON() {
    return this.message;
  }
}

export type CreateUserRepo = readonly [IUserQuery, IUserCommand];

export class CreateUserUseCase implements CreateUserInPort {
  constructor(
    private readonly transactionManager: TransactionManagerOutPort<CreateUserRepo>,
  ) {}

  public async invoke(credential: Credential, name: Name) {
    const [userQuery, userCommand] = this.transactionManager.repos;
    if (await userQuery.existsById(credential)) {
      throw new DuplicatedIdError();
    }

    const user = User.create(credential, name);
    await userCommand.create(user);
  }
}
