import { Credential } from '@hexa/user-context/domains/vo/credential.vo';
import { Name } from '@hexa/user-context/domains/vo/name.vo';
import { CreateUserInPort } from '@hexa/mainland/app/ports/in/create-user-in.port';
import { User } from '@hexa/user-context/domains/entities/user.entity';
import { CreateUserRepoOutPort } from '@hexa/mainland/app/ports/out/create-user-repo-out.port';

export class DuplicatedIdError extends Error {
  constructor() {
    super('id is duplicated');
  }

  // noinspection JSUnusedGlobalSymbols
  public toJSON() {
    return this.message;
  }
}

export class CreateUserUseCase implements CreateUserInPort {
  constructor(
    private readonly repo: CreateUserRepoOutPort,
  ) {}

  public async invoke(credential: Credential, name: Name) {
    await this.repo.transactionManager.start();

    if (await this.repo.query.existsById(credential)) {
      throw new DuplicatedIdError();
    }

    const user = User.create(credential, name);
    await this.repo.command.create(user);

    await this.repo.transactionManager.commit();
  }
}
