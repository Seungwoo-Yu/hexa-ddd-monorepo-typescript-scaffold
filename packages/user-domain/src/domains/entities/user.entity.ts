import { Balance } from '@hexa/user-domain/domains/vo/balance.vo.ts';
import { Credential } from '@hexa/user-domain/domains/vo/credential.vo.ts';
import { Name } from '@hexa/user-domain/domains/vo/name.vo.ts';
import { UlidUid } from '@hexa/user-domain/domains/vo/ulid-uid.vo.ts';

export abstract class IUser {
  protected constructor(
    public uid: UlidUid,
    public credential: Credential,
    public name: Name,
    public balance: Balance,
  ) {}

  public changeCredential(credential: Credential) {
    if (this.credential.id !== credential.id) {
      throw new Error('id must be immutable');
    }

    if (this.credential.equals(credential)) {
      throw new Error('credential is not changed');
    }

    this.credential = credential;
  }

  public changeName(name: Name) {
    if (this.name.equals(name)) {
      throw new Error('name is not changed');
    }

    this.name = name;
  }
}
