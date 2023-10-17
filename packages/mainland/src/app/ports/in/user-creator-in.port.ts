import { Credential } from '@hexa/user-context/domains/vo/credential.vo';
import { Name } from '@hexa/user-context/domains/vo/name.vo';

export interface UserCreatorInPort {
  create(credential: Credential, name: Name): Promise<void>,
}

export class UserCreatorDuplicatedIdError extends Error {
  constructor() {
    super('id is duplicated');
  }

  public toJSON() {
    return this.message;
  }
}
