import { Credential } from '@hexa/user-context/domains/vo/credential.vo';
import { Name } from '@hexa/user-context/domains/vo/name.vo';

export interface CreateUserInPort {
  invoke(credential: Credential, name: Name): Promise<void>,
}
