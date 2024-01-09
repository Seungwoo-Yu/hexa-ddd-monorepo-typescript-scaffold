import { Credential } from '@hexa/user-context/domains/vo/credential.vo';
import { Name } from '@hexa/user-context/domains/vo/name.vo';
import { CreateUserInPort } from '@hexa/mainland/app/ports/in/create-user-in.port';
import { CreateUserRepoOutPort } from '@hexa/mainland/app/ports/out/create-user-repo-out.port';
import { UserFactory } from '@hexa/user-context/domains/factories/user.factory';

export class CreateUserUseCase implements CreateUserInPort {
  constructor(
    private readonly repo: CreateUserRepoOutPort,
  ) {}

  public async invoke(credential: Credential, name: Name) {
    await UserFactory.generate(
      this.repo.query,
      this.repo.command,
      { credential, name },
    );
  }
}
