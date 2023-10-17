import { UserCreatorDuplicatedIdError, UserCreatorInPort } from '../ports/in/user-creator-in.port';
import { UserCreatorOutPort } from '../ports/out/user-creator-out.port';
import { UserCheckerOutPort } from '../ports/out/user-checker.out.port';
import { Credential } from '@hexa/user-context/domains/vo/credential.vo';
import { Name } from '@hexa/user-context/domains/vo/name.vo';
import { UserCredentialId } from '@hexa/mainland/app/vo/user-credential-id.vo';
import { User } from '@hexa/user-context/domains/entities/user.entity';

export class CreateUserUseCase implements UserCreatorInPort {
  constructor(
    private readonly userCheckerOutPort: UserCheckerOutPort,
    private readonly userCreatorOutPort: UserCreatorOutPort,
  ) {}

  public async create(credential: Credential, name: Name) {
    const userCredentialId = UserCredentialId.fromUserCtx(credential);

    if (await this.userCheckerOutPort.exists(userCredentialId)) {
      throw new UserCreatorDuplicatedIdError();
    }

    const user = User.create(credential, name);
    await this.userCreatorOutPort.create(user);
  }
}
